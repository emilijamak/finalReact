import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import mainStore from "../store/mainStore";

const Toolbar = () => {


    const {currentUser, setCurrentUser, conNum} = mainStore();
    const navigation = useNavigate()

    function logOut() {
        setCurrentUser(null)
        navigation('/login')
    }

    return (
        <div className="flex gap-6 justify-center font-semibold items-center w-full bg-white pt-3">
            <div className="flex justify-between gap-6">
                <div className=""></div>
                <div className="flex gap-6">
                    {!currentUser &&
                        <div>
                            <Link to="/login"
                                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                                  aria-current="page">Login</Link>
                        </div>
                    }
                    {!currentUser &&
                        <div>
                            <Link to="/register"
                                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Register</Link>
                        </div>
                    }
                    <div>
                        <Link to="/"
                              className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Homepage</Link>
                    </div>

                    {currentUser && <div>
                        <Link to="/profile"
                              className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Profilis</Link>
                    </div>
                    }
                    {currentUser && <div>
                        <Link to="/allConversations"
                              className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Conversations ({conNum})</Link>
                    </div>
                    }
                    {currentUser && <div>Welcome, {currentUser.username}</div>}
                </div>
                {currentUser &&
                    <button type="button"
                            onClick={logOut}
                            className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Log
                        out</button>
                }
            </div>


        </div>
    );
};

export default Toolbar;