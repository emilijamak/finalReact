import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import mainStore from "../store/mainStore";

const Toolbar = () => {


    const { currentUser, setCurrentUser } = mainStore();



    return (
        <div className="flex gap-6 justify-center w-full">
            <nav className="bg-white border-gray-200 dark:bg-gray-900 w-full ">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-center  mx-auto p-4">
                    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            {!currentUser &&

                            <li>
                                <Link to="/login"
                                      className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                                      aria-current="page">Login</Link>
                            </li>
                            }
                            {!currentUser &&
                            <li>
                                <Link to="/register"
                                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Register</Link>
                            </li>
                            }
                            <li>
                                <Link to="/"
                                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Homepage</Link>
                            </li>

                            {currentUser && <li>
                                <Link to="/profile"
                                      className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Profilis</Link>
                            </li>
                            }
                            {currentUser && <div>Welcome, {currentUser.username}</div>}
                            <li>
                                {currentUser &&
                                    <button type="button"
                                            onClick={() => setCurrentUser(null)}
                                            className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Log out</button>

                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>


        </div>
    );
};

export default Toolbar;