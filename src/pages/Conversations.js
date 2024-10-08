import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import http from "../plugins/http";
import mainStore from "../store/mainStore";
import SingleMessage from "../components/SingleMessage";
import {useNavigate, useParams} from "react-router-dom";
import SuccessComp from "../components/SuccessComp";
import ErrorComp from "../components/ErrorComp";

const Conversations = () => {
    const messageRef = useRef();
    const containerRef = useRef();
    const messagesEndRef = useRef();
    const { currentUser, token } = mainStore();
    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState(null);
    const [participants, setParticipants] = useState(null);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [displayUsers, setDisplayUsers] = useState(false);
    const [messages, setMessages] = useState([]);
    const [showButton, setShowButton] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { conversationId } = useParams();
    const nav = useNavigate()

    // Function to fetch non-participants
    const fetchNonParticipants = async () => {
        try {
            const res = await http.get(`/conversation/${conversationId}/non-participants`);
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching non-participants:', error);
        }
    };

    useEffect(() => {
        const newSocket = io('http://localhost:2000');
        setSocket(newSocket);

        newSocket.on('message', (message) => {
            setMessages((prevMessages) => (prevMessages ? [...prevMessages, message] : [message]));
        });

        newSocket.on('likeMessage', (messages) => {
            setMessages(messages);
        });

        // Handle messageReceived event
        newSocket.on('messageReceived', () => {
            fetchNonParticipants();  // Fetch non-participants when a message is received
        });

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const res = await http.get(`/conversation/${conversationId}`);
                if (!res.error) {
                    setMessages(res.data.messages);
                    setParticipants(res.data.participants); // Update participants
                    const filteredUser = res.data.participants.find(user => user.username !== currentUser?.username);
                    setSelectedUser(filteredUser);
                } else {
                    setError(res.message);
                }
            } catch (err) {
                setError("Failed to fetch conversation");
            }
        };

        fetchConversation();
    }, [conversationId, currentUser?.username]);

    useEffect(() => {
        fetchNonParticipants(); // Initial fetch
    }, [conversationId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleLikeMessage = async (messageId) => {
        if (!currentUser || !selectedUser) return; // Add a check to ensure these objects exist

        try {
            const res = await http.postAuth('/like-message-private', {
                messageId,
                username: currentUser.username,
                recipient: selectedUser,
                sender: currentUser
            }, token);

            if (!res.error) {
                const message = res.data;
                socket.emit('likeMessage', message);
            }
        } catch (error) {
            console.error("Failed to like message:", error);
        }
    };

    const sendMessage = async () => {
        if (!currentUser || !selectedUser) return; // Add a check to ensure these objects exist

        const timestamp = Math.floor(Date.now() / 1000);
        if (messageRef.current.value.length < 1 || messageRef.current.value.length > 200) {
            return setError('Message should be longer than 1 symbol and shorter than 200.');
        }

        const convertTimestamp = (timestamp) => {
            const date = new Date(timestamp * 1000);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${year}/${month}/${day} ${hours}:${minutes}`;
        };

        const formattedTimestamp = convertTimestamp(timestamp);

        const data = {
            sender: currentUser.username,
            recipient: selectedUser.username,
            message: messageRef.current.value,
            timestamp: formattedTimestamp,
            senderImage: currentUser.image,
            recipientImage: selectedUser.image,
        };

        const res = await http.postAuth("/send-message", data, token);
        if (!res.error) {
            socket.emit('chatMessage', {
                sender: currentUser.username,
                recipient: selectedUser.username,
                message: messageRef.current.value,
                timestamp: formattedTimestamp,
                senderImage: currentUser.image,
                recipientImage: selectedUser.image,
                _id: res.data._id
            });

            messageRef.current.value = '';
        } else {
            console.log(res.message);
        }
    };

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop } = containerRef.current;
            setShowButton(scrollTop > 100);
        }
    };

    const handleLoadEarlier = async () => {
        if (selectedUser && currentUser) { // Add a check to ensure these objects exist
            try {
                const res = await http.get(`/get-earlier-messages/${currentUser.username}/${selectedUser.username}`);
                if (!res.error) {
                    setMessages(prevMessages => [...res.data, ...prevMessages]);
                } else {
                    console.error(res.message);
                }
            } catch (error) {
                console.error("Failed to fetch earlier messages:", error);
            }
        }
    };

    const addUser = async (username) => {
        if (!currentUser) return; // Add a check to ensure currentUser exists

        try {
            const res = await http.postAuth(`/conversation/${conversationId}/${username}`, { user: { username } }, token);
            if (!res.error) {
                setDisplayUsers(false);  // Hide the user list
                setSuccessMsg(res.message);  // Set the success message
                const newUser = { username };  // Assuming the user object contains at least the username
                setParticipants(prevParticipants => [...prevParticipants, newUser]);
                socket.emit("userAdded");

                // Set successMsg back to null after 3 seconds
                setTimeout(() => {
                    setSuccessMsg(null);
                }, 3000);
            } else {
                setErrorMsg(res.message);
                setTimeout(() => {
                    setErrorMsg(null);
                }, 3000);
            }
        } catch (error) {
            console.error("Failed to add user:", error);
        }
    };

    return (
        <div className="flex flex-col bg-gradient-to-r from-indigo-500 to-violet-400 p-16">
            <div className="flex gap-3">
                {currentUser && <div className={`w-full flex gap-3`}>
                    <div className="flex flex-col w-full bg-white rounded-3xl">

                        <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-xl ">
                            {selectedUser && <img className='w-14 h-14 rounded-full' src={selectedUser?.image} alt="" />}
                            <div className="flex justify-between w-full">
                                <div className="">
                                    <p className={`text-gray-500 font-semibold`}>
                                        Chat with: {
                                        participants
                                            ?.filter(p => p.username !== currentUser?.username) // Ensure currentUser is not null
                                            .map(p => p.username)
                                            .join(', ')
                                    }
                                    </p>
                                </div>

                                <div className="">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         onClick={() => setDisplayUsers(!displayUsers)}
                                         strokeWidth="1.5"
                                         stroke="currentColor"
                                         className="size-6 text-gray-400 me-5 hover:text-gray-500 cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div
                            ref={containerRef}
                            className="flex flex-col min-h-[620px] max-h-[620px] p-3 overflow-auto"
                            onScroll={handleScroll}
                        >
                            {messages?.map((message, i) => (
                                <SingleMessage handleLikeMessage={handleLikeMessage} participants={participants} key={i}
                                               message={message} />
                            ))}
                            {successMsg && <SuccessComp msg={successMsg}/>}
                            {errorMsg && <ErrorComp error={errorMsg}/>}
                            <div ref={messagesEndRef} />
                            {/* For scrolling to the bottom */}
                        </div>
                        {showButton && (
                            <button
                                onClick={handleLoadEarlier}
                                className="absolute hidden bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-2 rounded"
                            >
                                Load Earlier
                            </button>
                        )}
                        <div className="flex p-3 bg-gray-100 rounded-xl">
                            <div className="w-full flex gap-2 items-center text-gray-500">
                                <input
                                    ref={messageRef}
                                    type="text"
                                    id="default-input"
                                    placeholder={`Type your message`}
                                    className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                                <svg
                                    onClick={sendMessage}
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                    stroke="currentColor" className="size-6 cursor-pointer hover:text-gray-800"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    {displayUsers &&
                        <div className={`bg-white rounded-3xl w-[300px] overflow-hidden flex flex-col justify-between`}>
                            <div className="bg-gray-100 p-6">
                                <p className="text-gray-700 font-semibold">Add Users to the chat</p>
                            </div>
                            <div className="flex flex-col h-full gap-3 overflow-auto">
                                {users?.map((x, i) =>
                                    <div key={i} className={`w-full text-lg text-start flex flex-col items-center `}>
                                        <div className="flex w-full justify-between py-2 ps-4 items-center">
                                            <div className="">{x.username}</div>
                                            <div className="">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     onClick={() => addUser(x.username)}
                                                     strokeWidth="1.5"
                                                     stroke="currentColor"
                                                     className="size-5 text-gray-400 me-5 hover:text-gray-500 cursor-pointer">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="bg-gray-200 w-full h-[1px]"></div>
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-100 p-8"></div>
                        </div>
                    }
                </div>
                }
                {!currentUser &&
                    <div className={`h-[600px] bg-white rounded-2xl p-3 w-full flex flex-col justify-end items-center`}>
                        <p className="font-semibold text-gray-600">Please Log In to send a message</p>
                        <button type="button"
                                onClick={() => nav('/login')}
                                className="text-white w-[300px] mt-5 bg-indigo-600 hover:bg-indigo-500  focus:outline-none focus:ring-4 focus:ring-orange-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-orange-900">Login

                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Conversations;
