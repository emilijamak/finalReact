import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import http from "../plugins/http";
import mainStore from "../store/mainStore";
import SingleMessage from "../components/SingleMessage";
import {useParams} from "react-router-dom";

const Conversations = () => {

    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState(null);
    const [participants, setParticipants] = useState(null)
    const [error, setError] = useState(null);
    const [sender, setSender] = useState(null)
    const [messages, setMessages] = useState([]);
    const [showButton, setShowButton] = useState(false); // State for showing button
    const { currentUser, token } = mainStore();
    const [selectedUser, setSelectedUser] = useState(null); // State for selected user
    const messageRef = useRef();
    const containerRef = useRef();
    const messagesEndRef = useRef();



    useEffect(() => {
        const newSocket = io('http://localhost:2000');
        setSocket(newSocket);



        newSocket.on('privateMessage', (message) => {
            console.log(message)
            setMessages((prevMessages) => (prevMessages ? [...prevMessages, message] : [message]));

        });


        newSocket.on('likeMessage', (messages) => {
            fetchPublicRoomMessages()

        });
        newSocket.on('disconnect', () => {
            console.log(`${currentUser.username} has left the chat`)
        });

        return () => newSocket.close();
    }, []);


    useEffect(() => {
        // Scroll to the bottom when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);



    const handleLikeMessage = async (messageId) => {
        try {
            const res =  await http.postAuth('/like-message', { messageId, username: currentUser.username, recipient: selectedUser, sender: currentUser }, token);

            if (!res.error) {
                console.log(res)
                const messages = res.data

                socket.emit('likeMessage', messages)
            }
        } catch (error) {
            console.error("Failed to like message:", error);
        }
    };
    const fetchPublicRoomMessages = async () => {
        try {
            const res = await http.get('/get-public-room-messages');
            if (!res.error) {
                setMessages(res.data);
            } else {
                console.error("Failed to fetch public room messages:", res.message);
            }
        } catch (error) {
            console.error("Error fetching public room messages:", error);
        }
    };

    useEffect(() => {
        fetchPublicRoomMessages();
    }, []);


    const sendMessage = async () => {
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
            recipient: selectedUser ? selectedUser.username : 'public-room',
            message: messageRef.current.value,
            timestamp: formattedTimestamp,
            senderImage: currentUser.image,
            recipientImage: selectedUser ? selectedUser.image : 'public-room'
        };

        const res = await http.postAuth("/send-message", data, token);

        if (!res.error) {
            socket.emit('privateChatMessage', {
                ...data,
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
            setShowButton(scrollTop > 100); // Show button if scrolled down more than 100px
        }
    };

    const handleLoadEarlier = async () => {
        if (selectedUser) {
            try {
                // Fetch earlier messages here
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

    return (
        <div className="flex flex-col bg-gradient-to-r from-indigo-500 to-violet-400 p-16">
            <div className="flex ">
                <div className="flex flex-col w-full bg-white rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 bg-gray-100 p-4 ">
                        <div className="flex flex-col">
                            <p className={`text-gray-500 font-semibold`}>Chat Room</p>
                        </div>
                    </div>
                    <div
                        ref={containerRef}
                        className="flex flex-col min-h-[620px] max-h-[620px] p-3 overflow-auto"
                        onScroll={handleScroll}
                    >
                        {messages?.map((message, i) => (
                            <SingleMessage handleLikeMessage={handleLikeMessage} participants={participants}  key={i} message={message} />
                        ))}
                        <div ref={messagesEndRef} /> {/* For scrolling to the bottom */}
                    </div>
                    {showButton && (
                        <button
                            onClick={handleLoadEarlier}
                            className="absolute hidden bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-2 rounded"
                        >
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
                                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Conversations;
