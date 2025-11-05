import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Victory from '../assets/howdy.png';
import Login from '../features/auth/components/Login';
import Register from '../features/auth/components/Register';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useGetLoggedInUserQuery } from '../features/auth/authAPI';

const AuthPage = () => {
  const { data: user, isLoading: isGettingLoggedInUser } = useGetLoggedInUserQuery();

  const [activeTab, setActiveTab] = useState('login');
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

  if (user) return <Navigate to={from || '/'} replace />;

  if (isGettingLoggedInUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-[100svh] overflow-hidden min-w-[300px] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Animated Gradient Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientBG 15s ease infinite'
        }}
      />
      <style>
        {`
          @keyframes gradientBG {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
        `}
      </style>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-4xl bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-700"
      >
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-900/90 to-purple-900/90 w-1/2 p-10  text-white relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-purple-600/20 rounded-full blur-2xl"></div>
          <motion.img
            src={Victory}
            alt="Victory Logo"
            className="h-28 w-auto drop-shadow-xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, delay: 0.2 }}
          />
          <motion.h2
            className="text-4xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to Hello
          </motion.h2>
          <motion.p
            className="text-blue-200/80 text-lg text-center mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Join us and start your journey!
          </motion.p>

          {/* Social Icons Section */}
          <motion.div
            className="flex space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a href="https://github.com/vid0326" className="text-blue-200 hover:text-white transition-colors duration-300">
              <FaGithub className="w-6 h-6" />
            </a>
            <a href="/" className="text-blue-200 hover:text-white transition-colors duration-300">
              <FaLinkedin className="w-6 h-6" />
            </a>
            <a href="/" className="text-blue-200 hover:text-white transition-colors duration-300">
              <FaTwitter className="w-6 h-6" />
            </a>
            <a href="/" className="text-blue-200 hover:text-white transition-colors duration-300">
              <FaInstagram className="w-6 h-6" />
            </a>
          </motion.div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-gray-700/60 backdrop-blur rounded-full p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('login')}
                className={`px-6 py-2 rounded-full font-semibold cursor-pointer transition-all duration-300 ${activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:text-blue-400'
                  }`}
                aria-selected={activeTab === 'login'}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`px-6 py-2 rounded-full font-semibold cursor-pointer transition-all duration-300 ${activeTab === 'register'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-300 hover:text-green-400'
                  }`}
                aria-selected={activeTab === 'register'}
              >
                Register
              </button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'login' ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'login' ? -30 : 30 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'login'
                ? <Login setActiveTab={setActiveTab} />
                : <Register setActiveTab={setActiveTab} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 flex justify-center z-20">
        <span className="text-gray-400 text-xs flex items-center gap-1">
          Made with
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block mx-1"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="red"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          by Vidhut
        </span>
      </footer>
    </div>
  );
};

export default AuthPage;