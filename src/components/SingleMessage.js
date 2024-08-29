import React from 'react';
import mainStore from "../store/mainStore";

const SingleMessage = ({ message, handleLikeMessage }) => {
    const { currentUser } = mainStore();
    const isCurrentUser = currentUser.username === message.sender;

    // Safely check if the liked array exists, otherwise use an empty array
    const likedCount = message.liked?.length || 0;

    return (
        <div>
            {!isCurrentUser && (
                <div className="flex-col flex gap-1">
                    <div className="flex gap-2 w-full">
                        <img className="w-12 h-12 rounded-full p-0.5 bg-white" src={message.senderImage} alt="" />
                        <div className="flex items-center py-1 px-5 bg-blue-50 rounded-3xl relative">
                            {message.message}
                            <svg
                                onClick={() => handleLikeMessage(message._id)}
                                xmlns="http://www.w3.org/2000/svg"
                                fill={likedCount > 0 ? "pink" : "none"}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className={`size-4 cursor-pointer absolute bottom-0 -left-1 ${likedCount > 0 ? "text-pink-400" : "hover:text-pink-400"}`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                />
                            </svg>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-start ms-10">{message.timestamp}</p>
                </div>
            )}
            {likedCount > 0 && isCurrentUser && (
                <div className="flex-col flex gap-1">
                    <div className="flex gap-2 w-full justify-end">
                        <div className="flex items-center py-1 px-5 bg-green-200 rounded-3xl relative">
                            {message.message}
                            <svg
                                onClick={() => handleLikeMessage(message._id)}
                                xmlns="http://www.w3.org/2000/svg"
                                fill={likedCount > 0 ? "pink" : "none"}
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className={`size-4 cursor-pointer absolute bottom-0 -left-1 ${likedCount > 0 ? "text-pink-400" : "hover:text-pink-400"}`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                />
                            </svg>
                        </div>
                        <img className="w-12 h-12 rounded-full p-0.5 bg-white" src={message.senderImage} alt=""/>
                    </div>
                    <p className="text-xs text-gray-400 text-end me-10">{message.timestamp}</p>
                </div>
            )}
            { likedCount < 1 && isCurrentUser && (
                <div className="flex-col flex gap-1">
                    <div className="flex gap-2 w-full justify-end">
                        <div className="flex items-center py-1 px-5 bg-green-200 rounded-3xl relative">
                            {message.message}

                        </div>
                        <img className="w-12 h-12 rounded-full p-0.5 bg-white" src={message.senderImage} alt=""/>
                    </div>
                    <p className="text-xs text-gray-400 text-end me-10">{message.timestamp}</p>
                </div>
            )}
        </div>
    );
};

export default SingleMessage;
