import React, {useRef, useState} from 'react';
import mainStore from "../store/mainStore";
import http from "../plugins/http";

const Profile = () => {
    const {user, setUser, token} = mainStore();
    const imageRef = useRef();
    const usernameRef = useRef();

    async function changeImage() {

        const data = {
            imageUrl: imageRef.current.value,
            userID: user._id
        }

        const res = await http.postAuth("/change-image", data, token)
        if (!res.error) {
            setUser(res.user)
        }
        console.log(res)

    }

    async function changeUsername() {

        const data = {
            username: usernameRef.current.value,
            userID: user._id
        }

        const res = await http.postAuth("/change-username", data, token)
        if (!res.error) {
            setUser(res.user)
        }
        console.log(res)
    }

    return (
        <div className="container mx-auto  p-5">
            <div className=" mx-[50px] flex gap-4">
                <div className="flex flex-col w-[500px] shadow-xl">
                    <div className="flex flex-col h-[200px] bg-gray-300 w-full rounded"></div>
                    <div className="flex flex-col h-[550px] bg-white w-full relative rounded">
                        <div
                            className="w-[180px] h-[180px] absolute -top-16 right-1/2 transform translate-x-1/2 rounded-full flex justify-center items-center">
                            <div className="absolute inset-0  rounded-full backdrop-blur  "></div>
                            <img src={user?.image} className="w-[160px] h-[160px] rounded-full relative z-10"
                                 alt="Profile"/>
                        </div>
                        <div className="mt-[130px] font-semibold text-xl">{user?.username}</div>
                    </div>

                </div>
                <div className="flex flex-col w-full shadow-xl bg-white px-6 py-10 text-start">
                    <p className="text-gray-400 font-semibold text-lg">
                        Edit profile
                    </p>
                    <div className="mt-10  flex flex-col gap-1">
                        <label htmlFor="first_name"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile
                            picture</label>
                        <div className="flex gap-3">
                            <div className="flex gap-3">
                                <input type="text" id="first_name"
                                       ref={imageRef}
                                       className="w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       defaultValue={user?.image} required/>
                            </div>
                            <button
                                onClick={changeImage}
                                className="flex w-[200px] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save
                            </button>
                        </div>
                    </div>
                    <div className="mt-10 flex flex-col gap-2">
                        <label htmlFor="first_name"
                               className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                        <div className="flex gap-3">
                            <input type="text" id="first_name"
                                   ref={usernameRef}
                                   className="w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   defaultValue={user?.username} required/>
                            <button
                                onClick={changeUsername}
                                className="flex w-[200px] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save
                            </button>
                        </div>

                    </div>
                    <div className="mt-10">
                        <button
                            className="flex w-[300px] justify-center rounded-md bg-indigo-600 px-6 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Change
                            password
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
