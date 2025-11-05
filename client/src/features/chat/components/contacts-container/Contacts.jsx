import React, { useEffect } from 'react'
import ProfileInfo from './components/profile-info/ProfileInfo'
import NewDm from './components/new-dm/NewDm'
import { FiMessageSquare } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { getChannelsAsync, getDmContactListAsync, selectChannelList, selectChatMessages, selectChatType, selectCurrentChat, selectDmContactList, updateDmContactList } from '../../chatSlice'
import DmList from './components/dm-list/DmList'
import CreateChannel from './components/create-channel/CreateChannel'
import { useGetLoggedInUserQuery } from '../../../auth/authAPI'

const Contacts = () => {

    const { data: user, isLoading: isGettingLoggedInUser } = useGetLoggedInUserQuery();

    const dispatch = useDispatch();
    const chatMessages = useSelector(selectChatMessages);
    const chatType = useSelector(selectChatType);
    const currentChat = useSelector(selectCurrentChat);
    const DmContactList = useSelector(selectDmContactList);
    const channelList = useSelector(selectChannelList);

    useEffect(() => {
        dispatch(getChannelsAsync());
        dispatch(getDmContactListAsync());
    }, []);

    useEffect(() => {
        if (chatType === "contact" && chatMessages.length > 0 && !DmContactList.some(contact => contact._id === currentChat._id)) {
            dispatch(updateDmContactList({ currentChat }));
        }
    }, [chatMessages]);

    return (
        <div className="relative min-w-[300px] md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
            <div className="pt-5 px-6 flex items-center gap-3">
                <FiMessageSquare className="text-yellow-400 text-xl" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
                    Heloo
                </span>
            </div>

            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Direct Messages" />
                    <NewDm />
                </div>
                <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
                    <DmList isChannel={false} />
                </div>
            </div>

            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Channels" />
                    <CreateChannel />
                </div>
                <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
                    <DmList isChannel={true} />
                </div>
            </div>
            <ProfileInfo />
        </div>
    )
}

export default Contacts


const Title = ({ text }) => {
    return (
        <h2 className="text-white text-md font-medium pl-5 tracking-wide uppercase drop-shadow-sm">
            {text}
        </h2>
    )
}