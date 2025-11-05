import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { colors } from '../../lib/utils';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { deleteChannelProfileImageAsync, selectCurrentChat, updateChannelProfileAsync, updateChannelProfileImageAsync } from '../chat/chatSlice';

const ChannelProfile = ({ openChannelProfileModal, setOpenChannelProfileModal }) => {

    const currenChat = useSelector(selectCurrentChat);
    const [selectedColor, setSelectedColor] = useState(currenChat.color);
    const [hovered, setHovered] = useState(false);
    const [channelInfo, setChannelInfo] = useState({
        handle: currenChat.handle,
        name: currenChat.name,
        bio: currenChat.bio,
        profileImage: currenChat.profileImage,
        previewImage: '',
    });

    const ref = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setChannelInfo({
            ...channelInfo,
            [name]: value,
        });
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(updateChannelProfileAsync({ channelId: currenChat._id, handle: channelInfo.handle, name: channelInfo.name, color: selectedColor, bio: channelInfo.bio }));
        navigate('/');
    }

    const handleFileInputClick = () => {
        ref.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large! Must be under 5MB.");
            return;
        }

        if (file.size <= 50) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setChannelInfo({
                    ...channelInfo,
                    profileImage: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
        else {
            const formData = new FormData();
            formData.append('channelProfileImage', file);

            const preview = URL.createObjectURL(file);
            setChannelInfo({
                ...channelInfo,
                previewImage: preview,
            });

            dispatch(updateChannelProfileImageAsync({ formData, channelId: currenChat._id }));
        }

    };

    const handleChannelImageDelete = () => {

        setChannelInfo({
            ...channelInfo,
            profileImage: '',
            previewImage: '',
        });
        dispatch(deleteChannelProfileImageAsync(currenChat._id));

    };

    return (
        <Dialog open={openChannelProfileModal} onOpenChange={() => setOpenChannelProfileModal(false)}>
            <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
                <DialogHeader className="sr-only">
                    <DialogTitle>Select contacts to create a channel</DialogTitle>
                    <DialogDescription>select at least one contact</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-8">
                        <div className="relative " onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                            <Avatar className="h-18 w-18 rounded-full overflow-hidden">
                                {channelInfo.profileImage || channelInfo.previewImage ? <AvatarImage className="object-cover w-full h-full bg-black" src={channelInfo.previewImage || `${import.meta.env.VITE_HOST}/${channelInfo.profileImage}`} alt="profile" />
                                    :
                                    // <input type="file" />
                                    <div className={`uppercase h-18 w-18 text-3xl border-[1px] flex items-center justify-center ${colors[selectedColor]} rounded-full`}>
                                        {channelInfo.name.split('')[0]}
                                    </div>
                                }
                            </Avatar>
                            {hovered && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-500 rounded-full">
                                    {channelInfo.previewImage || channelInfo.profileImage ? (
                                        <FaTrash onClick={handleChannelImageDelete} className="text-white text-2xl cursor-pointer" />
                                    ) : (
                                        <FaPlus onClick={handleFileInputClick} className="text-white text-2xl cursor-pointer" />
                                    )}
                                </div>
                            )}
                            <input ref={ref} type="file" onChange={handleFileChange} className='hidden' accept='.jpg, .jpeg, .png, .svg, .webp' />
                        </div>
                    </div>
                    <div></div>
                    <div className='flex gap-3'>
                        <input type="text" name='username' onChange={handleChange} value={channelInfo.handle} placeholder='Username'
                            className="w-full px-4 py-2 bg-slate-700 text-slate-300 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200"
                            disabled />
                        <input type="text" name='name' placeholder="Full Name" onChange={handleChange} value={channelInfo.name}
                            className="w-full px-4 py-2 bg-slate-700 text-white placeholder-slate-500 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200" required />
                    </div>
                    <div>
                        <input type="textarea" name='bio' onChange={handleChange} value={channelInfo.bio} placeholder='Bio'
                            className="w-full px-4 py-2 bg-slate-700 text-slate-300 rounded-lg border border-slate-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-200" />
                    </div>



                    <div className="flex justify-center space-x-4 py-2">
                        {colors.map((color, index) => (
                            <div
                                className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index
                                    ? "outline-white/50 outline-1"
                                    : ""
                                    }`}
                                key={index}
                                onClick={() => setSelectedColor(index)}
                            ></div>
                        ))}
                    </div>

                    <button type='submit'
                        className="w-full cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
                        Save Changes
                    </button>
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default ChannelProfile
