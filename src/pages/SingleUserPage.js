import React, {useEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom'; // Import useParams to get the username from the URL
import http from '../plugins/http';
import mainStore from "../store/mainStore";
import { io } from 'socket.io-client';

const SingleUserPage = () => {
    const { username } = useParams(); // Get the username from the URL
    const [user, setUser] = useState(null);
    const { currentUser, setCurrentUser, token } = mainStore()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null)
    const messageRef = useRef()

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await http.get(`/get-user/${username}`); // Assuming you have an endpoint to get a user by username
                if (!res.error) {
                    setUser(res.data);
                } else {
                    setError(res.message);
                }
            } catch (err) {
                setError('Failed to fetch user');
            } finally {
                setLoading(false);
            }
        }

        fetchUser();
    }, [username]);

    const [socket, setSocket] = useState(null);

    useEffect(() => {

        const newSocket = io('http://localhost:2000'); // Specify the backend URL
        setSocket(newSocket);


        newSocket.on('message', (message) => {
            console.log(message); // Log the received message
        });

        return () => newSocket.close();
    }, []); // Empty dependency array ensures this runs only once when the component mounts


    if (loading) {
        return <div>Loading...</div>;
    }



    async function sendMessage() {
        setError(null)
        const timestamp = Math.floor(Date.now() / 1000);

        if (messageRef.current.value.length < 1 || messageRef.current.value.length > 200) {
           return setError('Message should be longer then 1 symbol and shorter then 200.')
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

        const formattedTimestamp = convertTimestamp(timestamp); // Get formatted timestamp

        const data = {
            sender: currentUser.username,
            recipient: user.username,
            message: messageRef.current.value,
            timestamp: formattedTimestamp
        };


        const res = await http.postAuth("/send-message", data, token);
        console.log(res)
        if (!res.error) {
            setSuccessMessage(res.message)
            //get message text
            socket.emit('chatMessage', messageRef.current.value)
            messageRef.current.value = ''

        } else {
            console.log(res.message)
        }
    }



    return (
        <div className="h-screen relative">
            <div className=" bg-gradient-to-br from-pink-500 to-orange-400 p-3 h-1/3"></div>
            <div
                className="bg-white w-[600px] p-5 mx-auto container rounded-3xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="flex h-full w-full relative flex-col">
                    <img
                        src={user.image}
                        className="rounded-full h-[200px] w-[200px] absolute left-1/2 transform -translate-x-1/2 -top-1/2 shadow-xl p-3 backdrop-blur"
                        alt="Profile"
                        style={{top: '-50px'}}  // Adjust the value to fine-tune the positioning
                    />
                    <p className="pt-[180px] text-3xl font-semibold text-gray-600">{user.username}</p>
                    <div className="mt-10 flex flex-col gap-3">
                        <label htmlFor="message"
                               className="block mb-2 text-sm text-start font-medium text-gray-900 dark:text-white">Your
                            message</label>
                        <textarea id="message" rows="4"
                                  ref={messageRef}
                                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  placeholder="Write your thoughts here..."></textarea>

                        <button type="button"
                                onClick={sendMessage}
                                className="text-white  bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-orange-900">Send a message
                        </button>
                        {error && error}
                        {successMessage && successMessage}
                    </div>

                </div>
            </div>
        </div>


    );
};

export default SingleUserPage;
