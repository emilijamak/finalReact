import React, {useEffect, useRef, useState} from 'react';
import mainStore from "../store/mainStore";
import http from "../plugins/http";
import { socket } from "../socket"
import { io } from 'socket.io-client';
import ErrorComp from "../components/ErrorComp";
import SuccessComp from "../components/SuccessComp";

const Profile = () => {
    const [socket, setSocket] = useState(null);
    const {currentUser, setCurrentUser, token} = mainStore();
    const imageRef = useRef();
    const usernameRef = useRef();
    const passRef = useRef();
    const newPassRef = useRef();
    const newPass2Ref = useRef();
    const [changePassState, setChangePassState] = useState(0)
    const [deleteAccState, setDeleteAccState] = useState(0)
    const [errorMsg, setErrorMsg] = useState(null)
    const [errorMsg2, setErrorMsg2] = useState(null)
    const [errorMsg3, setErrorMsg3] = useState(null)
    const [errorMsg4, setErrorMsg4] = useState(null)
    const [successMsg, setSuccessMsg] = useState(null)
    const [successMsg2, setSuccessMsg2] = useState(null)
    const [successMsg3, setSuccessMsg3] = useState(null)
    const [successMsg4, setSuccessMsg4] = useState(null)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)


    useEffect(() => {
        const newSocket = io('http://localhost:2000');
        setSocket(newSocket);


        return () => newSocket.close();
    }, []);

    async function changeImage() {

        const data = {
            imageUrl: imageRef.current.value,
            userID: currentUser._id
        }

        const res = await http.postAuth("/change-image", data, token)
        if (!res.error) {
            setCurrentUser(res.user)
            setSuccessMsg(res.message)
            setTimeout(() => {
                setSuccessMsg(null);
            }, 3000);
            socket.emit('profileUpdated', {
                userId: currentUser._id,
                image: res.user.image,
            });
        } else {
            setErrorMsg(res.message)
            setTimeout(() => {
                setErrorMsg(null);
            }, 3000);
        }


    }

    async function changeUsername() {

        const data = {
            username: usernameRef.current.value,
            userID: currentUser._id
        }

        const res = await http.postAuth("/change-username", data, token)
        if (!res.error) {
            setCurrentUser(res.user)
            setSuccessMsg2(res.message)
            setTimeout(() => {
                setSuccessMsg(null);
            }, 3000);

        } else {
            setErrorMsg2(res.message)
            setTimeout(() => {
                setErrorMsg2(null);
            }, 3000);
        }

    }
    async function checkCurrentPassword(num) {

        const data = {
            password: passRef.current.value,
            username: currentUser.username
        }

        const res = await http.postAuth("/login", data, token)

        if (res.success) {
            if (num === 1) {
                setChangePassState(2)
            }
            if (num === 2) {
                setDeleteAccState(2)
            }

        } else {
            if ( num === 1) {
                setErrorMsg3(res.message)
            }

            if (num === 2) {
                setErrorMsg4(res.message)
            }
            setTimeout(() => {
                setErrorMsg3(null);
            }, 3000);

        }

    }
    async function changePassword() {
        setErrorMsg3(null)
        setSuccessMsg3(null)
        const uppercaseRegex = /[A-Z]/;
        const specialCharRegex = /[!@#$%^&*_+]/;
        setError(null)

        if (newPassRef.current.value !== newPass2Ref.current.value) {
            setErrorMsg3('Passwords do not match')
            setTimeout(() => {
                setErrorMsg3(null);
            }, 3000);
            return;
        }

        if (newPassRef.current.value.length < 1) {
            setErrorMsg3('Please enter your new password')
            setTimeout(() => {
                setErrorMsg3(null);
            }, 3000);
            return;
        }

        if (newPassRef.current.value.length > 20 || newPassRef.current.value.length < 4) {
            setErrorMsg3("Password cannot be shorter than 4 characters or longer than 20 characters.");
            setTimeout(() => {
                setErrorMsg3(null);
            }, 3000);
            return;
        }

        if (!uppercaseRegex.test(newPassRef.current.value)) {
            setErrorMsg3("Password must contain at least one uppercase letter.");
            setTimeout(() => {
                setErrorMsg3(null);
            }, 3000);
            return;
        }

        if (!specialCharRegex.test(newPassRef.current.value)) {
            setErrorMsg3("Password must contain at least one special character (!@#$%^&*_+).");
            setTimeout(() => {
                setErrorMsg3(null);
            }, 3000);
            return;
        }



        const data = {
            password: newPassRef.current.value,
            passwordTwo: newPass2Ref.current.value,
            username: currentUser.username,
            userID: currentUser._id
        }

        const res = await http.postAuth("/change-password", data, token)

        if (!res.error) {
            setChangePassState(0)
            setSuccessMsg3(res.message)
            setTimeout(() => {
                setSuccessMsg(null);
            }, 3000);
        } else {
            setErrorMsg3(res.message)
        }

    }

    async function deleteAcc() {

        const data = {
            userID: currentUser._id,
        };

        const res = await http.postAuth("/delete-account", data, token);

        if (!res.error) {

            const users = res.data

            socket.emit('deletedAcc', users);
            // Perform actions after account deletion
            setCurrentUser(null); // Clear current user data from the frontend
            // Optionally redirect the user to the homepage or login page
            window.location.href = "/login";
        } else {
            console.log(res.message);
        }

    }




    return (
        <div className="container mx-auto  p-5">
            <div className=" mx-[50px] flex gap-4">
                <div className="flex flex-col w-[500px] shadow-xl">
                    <div className="flex flex-col h-[200px] bg-gradient-to-r from-indigo-500 to-violet-400 w-full rounded"></div>
                    <div className="flex flex-col h-[550px] bg-white w-full relative rounded">
                        <div
                            className="w-[180px] h-[180px] absolute -top-16 right-1/2 transform translate-x-1/2 rounded-full flex justify-center items-center">
                            <div className="absolute inset-0  rounded-full backdrop-blur  "></div>
                            <img src={currentUser?.image} className="w-[160px] h-[160px] rounded-full relative z-10"
                                 alt="Profile"/>
                        </div>
                        <div className="mt-[130px] font-semibold text-xl">{currentUser?.username}</div>
                    </div>

                </div>
                <div className="flex flex-col w-full shadow-xl bg-white rounded-2xl overflow-hidden text-start">
                    <div className="flex bg-gradient-to-r to-indigo-500 from-violet-400 p-3">
                        <p className="text-white font-semibold text-lg">
                            Edit profile
                        </p>
                    </div>

                    <div className="flex flex-col justify-between h-full p-6">
                    <div className="">
                            <div className="mt-10  flex flex-col gap-1">
                                <label htmlFor="image"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile
                                    picture</label>
                                <div className="flex gap-3">
                                    <div className="flex gap-3">
                                        <input type="text" id="image"
                                               ref={imageRef}
                                               className="w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                               defaultValue={currentUser?.image} required/>
                                    </div>
                                    <button
                                        onClick={changeImage}
                                        className="flex w-[200px] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save
                                    </button>
                                </div>
                                {errorMsg && <ErrorComp error={errorMsg}/>}
                                {successMsg && <SuccessComp msg={successMsg}/>}
                            </div>
                            <div className="mt-10 flex flex-col gap-2">
                                <label htmlFor="username"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                                <div className="flex gap-3">
                                    <input type="text" id="username"
                                           ref={usernameRef}
                                           className="w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           defaultValue={currentUser?.username} required/>
                                    <button
                                        onClick={changeUsername}
                                        className="flex w-[200px] justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save
                                    </button>
                                </div>
                                {errorMsg2 && <ErrorComp error={errorMsg2}/>}
                                {successMsg2 && <SuccessComp msg={successMsg2}/>}
                            </div>
                            {changePassState === 0 && (
                                <div className="mt-10">
                                    <button
                                        onClick={() => setChangePassState(1)}
                                        className="flex mb-3 w-[300px] justify-center rounded-md bg-indigo-600 px-6 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Change password
                                    </button>
                                    {errorMsg3 && <ErrorComp error={errorMsg3}/>}
                                    {successMsg3 && <SuccessComp msg={successMsg3}/>}
                                </div>

                            )}
                            {changePassState === 1 && (
                                <div className="mt-10 flex flex-col gap-3">
                                    <label htmlFor="password"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter
                                        your current password</label>
                                    <input type="password" id="password"
                                           ref={passRef}
                                           className="w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           placeholder={`password`} required/>
                                    <button
                                        onClick={() => checkCurrentPassword(1)}
                                        className="flex w-[300px] justify-center rounded-md bg-indigo-600 px-6 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Enter
                                    </button>
                                    {errorMsg3 && <ErrorComp error={errorMsg3}/>}
                                    {successMsg3 && <SuccessComp msg={successMsg3}/>}
                                </div>
                            )}
                            {changePassState === 2 && (
                                <div className="mt-10 flex flex-col gap-3">
                                    <label htmlFor="password2"
                                           className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter
                                        new password</label>
                                    <input type="password" id="password2"
                                           ref={newPassRef}
                                           className="w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           placeholder={`password`} required/>
                                    <input type="password" id="password"
                                           ref={newPass2Ref}
                                           className="w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                           placeholder={`repeat password`} required/>
                                    {error && error}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={changePassword}
                                            className="flex w-[150px] justify-center rounded-md bg-indigo-600 px-6 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Change
                                        </button>
                                        <button
                                            onClick={() => setChangePassState(0)}
                                            className="flex w-[150px] justify-center rounded-md bg-indigo-600 px-6 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    {errorMsg3 && <ErrorComp error={errorMsg3}/>}
                                    {successMsg3 && <SuccessComp msg={successMsg3}/>}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex w-full mb-8 p-5">
                        {deleteAccState=== 0 && (
                            <div className="mt-10">
                                <button
                                    onClick={() => setDeleteAccState(1)}
                                    className="text-white w-[250px] bg-indigo-700 hover:bg-indigo-600  font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                >
                                    Delete account
                                </button>
                            </div>
                        )}
                        {deleteAccState === 1 && (
                            <div className="mt-10 flex flex-col gap-3 justify-center">
                                <label htmlFor="password"
                                       className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter
                                    your current password</label>
                                <input type="password" id="password"
                                       ref={passRef}
                                       className="w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder={`password`} required/>
                                <button
                                    onClick={() => checkCurrentPassword(2)}
                                    className="flex w-[300px] justify-center rounded-md bg-indigo-600 px-6 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Enter
                                </button>
                                {errorMsg4 && <ErrorComp error={errorMsg4}/>}
                            </div>
                        )}
                        {deleteAccState === 2 && (

                            <div className="flex flex-col gap-3 text-gray-800">
                                <p>Are you sure u want to delete your account?</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setDeleteAccState(0)}
                                        className="text-white w-[250px] bg-violet-600 hover:bg-violet-500 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                    >
                                        Go back
                                    </button>
                                    <button
                                        onClick={deleteAcc}
                                        className="text-white w-[250px] bg-indigo-600 hover:bg-indigo-500 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                    >
                                        Delete account
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>


                </div>

            </div>
        </div>
    );
};

export default Profile;
