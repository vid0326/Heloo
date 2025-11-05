import React, { useEffect, useState } from 'react'
import { useCreateUserMutation } from '../authAPI';
import toast, { Toaster } from 'react-hot-toast';

const Register = ({ setActiveTab }) => {
  const [createUser, { isLoading: isCreatingUserLoading, isError: isCreatingUserError, error: creatingUserError }] = useCreateUserMutation();

  const [inputValue, setInputValue] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setInputValue({
      ...inputValue,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputValue.password !== inputValue.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    createUser(inputValue);
  }

  useEffect(() => {
    if (isCreatingUserError) {
      toast.error(creatingUserError?.data?.message || "Registration failed.");
    }
  }, [isCreatingUserError]);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 relative border border-gray-700">
        <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 tracking-tight md:mb-6">
          Create your account
        </h3>
        <p className="md:hidden text-center text-gray-300 mb-6">Join us and start your journey!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-2">
            <input
              onChange={handleInputChange}
              value={inputValue.fullName}
              name="fullName"
              type="text"
              placeholder="Full Name"
              className="w-1/2 p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 transition"
              required
            />
            <input
              onChange={handleInputChange}
              value={inputValue.username}
              name="username"
              maxLength={10}
              type="text"
              placeholder="Username"
              className="w-1/2 p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 transition"
              required
            />
          </div>

          <input
            onChange={handleInputChange}
            value={inputValue.email}
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 transition"
            required
          />

          <input
            onChange={handleInputChange}
            value={inputValue.password}
            name="password"
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 transition"
            required
          />

          <input
            onChange={handleInputChange}
            value={inputValue.confirmPassword}
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder-gray-400 transition"
            required
          />

          <button
            type="submit"
            disabled={isCreatingUserLoading}
            className={`w-full py-3 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition transform duration-200 ${isCreatingUserLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            {isCreatingUserLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="flex items-center mt-6 mb-3">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <p className="text-center text-gray-300">
          Already have an account?{' '}
          <span
            className="text-blue-400 font-semibold cursor-pointer hover:underline hover:text-blue-300 transition"
            onClick={() => setActiveTab('login')}
          >
            Login here
          </span>
        </p>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-lg"></div>
      </div>
      <Toaster />
    </div>
  );
};

export default Register;