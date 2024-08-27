import React, {useRef, useState} from 'react';
import mainStore from "../store/mainStore";
import http from "../plugins/http";

const Profile = () => {
    const {currentUser, setCurrentUser, token} = mainStore();
    const imageRef = useRef();
    const usernameRef = useRef();
    const passRef = useRef();
    const newPassRef = useRef();
    const newPass2Ref = useRef();
    const [changePassState, setChangePassState] = useState(0)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    async function changeImage() {

        const data = {
            imageUrl: imageRef.current.value,
            userID: currentUser._id
        }

        const res = await http.postAuth("/change-image", data, token)
        if (!res.error) {
            setCurrentUser(res.user)
        }
        console.log(res)

    }

    async function changeUsername() {

        const data = {
            username: usernameRef.current.value,
            userID: currentUser._id
        }

        const res = await http.postAuth("/change-username", data, token)
        if (!res.error) {
            setCurrentUser(res.user)
        }
        console.log(res)
    }
    async function checkCurrentPassword() {

        const data = {
            password: passRef.current.value,
            username: currentUser.username
        }

        const res = await http.postAuth("/login", data, token)

        if (res.success) {
            setChangePassState(2)
            console.log('success')
        } else {
            console.log(res)
        }

    }
    async function changePassword() {
        const uppercaseRegex = /[A-Z]/;
        const specialCharRegex = /[!@#$%^&*_+]/;
        setError(null)

        if (newPassRef.current.value !== newPass2Ref.current.value) {
            return setError('Passwords do not match')
        }

        if (newPassRef.current.value.length < 1) {
            return setError('Please enter your new password')
        }

        if (newPassRef.current.value.length > 20 || newPassRef.current.value.length < 4) {
            setError("Password cannot be shorter than 4 characters or longer than 20 characters.");
            return;
        }

        if (!uppercaseRegex.test(newPassRef.current.value)) {
            setError("Password must contain at least one uppercase letter.");
            return;
        }

        if (!specialCharRegex.test(newPassRef.current.value)) {
            setError("Password must contain at least one special character (!@#$%^&*_+).");
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
            setSuccess(res.message)
            console.log('success')
        } else {
            console.log(res)
        }

    }




    return (
        <div className="container mx-auto  p-5">
            <div className=" mx-[50px] flex gap-4">
                <div className="flex flex-col w-[500px] shadow-xl">
                    <div className="flex flex-col h-[200px] bg-gradient-to-br from-pink-500 to-orange-400 w-full rounded"></div>
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
                <div className="flex flex-col w-full shadow-xl bg-white px-6 py-10 text-start">
                    <p className="text-gray-400 font-semibold text-lg">
                        Edit profile
                    </p>
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

                    </div>
                    {changePassState === 0 && (
                        <div className="mt-10">
                            <button
                                onClick={() => setChangePassState(1)}
                                className="flex w-[300px] justify-center rounded-md bg-indigo-600 px-6 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Change password
                            </button>
                        </div>
                    )}
                    {changePassState === 1 && (
                        <div className="mt-10 flex flex-col gap-3">
                            <label htmlFor="password"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter your current password</label>
                            <input type="password" id="password"
                                   ref={passRef}
                                   className="w-[300px] bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder={`password`} required/>
                            <button
                                onClick={checkCurrentPassword}
                                className="flex w-[300px] justify-center rounded-md bg-indigo-600 px-6 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Enter
                            </button>
                        </div>
                    )}
                    {changePassState === 2 && (
                        <div className="mt-10 flex flex-col gap-3">
                            <label htmlFor="password2"
                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter new password</label>
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

                        </div>
                    )}

                </div>

            </div>
        </div>
    );
};

export default Profile;
