import React, {useState} from 'react';
import mainStore from "../store/mainStore";

const SingleMessage = ({message}) => {

    const {currentUser} = mainStore()
    const isCurrentUser = currentUser.username === message.sender;


    return (
        <div>
            {!isCurrentUser &&
                <div className="flex-col flex gap-1">
                    <div className="flex gap-2 w-full">
                        <img className="w-12 h-12 rounded-full p-0.5 bg-white" src={message.senderImage} alt=""/>
                        <div className="flex items-center py-1 px-5 bg-blue-50 rounded-3xl">{message.message}</div>
                    </div>
                    <p className="text-xs text-gray-400 text-start ms-10">{message.timestamp}</p>
                </div>
            }
            {isCurrentUser &&
                <div className="flex-col flex gap-1">
                    <div className="flex gap-2 w-full justify-end">
                        <div className="flex items-center py-1 px-5 bg-green-200 rounded-3xl">{message.message}</div>
                        <img className="w-12 h-12 rounded-full p-0.5 bg-white" src={message.senderImage} alt=""/>
                    </div>
                    <p className="text-xs text-gray-400 text-end me-10">{message.timestamp}</p>
                </div>
            }
        </div>
    )

};

export default SingleMessage;