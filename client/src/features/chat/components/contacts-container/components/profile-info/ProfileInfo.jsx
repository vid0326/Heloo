import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useDispatch, useSelector } from 'react-redux'
import { colors } from '../../../../../../lib/utils'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { FiEdit2 } from 'react-icons/fi'
import { IoPower } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import Profile from '../../../../../profile/Profile'
import { useGetLoggedInUserQuery, useLogoutMutation } from '../../../../../auth/authAPI'
import { selectOnlineUsers } from '../../../../../../context/socketSlice'

const ProfileInfo = () => {
    const { data: user, isLoading: isGettingLoggedInUser } = useGetLoggedInUserQuery();
    const [logout, { isLoading, isSuccess }] = useLogoutMutation();
    const onlineUsers = useSelector(selectOnlineUsers);

    const [openProfileModal, setOpenProfileModal] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            window.location.replace('/auth');
        }
    }, [isSuccess]);

    return (
        <div className="absolute bottom-0 h-16 flex rounded-t-lg items-center justify-between px-3 w-full bg-[#272a3d]">
            <div className='flex gap-3 items-center justify-around w-full overflow-hidden'>
                <div className='relative w-fit' >
                    <Avatar className="h-12 w-12 border-2 border-indigo-400 rounded-full overflow-hidden">
                        {user.profileImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={`${import.meta.env.VITE_HOST}/${user.profileImage}`} alt="profile" />
                            :
                            <div className={`uppercase h-12 w-12 text-xl border-[1px] flex items-center justify-center ${colors[user.color]} rounded-full`}>
                                {user.fullName.split('')[0]}
                            </div>
                        }
                    </Avatar>
                    <div
                        className={`absolute bottom-0 right-0.5  h-3 w-3 rounded-full border-2 border-gray-900 ${onlineUsers.includes(user._id) ? "bg-green-500" : "bg-gray-400"
                            }`}
                        title={onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    />
                </div>
                <div className='flex flex-col'>
                    <div className='flex gap-2 items-center flex-wrap'>
                        <span className="font-semibold text-lg text-white">{user.fullName}</span>
                    </div>
                    <span className='text-xs text-[#bdbdbd] mt-1 italic'>{user.bio}</span>
                </div>
                <div className='flex gap-3 items-center justify-center'>
                    <Tooltip>
                        <TooltipTrigger className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer hover:text-neutral-300">
                            <FiEdit2 onClick={() => setOpenProfileModal(true)} className="text-2xl" />
                        </TooltipTrigger>
                        <TooltipContent>
                            Edit
                        </TooltipContent>
                    </Tooltip>
                    {isLoading ?
                        <div className="h-5 w-5 border-2 border-red-400 border-t-red-500 rounded-full animate-spin" />
                        :
                        <Tooltip>
                            <TooltipTrigger className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all cursor-pointer hover:text-neutral-300">
                                <IoPower onClick={() => logout()} className="text-2xl" />
                            </TooltipTrigger>
                            <TooltipContent>
                                Logout
                            </TooltipContent>
                        </Tooltip>}
                    <Profile openProfileModal={openProfileModal} setOpenProfileModal={setOpenProfileModal} />
                </div>
            </div>
        </div>

    )
}

export default ProfileInfo
