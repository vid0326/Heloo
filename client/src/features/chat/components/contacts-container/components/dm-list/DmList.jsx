import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    selectCurrentChat,
    selectChatType,
    selectDmContactList,
    selectChannelList,
    selectChannelMembers,
    setChatType,
    setChatMessagesEmpty,
    setCurrentChat,
    setChannelMembersEmpty,
    getChannelMembersAsync,
    selectIsGetDmContactList,
    selectIsGetChannels,
    selectIsCreatingChannel
} from '../../../../chatSlice'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { colors } from '../../../../../../lib/utils'
import { selectOnlineUsers } from '../../../../../../context/socketSlice'

const DmList = ({ isChannel }) => {
    const dispatch = useDispatch();

    const onlineUsers = useSelector(selectOnlineUsers);
    // console.log("Online Users:", onlineUsers);
    const isGetDmContactList = useSelector(selectIsGetDmContactList);
    const isGetChannels = useSelector(selectIsGetChannels);
    const contacts = useSelector(selectDmContactList);
    const currentChat = useSelector(selectCurrentChat);
    const chatType = useSelector(selectChatType);
    const channelsList = useSelector(selectChannelList);
    const channelMembers = useSelector(selectChannelMembers);
    const isCreatingChannel = useSelector(selectIsCreatingChannel);


    const handleClick = (contact) => {
        if (isChannel) {
            dispatch(setChatType("channel"));
        }
        else {
            dispatch(setChatType("contact"));
            dispatch(setCurrentChat(contact));
        }
        if (currentChat && currentChat._id !== contact._id) {
            dispatch(setChatMessagesEmpty());
        }
        if (channelMembers.length !== 0) dispatch(setChannelMembersEmpty());
    }

    return (
        <div className="mt-5 space-y-3">
            {!isChannel && isGetDmContactList && (
                <div className="flex items-center gap-2 px-4 py-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span className="text-indigo-300 font-medium">Loading contacts...</span>
                </div>
            )}
            {!isChannel && contacts.length > 0 && contacts.map((contact) => (
                <div
                    key={contact._id}
                    className={`group relative px-4 py-2 m-2 rounded-xl shadow-lg bg-gradient-to-r transition-all duration-300 cursor-pointer border border-transparent
                        ${currentChat && currentChat._id === contact._id
                            ? "from-indigo-700 to-indigo-900 border-indigo-400"
                            : "from-gray-800 to-gray-900 hover:from-indigo-800 hover:to-indigo-900 hover:border-indigo-400"
                        }`}
                    onClick={() => handleClick(contact)}
                >
                    <div className="flex gap-4 items-center text-neutral-100">
                        <div className='relative w-fit'>
                            <Avatar className="h-12 w-12 rounded-full shadow-md border-2 border-indigo-400 group-hover:scale-110 transition-transform duration-200">
                                {contact.profileImage ? (
                                    <AvatarImage
                                        className="object-cover w-full h-full bg-black"
                                        src={`${import.meta.env.VITE_HOST}/${contact.profileImage}`}
                                        alt="profile"
                                    />
                                ) : (
                                    <div className={`uppercase h-12 w-12 text-2xl font-bold flex items-center justify-center ${colors[contact.color]} rounded-full`}>
                                        {contact.fullName.split('')[0]}
                                    </div>
                                )}
                            </Avatar>
                            <div
                                className={`absolute bottom-0 right-0.5 h-3 w-3 rounded-full border-2 border-gray-900 ${onlineUsers.includes(contact._id) ? "bg-green-500" : "bg-gray-400"
                                    }`}
                                title={onlineUsers.includes(contact._id) ? "Online" : "Offline"}
                            />
                        </div>
                        <div className='flex flex-col'>
                            <span className="font-semibold text-lg tracking-wide group-hover:text-indigo-300 transition-colors duration-200">
                                {contact.fullName}
                            </span>
                            <span className='text-xs text-indigo-200 opacity-80 group-hover:text-indigo-100'>
                                @{contact.username}
                            </span>
                        </div>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg width="20" height="20" fill="none" className="text-indigo-300">
                            <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            ))}

            {!isChannel && !isGetDmContactList && contacts.length == 0 &&
                <div className=" text-gray-500 mt-4 m-5 text-wrap">
                    No contacts available. Add one to start chatting!
                </div>
            }

            {isChannel && isCreatingChannel && (
                <div className="flex items-center gap-2 px-4 py-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span className="text-indigo-300 font-medium">Creating channel...</span>
                </div>
            )}
            {isChannel && isGetChannels && (
                <div className="flex items-center gap-2 px-4 py-2">
                    <svg className="animate-spin h-5 w-5 text-pink-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span className="text-pink-300 font-medium">Loading channels...</span>
                </div>
            )}
            {isChannel && channelsList.length > 0 && channelsList.map((channel) => (
                <div
                    key={channel._id}
                    className={`group relative px-4 py-2 m-2 rounded-xl shadow-lg bg-gradient-to-r transition-all duration-300 cursor-pointer border border-transparent
                        ${chatType === "channel" && currentChat && currentChat._id === channel._id
                            ? "from-pink-700 to-pink-900 border-pink-400"
                            : "from-gray-800 to-gray-900 hover:from-pink-800 hover:to-pink-900 hover:border-pink-400"
                        }`}
                    onClick={() => {
                        dispatch(setChatMessagesEmpty());
                        dispatch(setChatType("channel"));
                        dispatch(setCurrentChat(channel));
                        dispatch(getChannelMembersAsync({ channelId: channel._id }));
                    }}
                >
                    <div className="flex gap-4 items-center text-neutral-100">
                        <Avatar className="h-12 w-12 rounded-full shadow-md border-2 border-pink-400 group-hover:scale-110 transition-transform duration-200">
                            {channel.profileImage ? (
                                <AvatarImage
                                    className="object-cover w-full h-full bg-black"
                                    src={`${import.meta.env.VITE_HOST}/${channel.profileImage}`}
                                    alt="profile"
                                />
                            ) : (
                                <div className={`uppercase h-12 w-12 text-2xl font-bold flex items-center justify-center ${colors[channel.color]} rounded-full`}>
                                    {channel.name.split('')[0]}
                                </div>
                            )}
                        </Avatar>
                        <div className='flex flex-col'>
                            <span className="font-semibold text-lg tracking-wide group-hover:text-pink-300 transition-colors duration-200">
                                {channel.name}
                            </span>
                            <span className='text-xs text-pink-200 opacity-80 group-hover:text-pink-100'>
                                @{channel.handle}
                            </span>
                        </div>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg width="20" height="20" fill="none" className="text-pink-300">
                            <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            ))}
            {isChannel && !isGetChannels && channelsList.length === 0 && (
                <div className=" text-gray-500 mt-4 m-5 text-wrap">
                    No channels available. Create one to start chatting!
                </div>
            )}
        </div>
    );
}

export default DmList
