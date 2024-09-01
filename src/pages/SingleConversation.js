import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from "../plugins/http";
import mainStore from "../store/mainStore";
import SingleMessage from "../components/SingleMessage"; // Adjust the path to your HTTP plugin

const SingleConversation = () => {
    const { conversationId } = useParams();
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = mainStore()



    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const res = await http.get(`/conversation/${conversationId}`);
                if (!res.error) {
                    setConversation(res.data);
                    // setParticipants(conversation.participants)
                } else {
                    setError(res.message);
                }
            } catch (err) {
                setError("Failed to fetch conversation");
            } finally {
                setLoading(false);
            }
        };

        fetchConversation();
    }, [conversationId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Filter out the current user from the list of participants
    const otherParticipants = conversation.participants.filter(
        (p) => p.username !== currentUser?.username
    );
    // console.log(conversation)

    conversation.messages.forEach((message) => {
        const senderParticipant = conversation.participants.find(
            (user) => user.username === message.sender
        );
        // console.log(senderParticipant)
    })



    return (
        <div className="conversation-details h-full flex bg-gradient-to-br from-pink-500 to-orange-400 justify-center items-center">
            <div className="flex bg-white rounded p-6 flex-col">
                <h2 className="text-lg font-semibold mb-4">
                    Conversation with: {otherParticipants.map(p => p.username).join(', ')}
                    <div className="text-gray-500 font-thin text-xs">
                        {conversation.messages.length} messages
                    </div>
                </h2>
                <div className="messages space-y-4">
                    {conversation.messages.map(msg => (
                        <SingleMessage participants={conversation?.participants} message={msg}/>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default SingleConversation;
