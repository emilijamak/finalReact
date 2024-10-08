import React, {useEffect, useState} from 'react';
import http from "../plugins/http";
import mainStore from "../store/mainStore";
import {io} from "socket.io-client";
import SingleConversationComp from "../components/SingleConversationComp";
import {useNavigate} from "react-router-dom";

const AllConversations = () => {
    const {currentUser, setConNum} = mainStore(); // Use the store hook inside the component
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [deleteId, setDeleteId] = useState(null)
    const nav = useNavigate()



    useEffect(() => {
        // Define the function to fetch user conversations
        async function fetchUserConversations() {
            if (!currentUser?._id) return; // Ensure currentUser and currentUser._id exist

            try {
                const res = await http.get(`/conversations/${currentUser._id}`);
                if (!res.error) {
                   setConNum(res.data.length)
                    console.log(res)

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
        <div className="flex flex-col w-full h-full relative ">
            <div className="flex bg-gradient-to-r from-indigo-500 to-violet-400  h-1/3"></div>
            <div className="flex absolute top-[100px] xl:px-[100px] px-[20px] w-full ">

                <div className="flex-col flex bg-white p-4 w-full rounded-2xl min-h-[650px]">
                    <div className="flex p-5  bg-white shadow-2xl w-full mb-12 font-semibold text-xl">
                        Your Conversations:
                    </div>
                    {currentUser &&
                    <div className="flex flex-wrap gap-[50px]">
                        {conversations.map((conversation, i) => (
                            <div className={`xl:w-[450px] w-full`}>
                                <SingleConversationComp key={conversation._id} conversation={conversation}/>
                            </div>
                        ))}
                    </div>
                    }
                    {
                        !currentUser &&
                        <button type="button"
                                onClick={() => nav(`/login`)}
                                className="text-white bg-indigo-600 hover:bg-indigo-500 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Log In to see your conversations
                        </button>
                    }
                </div>

            </div>


        </div>
    );
};

export default AllConversations;
