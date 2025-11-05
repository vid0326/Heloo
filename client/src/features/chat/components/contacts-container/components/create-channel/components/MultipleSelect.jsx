import React, { useState, useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { createChannelAsync, searchContactsAsync, selectContacts, selectIsSearchingContacts, setContactsEmpty, setChatType } from '../../../../../chatSlice';
import '../../../../../../../App.css'
import { colors, useDebounce } from '../../../../../../../lib/utils';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGetLoggedInUserQuery } from '../../../../../../auth/authAPI';

const InlineUserSelector = forwardRef(({ channelName, setOpenNewContactModal }, ref) => {
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery);
    const isSearchingContacts = useSelector(selectIsSearchingContacts);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const contacts = useSelector(selectContacts);
    const dispatch = useDispatch();
    const inputRef = useRef();
    const { data: user, isLoading: isGettingLoggedInUser } = useGetLoggedInUserQuery();



    useImperativeHandle(ref, () => ({
        handleSubmit: () => {

            if (channelName.trim() === '') {
                alert("Please enter a channel name.");
                return;
            }
            if (selectedUsers.length === 0) {
                alert("Please select at least one contact.");
                return;
            }

            dispatch(createChannelAsync({
                name: channelName,
                members: selectedUsers.map(user => user._id),
            }));
            setOpenNewContactModal(false);
        }
    }));

    const handleUserSelect = (user) => {
        if (!selectedUsers.some(u => u.username === user.username)) {
            setSelectedUsers(prev => [...prev, user]);
        }
        setSearchQuery('');
        dispatch(setContactsEmpty());
        inputRef.current?.focus();
    };

    const handleRemoveUser = (username) => {
        setSelectedUsers(prev => prev.filter(user => user.username !== username));
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && searchQuery === '' && selectedUsers.length > 0) {
            setSelectedUsers(prev => prev.slice(0, -1));
        }
    };

    const handleInputChange = (e) => {
        if (searchQuery === '' && e.target.value.trim() === '') return;
        dispatch(setContactsEmpty());
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        if (debouncedSearchQuery) {
            dispatch(searchContactsAsync({ searchTerm: debouncedSearchQuery }));
        }
    }, [debouncedSearchQuery, dispatch]);

    return (
        <div className="max-w-xl mx-auto space-y-2">
            {/* Combined Input and Selected Users */}
            <div
                className={`w-full min-h-12 overflow-scroll scrollbar-hidden p-2 rounded-lg border transition-all shadow-sm flex items-center gap-2 cursor-text border-gray-300`}
            >
                <AnimatePresence>
                    {selectedUsers.map((user) => (
                        <motion.div
                            key={user.username}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center bg-blue-100 rounded-full px-3 py-1"
                        >
                            <div className="flex items-center">
                                <span className="text-xs font-medium text-nowrap text-blue-800">
                                    {user.fullName}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveUser(user.username);
                                    }}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedUsers.length === 0 ? "Search contacts by name or email..." : ""}
                        className="w-full p-1 bg-transparent outline-none"
                    />
                    {isSearchingContacts && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            <ScrollArea className="mt-3 h-[175px]">
                <div className='flex flex-col justify-center'>
                    {contacts.length > 0 && contacts
                        .filter(contact => !selectedUsers.some(user => user._id === contact._id))
                        .map((contact) => (

                            <div className='flex border-b gap-3 items-center justify-start cursor-pointer rounded-lg hover:bg-gray-700 p-2' key={contact._id} onClick={() => handleUserSelect(contact)}>
                                <Avatar className="h-10 w-10 rounded-full">
                                    {contact.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${contact.profileImage}`} alt="profile" />
                                        :
                                        <div className={`uppercase h-10 w-10 text-sm border-[1px] flex items-center justify-center ${colors[contact.color]} rounded-full`}>
                                            {contact.fullName.split('')[0]}
                                        </div>
                                    }
                                </Avatar>
                                <div className='flex flex-col'>
                                    <span className="font-semibold text-white">{contact.fullName}</span>
                                    <span className='text-xs text-[#bdbdbd]'>@{contact.username}</span>
                                </div>
                            </div>
                        ))}
                </div>
            </ScrollArea>
        </div>
    );
});

export default InlineUserSelector;