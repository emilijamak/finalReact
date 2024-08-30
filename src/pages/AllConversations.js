import React, {useEffect, useState} from 'react';
import http from "../plugins/http";
import mainStore from "../store/mainStore";
import {io} from "socket.io-client";
import SingleConversationComp from "../components/SingleConversationComp";

const AllConversations = () => {
    const {currentUser, setConNum} = mainStore(); // Use the store hook inside the component
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [deleteId, setDeleteId] = useState(null)



    useEffect(() => {
        // Define the function to fetch user conversations
        async function fetchUserConversations() {
            if (!currentUser?._id) return; // Ensure currentUser and currentUser._id exist

            try {
                const res = await http.get(`/conversations/${currentUser._id}`);
                if (!res.error) {
                   setConNum(res.data.length)

                    setConversations(res.data || []); // Update conversations state
                } else {
                    console.error(res.message);
                }
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            }
        }

        // Initialize socket connection
        const newSocket = io('http://localhost:2000');
        setSocket(newSocket);

        // Setup socket event listener
        newSocket.on('messageReceived', () => {
            // Logic to update the conversation list when a new message is received
            fetchUserConversations();
        });
        newSocket.on('conversationDeleted', () => {
            // Logic to update the conversation list when a new message is received
            fetchUserConversations();
        });

        // Fetch user conversations initially
        fetchUserConversations();

        // Cleanup on component unmount
        return () => {
            newSocket.close();
        };
    }, [currentUser]); // Fetch conversations when currentUser changes





    return (
        <div className="flex flex-col  w-full h-full relative ">
            <div className="flex bg-gradient-to-br from-pink-500 to-orange-400 p-3 h-1/3"></div>
            <div className="flex flex-col absolute top-[100px] mx-[100px]">
                <div className="flex p-5 rounded bg-white shadow-2xl w-full mb-12 font-semibold text-xl">
                    Your Conversations:
                </div>
                <div className="flex flex-wrap gap-[50px]">
                    {conversations.map((conversation, i) => (
                        <SingleConversationComp key={conversation._id}  conversation={conversation}/>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default AllConversations;
