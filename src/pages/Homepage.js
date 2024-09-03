import React, { useEffect, useState } from 'react';
import http from '../plugins/http';
import { useNavigate } from "react-router-dom";
import mainStore from "../store/mainStore";
import { io } from 'socket.io-client';
import SingleUserPage from "./SingleUserPage";
import SingleUserCard from "../components/SingleUserCard";

const Homepage = () => {
    const { currentUser, setCurrentUser } = mainStore();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:2000');
        setSocket(newSocket);

        // Listen for the 'profileUpdated' event
        newSocket.on('profileUpdated', (data) => {
            console.log("Profile updated with data: ", data);

            // Find the user by ID and update their image
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === data.userId ? { ...user, image: data.image } : user
                )
            );
        });

        newSocket.on('registeredUsers', (users) => {
            console.log(users);
            console.log('Profile users updated');

            // Filter out the currentUser
            const filteredUsers = users.filter(user => user.username !== currentUser.username);
            setUsers(filteredUsers);
        });

        // Handle deleted accounts
        newSocket.on('deletedAcc', (users) => {
            console.log(users);
            console.log('Profile users updated');

            // Filter out the currentUser
            const filteredUsers = users.filter(user => user.username !== currentUser.username);
            setUsers(filteredUsers);
        });

        // Clean up the socket connection when the component unmounts
        return () => newSocket.close();
    }, []);

    // Fetch users when the component mounts
    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await http.get('/get-all-users');
                if (!res.error) {
                    let otherUsers = res.data;
                    if (currentUser) {
                        // Filter out the current user if they are logged in
                        otherUsers = res.data.filter(
                            (user) => user.username !== currentUser.username
                        );
                    }
                    setUsers(otherUsers);
                } else {
                    console.log(res);
                    setError(res.message);
                }
            } catch (err) {
                setError('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [currentUser]);  // You can remove `currentUser` from here if not needed

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={` flex flex-col gap-3 relative`}>
            <div className="flex bg-gradient-to-r from-indigo-500 to-violet-400 h-[500px]"></div>
            <div className="flex flex-col w-full absolute top-[70px]">
                <div className="flex flex-col lg:mx-[100px] mx-[20px] bg-white p-6 rounded-2xl">
                    <div className="bg-white mt-5 p-5 flex shadow-2xl">
                        <p className="font-semibold text-gray-600 rounded-2xl text-2xl">Users</p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-[50px] w-full">
                        {users.map(user => (
                            <div className={`xl:w-[500px] w-full`}>
                                <SingleUserCard user={user}/>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Homepage;
