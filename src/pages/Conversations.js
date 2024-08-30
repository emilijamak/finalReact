import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import http from "../plugins/http";
import mainStore from "../store/mainStore";
import SingleMessage from "../components/SingleMessage";

const Conversations = () => {
    const [socket, setSocket] = useState(null);
    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
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

        newSocket.on('connect', () => {
            console.log('Socket connected');
        });

        newSocket.on('message', (message) => {
            console.log(message)
            setMessages((prevMessages) => (prevMessages ? [...prevMessages, message] : [message]));

        });

        newSocket.on('likeMessage', (messages) => {
            console.log(messages)
            setMessages(messages)

        });

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        setMessages(null)
        if (selectedUser) {
            async function fetchMessages() {
                try {
                    const res = await http.get(`/get-messages/${currentUser.username}/${selectedUser.username}`);
                    if (!res.error) {
                        setMessages(res.data);
                    } else {
                        console.error(res.message);
                    }
                } catch (error) {
                    console.error("Failed to fetch messages:", error);
                }
            }
            fetchMessages();
        }
    }, [selectedUser, currentUser.username]);

    useEffect(() => {
        // Scroll to the bottom when messages change
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);



    const handleLikeMessage = async (messageId) => {
        try {
          const res =  await http.postAuth('/like-message', { messageId, username: currentUser.username, recipient: selectedUser, sender: currentUser }, token);
            console.log(res)
            if (!res.error) {

                const messages = res.data

                socket.emit('likeMessage', messages)
            }
        } catch (error) {
            console.error("Failed to like message:", error);
        }
    };

    async function sendMessage() {
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
            timestamp: formattedTimestamp
        };

        const res = await http.postAuth("/send-message", data, token);
        if (!res.error) {
            // Emit the message via socket
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
    }

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await http.get('/get-all-users');
                if (!res.error) {
                    const otherUsers = res.data.filter(
                        (user) => user.username !== currentUser.username
                    );
                    setUsers(otherUsers);
                } else {
                    setError(res.message);
                }
            } catch (err) {
                setError('Failed to fetch users');
            }
        }
        fetchUsers();
    }, [currentUser.username]);

    const handleUserClick = (user) => {
        setSelectedUser(user); // Set selected user's username
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
        <div className="flex flex-col h-screen">
            <div className="flex justify-end bg-pink-500 p-6">
            </div>
            <div className="flex ">
                <div className="flex flex-col w-1/3 p-3 bg-pink-400 text-white gap-3">
                    <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="size-6">
                            <path
                                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/>
                        </svg>
                        <p className="text-start font-semibold">Group chats:</p>
                    </div>
                    <div>
                        <p className="text-start">Chat#01</p>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="size-6">
                            <path
                                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
                        </svg>
                        <p className="text-start font-semibold">Users:</p>
                    </div>
                    {users?.map((user, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-3 p-2 cursor-pointer ${selectedUser?.username === user.username ? 'bg-pink-600' : ''}`}
                            onClick={() => handleUserClick(user)}
                        >
                            <img className="h-10 w-10 rounded-full" src={user.image} alt="" />
                            <p className="text-start p-1">{user.username}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col w-full bg-white">
                    <div className="flex items-center gap-3 bg-gray-100 p-2">
                        <img className='w-14 h-14 rounded-full' src={selectedUser?.image} alt="" />
                        <div className="flex flex-col">
                            <p>Chat with {selectedUser?.username}</p>
                        </div>
                    </div>
                    <div
                        ref={containerRef}
                        className="flex flex-col min-h-[620px] max-h-[620px] p-3 overflow-auto"
                        onScroll={handleScroll}
                    >
                        {messages?.map((message, i) => (
                            <SingleMessage handleLikeMessage={handleLikeMessage} key={i} message={message} />
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
                    <div className="flex p-3 bg-gray-100">
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
