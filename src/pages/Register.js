import React, {useEffect, useRef, useState} from 'react';
import http from "../plugins/http"
import {useNavigate} from "react-router-dom";
import mainStore from "../store/mainStore";
import {io} from "socket.io-client";

const Register = () => {

    const [socket, setSocket] = useState(null);
    const nav = useNavigate()
    const [errorMessage, setErrorMessage] = useState(null);
    const nameRef = useRef()
    const passRef = useRef()
    const pass2Ref = useRef()
    const uppercaseRegex = /[A-Z]/;
    const specialCharRegex = /[!@#$%^&*_+]/;

    useEffect(() => {
        const newSocket = io('http://localhost:2000');
        setSocket(newSocket);


        return () => newSocket.close();
    }, []);

    async function register() {

        try {
            validate();

            const user = {
                username: nameRef.current.value,
                password: passRef.current.value,
                passwordTwo: pass2Ref.current.value
            };

            const res = await http.post("/register", user);

            console.log(user)

            if (res && res.error) {
                setErrorMessage(res.message || "An error occurred during registration.");
                console.log(res.message);
            } else if (res) {
                const users = res.data
                socket.emit('registeredUsers', users);
                nav('/login');
            } else {
                setErrorMessage("Unexpected response from the server.");
                console.log("Response is undefined or doesn't contain the expected data.");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
            console.error("Error during registration:", error);
        }
    }


    function validate() {

        const username = nameRef.current.value
        const password = passRef.current.value
        const passwordTwo = pass2Ref.current.value

        setErrorMessage(null);

        // Username length validation
        if (username.length > 20 || username.length < 4) {
            setErrorMessage("Username cannot be shorter than 4 characters or longer than 20 characters.");
            return;
        }

        // Password length validation
        if (password.length > 20 || password.length < 4) {
            setErrorMessage("Password cannot be shorter than 4 characters or longer than 20 characters.");
            return;
        }

        // Password match validation
        if (password !== passwordTwo) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        // Check if password contains at least one uppercase letter
        if (!uppercaseRegex.test(password)) {
            setErrorMessage("Password must contain at least one uppercase letter.");
            return;
        }

        // Check if password contains at least one special character
        if (!specialCharRegex.test(password)) {
            setErrorMessage("Password must contain at least one special character (!@#$%^&*_+).");
            return;
        }

        // If all validations pass, proceed with form submission
        console.log("Form submitted successfully!");
    }


    return (
        <div className="flex mt-[100px] flex-col justify-centerlg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create an
                    account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <div>
                        <label className="text-start block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div className="mt-2">
                            <input ref={nameRef} id="email" name="email" type="text" autoComplete="email" required
                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password"
                                   className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        </div>
                        <div className="mt-2">
                            <input ref={passRef} id="password" name="password" type="password" autoComplete="current-password"
                                   required
                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password2"
                                   className="block text-sm font-medium leading-6 text-gray-900">Repeat password</label>
                        </div>
                        <div className="mt-2">
                            <input ref={pass2Ref} id="password2" name="password" type="password" autoComplete="current-password"
                                   required
                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>
                    {errorMessage && errorMessage}
                    <div>
                        <button
                            onClick={register}
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                            in
                        </button>
                    </div>
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already a member?
                    <a onClick={() => nav('/login')} className="font-semibold cursor-pointer leading-6 text-indigo-600 hover:text-indigo-500"> Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;