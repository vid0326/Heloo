import React from 'react';
import { FaRegSmileWink } from 'react-icons/fa';

const EmptyChat = () => {
    return (
        <div className="flex-1 min-w-[300px] md:bg-gradient-to-br md:from-[#1c1d25] md:to-[#23243a] md:flex flex-col justify-center items-center hidden duration-1000 transition-all relative overflow-hidden">
            {/* Decorative background circles */}
            <div className="absolute w-72 h-72 bg-[#2d2e42] opacity-30 rounded-full -top-20 -left-20 blur-2xl pointer-events-none"></div>
            <div className="absolute w-56 h-56 bg-[#3a3b5a] opacity-20 rounded-full -bottom-16 -right-16 blur-2xl pointer-events-none"></div>
            {/* Main content */}
            <div className="z-10 flex flex-col items-center">
                <FaRegSmileWink className="text-6xl text-[#7f8cff] mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">No Chat Selected</h2>
                <p className="text-md text-[#b0b3c6] mb-6 text-center max-w-xs">
                    Start a new conversation or select an existing chat to begin messaging!
                </p>
            </div>
        </div>
    );
};

export default EmptyChat;
