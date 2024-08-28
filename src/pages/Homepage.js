import React, { useEffect, useState } from 'react';
import http from '../plugins/http';
import {useNavigate} from "react-router-dom";
import mainStore from "../store/mainStore"; // Assuming http is your Axios instance
import { io } from 'socket.io-client';

const Homepage = () => {
    const { currentUser, setCurrentUser } = mainStore()
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch users when the component mounts
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
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);


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

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={`container mx-auto`}>
            <div className="bg-white mt-5 p-5 flex">
                <p className="font-semibold text-gray-600 text-2xl">Users</p>
            </div>
            <div className="flex gap-3">
                <div className="bg-white mt-5 p-5 flex w-1/4">
                </div>
                <div className="mt-5  flex flex-col gap-4 w-full">
                    {users.map(user => (
                        <div key={user._id} className="bg-white flex rounded shadow-lg gap-3 p-3">
                            <img src={user.image} className={`w-36 h-36 rounded`} alt=""/>
                            <div className="flex flex-col gap-3">
                                <p className="mt-2 text-start text-gray-600 text-xl">{user.username}</p>
                                <button type="button"
                                        onClick={() => navigate(`/profile/${user.username}`)}
                                        className="text-white  bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-orange-900">Message
                                </button>
                            </div>
                        </div>

                    ))}
                </div>
            </div>

        </div>
    );
};

export default Homepage;
