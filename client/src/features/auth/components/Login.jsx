import React, { useEffect, useState } from 'react'
import { useLoginMutation } from '../authAPI';
import toast, { Toaster } from 'react-hot-toast';

const Login = ({ setActiveTab }) => {
    const [login, { isLoading: IsCheckingUser, isSuccess, isError, error }] = useLoginMutation();

    const [inputValue, setInputValue] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        setInputValue({
            ...inputValue,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        login(inputValue);
    }

    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message || "Login failed.");
        }
    }, [isError])

    return (
        <div className="flex items-center justify-center">
            <div className="bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-700 relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-lg"></div>

                <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 md:mb-6 tracking-tight drop-shadow-lg">
                    Welcome Back
                </h2>
                <p className="md:hidden text-center text-gray-300 mb-6">Join us and start your journey!</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 font-medium mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={inputValue.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-white placeholder-gray-400 transition"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 font-medium mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={inputValue.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none text-white placeholder-gray-400 transition"
                            placeholder="Enter Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={IsCheckingUser}
                        className={`w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105 text-white font-semibold rounded-lg shadow-lg transition transform duration-200 ${IsCheckingUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {IsCheckingUser ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="mx-3 text-gray-400">or</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>

                <p className="text-center text-gray-300">
                    Don't have an account?{' '}
                    <span
                        className="text-purple-400 font-semibold cursor-pointer hover:underline hover:text-purple-300 transition"
                        onClick={() => setActiveTab('register')}
                    >
                        Register
                    </span>
                </p>
            </div>
            <Toaster />
        </div>
    );
};

export default Login;