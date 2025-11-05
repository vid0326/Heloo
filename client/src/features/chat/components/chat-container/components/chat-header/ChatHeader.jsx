import React, { useState } from 'react'
import { RiCloseFill, RiDeleteBinFill, RiEditLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { deleteChannelAsync, leaveChannelAsync, removeMemberAsync, selectChannelMembers, selectChatType, selectCurrentChat, setChannelMembersEmpty, setChatType, setCurrentChat } from '../../../../chatSlice';
import { FaSearch } from 'react-icons/fa'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { colors } from '../../../../../../lib/utils';
import InlineUserSelector from './MultipleSelect';
import ChannelProfile from '../../../../../profile/ChannelProfile';
import { FiDelete } from 'react-icons/fi';
import { GrView } from 'react-icons/gr';
import { IoMdExit } from 'react-icons/io';
import { useGetLoggedInUserQuery } from '../../../../../auth/authAPI';

const ChatHeader = () => {
    const dispatch = useDispatch();
    const currentChat = useSelector(selectCurrentChat);
    const chatType = useSelector(selectChatType);
    const { data: user, isLoading: isGettingLoggedInUser } = useGetLoggedInUserQuery();
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [openChannelProfileModal, setOpenChannelProfileModal] = useState(false);
    const [removeMembers, setRemoveMembers] = useState([]);
    const [deleteChannels, setDeleteChannels] = useState([]);

    const channelMembers = useSelector(selectChannelMembers);
    const [addMembersMode, setAddMembersMode] = useState(false);

    const handleOpenChange = () => {
        if (addMembersMode) {
            setAddMembersMode(false);
            return;
        }
        setOpenNewContactModal(false);
    }

    const handleRemoveMember = (channelId, memberId) => {
        setRemoveMembers(prev => [...prev, memberId]);
        dispatch(removeMemberAsync({ channelId, memberId })).unwrap().then(() => {
            setRemoveMembers(prev => prev.filter(id => id !== memberId));
        });
    }

    const handleAddMembers = () => {
        setAddMembersMode(true);
    }

    return (
        <div className="h-18 border-b border-[#2f303b] flex items-center justify-between md:px-8 px-4 bg-gradient-to-r from-[#1a1a2e] via-[#23234b] to-[#1a1a2e] shadow-lg">
            <div className="flex gap-6 items-center w-full">

                {/* contact ke liey */}
                {chatType === "contact" &&
                    <div className="flex gap-4 items-center  rounded-xl py-3">
                        <Avatar className="h-14 w-14 border-2 border-indigo-400 rounded-full shadow-lg">
                            {currentChat.profileImage ? (
                                <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${currentChat.profileImage}`} alt="profile" />
                            ) : (
                                <div className={`uppercase h-14 w-14 text-2xl border-[1px] flex items-center justify-center ${colors[currentChat.color]} rounded-full`}>
                                    {currentChat.fullName.split('')[0]}
                                </div>
                            )}
                        </Avatar>
                        <div className='flex flex-col'>
                            <div className='flex gap-2 items-center'>
                                <span className="font-semibold text-lg text-white">{currentChat.fullName}</span>
                                <span className='text-xs text-[#bdbdbd] bg-[#2d2d4d] px-2 py-0.5 rounded-full'>@{currentChat.username}</span>
                            </div>
                            <span className='text-xs text-[#bdbdbd] mt-1 italic'>{currentChat.bio}</span>
                        </div>
                    </div>
                }

                {/* channel ke liye */}
                {chatType === "channel" &&
                    <div className="flex gap-4 items-center rounded-xl w-full">
                        <Avatar className="h-14 w-14 rounded-full border-2 border-pink-400 shadow-lg">
                            {currentChat.profileImage ? (
                                <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${currentChat.profileImage}`} alt="profile" />
                            ) : (
                                <div className={`uppercase h-14 w-14 text-2xl border-[1px] flex items-center justify-center ${colors[currentChat.color]} rounded-full`}>
                                    {currentChat.name.split('')[0]}
                                </div>
                            )}
                        </Avatar>
                        <div className='flex flex-col flex-1'>
                            <div className='flex gap-2 items-center'>
                                <span className="font-semibold text-lg text-white">{currentChat.name}</span>
                                <span className='text-xs text-[#bdbdbd] bg-[#2d2d4d] px-2 py-0.5 rounded-full'>@{currentChat.handle}</span>
                            </div>
                            <span className='text-xs text-[#bdbdbd] mt-1 italic'>{currentChat.bio}</span>
                        </div>
                        <div className="flex gap-3 items-center ml-auto">

                            {/* view button */}
                            <Tooltip>
                                <TooltipTrigger>
                                    <GrView
                                        className="text-[#bdbdbd] hover:text-[#fff] text-xl cursor-pointer transition-all duration-300"
                                        onClick={() => setOpenNewContactModal(true)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                                    View Channel
                                </TooltipContent>
                            </Tooltip>

                            {/* leave button */}
                            {currentChat.admin._id !== user._id &&
                                <Tooltip>
                                    <TooltipTrigger>
                                        <IoMdExit

                                            className="text-[#bdbdbd] hover:text-[#ff4d4f] text-xl cursor-pointer transition-all duration-300"
                                            onClick={() => {
                                                dispatch(leaveChannelAsync({ channelId: currentChat._id, memberId: user._id }));
                                            }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                                        Leave Channel
                                    </TooltipContent>
                                </Tooltip>
                            }
                            <Dialog open={openNewContactModal} onOpenChange={handleOpenChange}>
                                <DialogContent className="bg-[#181920] border-none text-white w-[420px] h-[440px] flex flex-col rounded-2xl shadow-2xl">
                                    <DialogHeader>
                                        <DialogTitle>
                                            <div className='flex gap-2 items-center'>
                                                <span className='text-2xl font-bold text-[#8417ff]'>{currentChat.name}</span>
                                                <span className='text-sm text-[#bdbdbd] bg-[#2d2d4d] px-2 py-0.5 rounded-full'>@{currentChat.handle}</span>
                                            </div>
                                        </DialogTitle>
                                        <DialogDescription className="text-[#bdbdbd]">{currentChat.bio}</DialogDescription>
                                    </DialogHeader>
                                    {addMembersMode ? (
                                        <InlineUserSelector setAddMembersMode={setAddMembersMode} />
                                    ) : (
                                        <>
                                            <div className='flex gap-3 items-center mt-2'>
                                                <div className='w-full flex items-center justify-around bg-[#23234b] gap-3 py-3 rounded-lg shadow'>
                                                    <span className="text-[#fff] font-semibold">
                                                        {channelMembers.length}{channelMembers.length === 1 || channelMembers.length === 0 ? " member" : " members"}
                                                    </span>
                                                    <FaSearch className="text-[#bdbdbd]" />
                                                </div>
                                                {currentChat.admin._id === user._id &&
                                                    <button type='button' className="min-w-1/4 bg-gradient-to-r from-[#8417ff] to-[#5f17ff] rounded-lg flex items-center justify-center px-5 py-2 font-semibold text-white shadow hover:from-[#741bda] hover:to-[#4e13b3] cursor-pointer transition-all" onClick={handleAddMembers} >Add</button>}
                                            </div>
                                            <ScrollArea className="mt-4 h-[220px]">
                                                <div className='flex flex-col justify-center gap-2'>
                                                    <div className={`flex gap-3 items-center justify-start ${currentChat.admin._id === user._id ? "cursor-not-allowed" : "cursor-pointer"} rounded-lg hover:bg-[#2d2d4d] p-2 transition-all`} onClick={() => {
                                                        if (currentChat.admin._id === user._id) return;
                                                        dispatch(setCurrentChat(currentChat.admin));
                                                        dispatch(setChatType("contact"));
                                                        dispatch(setChannelMembersEmpty());
                                                        setOpenNewContactModal(false);
                                                    }} >
                                                        <Avatar className="h-10 w-10 rounded-full">
                                                            {currentChat.admin.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${currentChat.admin.profileImage}`} alt="profile" />
                                                                :
                                                                <div className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center ${colors[currentChat.admin.color]} rounded-full`}>
                                                                    {currentChat.admin.fullName.split('')[0]}
                                                                </div>
                                                            }
                                                        </Avatar>
                                                        <div className='flex flex-col'>
                                                            <span className="font-semibold text-white">{currentChat.admin.fullName}</span>
                                                            <span className='text-xs text-[#bdbdbd]'>@{currentChat.admin.username}</span>
                                                        </div>
                                                        <span className='text-white rounded-md bg-gradient-to-r from-green-600 to-green-700 px-2 ml-2 text-xs font-bold'>
                                                            admin
                                                        </span>
                                                        {currentChat.admin._id === user._id &&
                                                            <span className="ml-2 text-xs text-[#bdbdbd]">
                                                                you
                                                            </span>
                                                        }
                                                    </div>
                                                    {channelMembers.map((contact) => (
                                                        <div className='flex items-center justify-between' key={contact._id}>
                                                            <div className={`w-full flex gap-3 items-center justify-start ${contact._id === user._id ? "cursor-not-allowed" : "cursor-pointer"} rounded-lg hover:bg-[#2d2d4d] p-2 transition-all`} onClick={() => {
                                                                if (contact._id === user._id) return;
                                                                dispatch(setCurrentChat(contact));
                                                                dispatch(setChatType("contact"));
                                                                dispatch(setChannelMembersEmpty());
                                                                setOpenNewContactModal(false);
                                                            }}>
                                                                <Avatar className="h-10 w-10 rounded-full">
                                                                    {contact.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${contact.profileImage}`} alt="profile" />
                                                                        :
                                                                        <div className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center ${colors[contact.color]} rounded-full`}>
                                                                            {contact.fullName.split('')[0]}
                                                                        </div>
                                                                    }
                                                                </Avatar>
                                                                <div className='flex flex-col'>
                                                                    <span className="font-semibold text-white">{contact.fullName}</span>
                                                                    <span className='text-xs text-[#bdbdbd]'>@{contact.username}</span>
                                                                </div>
                                                                <span className='text-white rounded-md bg-gradient-to-r from-yellow-600 to-yellow-700 px-2 ml-2 text-xs font-bold'>
                                                                    member
                                                                </span>
                                                                {contact._id === user._id &&
                                                                    <span className="ml-2 text-xs text-[#bdbdbd]">
                                                                        you
                                                                    </span>
                                                                }
                                                            </div>
                                                            {currentChat.admin._id !== user._id ? null : (
                                                                removeMembers.includes(contact._id) ? (
                                                                    <div className="h-5 w-5 border-2 border-red-400 border-t-red-500 rounded-full animate-spin" />
                                                                ) : (
                                                                    <Tooltip>
                                                                        <TooltipTrigger>
                                                                            <FiDelete
                                                                                color="#ff4d4f"
                                                                                size={20}
                                                                                className="cursor-pointer ml-[24px] hover:scale-110 transition-all"
                                                                                onClick={() => handleRemoveMember(currentChat._id, contact._id)}
                                                                            />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                                                                            Remove
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                )
                                                            )}
                                                        </div>))}
                                                </div>
                                            </ScrollArea>
                                        </>
                                    )}
                                </DialogContent>
                            </Dialog>

                            {/* edit button */}
                            {currentChat.admin._id === user._id &&
                                <Tooltip>
                                    <TooltipTrigger>
                                        <RiEditLine
                                            className="text-[#bdbdbd] hover:text-[#8417ff] text-xl cursor-pointer transition-all duration-300"
                                            onClick={() => setOpenChannelProfileModal(true)}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                                        Edit Channel
                                    </TooltipContent>
                                </Tooltip>
                            }
                            <ChannelProfile openChannelProfileModal={openChannelProfileModal} setOpenChannelProfileModal={setOpenChannelProfileModal} />

                            {/* delete button */}
                            {currentChat.admin._id !== user._id ? null : deleteChannels.includes(currentChat._id) ?
                                <div className="h-5 w-5 border-2 border-red-400 border-t-red-500 rounded-full animate-spin" />
                                :
                                <Tooltip>
                                    <TooltipTrigger>
                                        <RiDeleteBinFill
                                            className="text-[#bdbdbd] hover:text-[#ff4d4f] text-xl cursor-pointer transition-all duration-300"
                                            onClick={() => {
                                                setDeleteChannels(prev => [...prev, currentChat._id]);
                                                dispatch(deleteChannelAsync(currentChat._id)).unwrap().then(() => {
                                                    setDeleteChannels(prev => prev.filter(id => id !== currentChat._id));
                                                });
                                            }}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                                        Delete Channel
                                    </TooltipContent>
                                </Tooltip>
                            }
                        </div>
                    </div>
                }


                {/* channel close button hai */}
                <div className="flex items-center justify-center gap-5 ml-auto">
                    <button className="text-[#bdbdbd] hover:text-[#fff] bg-[#23234b] rounded-full p-2 shadow-md focus:outline-none transition-all" onClick={() => {
                        dispatch(setCurrentChat(null));
                        dispatch(setChatType(null));
                        if (channelMembers.length !== 0) {
                            dispatch(setChannelMembersEmpty());
                        };
                    }}>
                        <RiCloseFill className="text-3xl cursor-pointer" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader