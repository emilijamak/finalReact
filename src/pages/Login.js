import React, {useRef, useState} from 'react';
import register from "./Register";
import http from "../plugins/http";
import {useNavigate} from "react-router-dom";
import mainStore from "../store/mainStore";

const Login = () => {

    const nav = useNavigate()
    const { currentUser, token, setCurrentUser, setToken } = mainStore()
    const nameRef = useRef()
    const passRef = useRef()
    const [errorMessage, setErrorMessage] = useState(null);



    async function login() {

        setErrorMessage(null)

        const user = {
            username: nameRef.current.value,
            password: passRef.current.value,
        }

        if (nameRef.current.value.length < 1) {
            setErrorMessage("Please fill up the both fields.");
            return;
        }

        if (passRef.current.value.length < 1) {
            setErrorMessage("Please fill up the both fields.");
            return;
        }



        const res = await http.post("/login", user)

        if (res.error) {
            setErrorMessage(res.message)
            console.log(res.message)
        }
        if (!res.error) {
            console.log(res.data.updatedUser)
            nav('/');
            setCurrentUser(res.data.updatedUser)
            setToken(res.data.token)


        }

    }





    return (
        <div className="flex flex-col justify-center items-center mt-[100px] px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to
                    your account</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    <div>
                        <label className="text-start block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div className="mt-2">
                            <input ref={nameRef}  id="email" name="email" type="text" autoComplete="email" required
                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password"
                                   className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div className="text-sm">
                            </div>
                        </div>
                        <div className="mt-2">
                            <input ref={passRef} id="password" name="password" type="password"
                                   autoComplete="current-password"
                                   required
                                   className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={login}
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                            in
                        </button>
                    </div>
                    {errorMessage && errorMessage}
                </div>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?
                    <a onClick={() => nav('/register')} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;