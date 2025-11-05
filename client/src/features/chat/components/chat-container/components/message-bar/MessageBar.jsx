import React from 'react'
import { GrAttachment } from 'react-icons/gr'
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'
import { useState } from 'react'
import { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectFilePath, selectChatType, selectCurrentChat, uploadFileAsync, selectDmContactList, updateDmContactList, selectChannelList, updateChannelList, selectIsUploading } from '../../../../chatSlice'
import { useSocket } from '../../../../../../context/SocketContext'
import { useGetLoggedInUserQuery } from '../../../../../auth/authAPI'
import { setIsSendingMessage } from '../../../../../../context/socketSlice'

const MessageBar = () => {

    const currentChat = useSelector(selectCurrentChat);
    const chatType = useSelector(selectChatType);
    const filePath = useSelector(selectFilePath);
    const DmContactList = useSelector(selectDmContactList);
    const channelList = useSelector(selectChannelList);
    const { data: user, isLoading: isGettingLoggedInUser } = useGetLoggedInUserQuery();

    const isUploading = useSelector(selectIsUploading);

    const socket = useSocket();
    const fileInputRef = useRef();
    const dispatch = useDispatch();
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleEmojiClick = (emojiObject) => {
        setMessage(message + emojiObject.emoji);
    };
    const emojiRef = useRef();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [emojiRef]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        // console.log("Sending message:", message);

        if (chatType === 'contact') {
            dispatch(setIsSendingMessage(true));
            socket.emit('send-direct-message', {
                sender: user._id,
                receiver: currentChat._id,
                content: message,
                messageType: 'text',
            });
            const index = DmContactList.findIndex(contact => contact._id === currentChat._id);
            if (index !== -1 && index !== 0) {
                dispatch(updateDmContactList({ index }));
            }
        }
        if (chatType === "channel") {
            socket.emit('send-channel-message', {
                sender: user._id,
                content: message,
                messageType: 'text',
                receiver: null,
                channelId: currentChat._id,
                fileURL: undefined,
            })
            const index = channelList.findIndex(channel => channel._id === currentChat._id);
            if (index !== -1 && index !== 0) {
                dispatch(updateChannelList(index));
            }
        }
        setMessage('');


    }

    const handleAttachmentClick = () => {
        fileInputRef.current.click();
    };

    const handleAttachmentChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large! Must be under 5MB.");
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        dispatch(uploadFileAsync(formData));

    }

    useEffect(() => {
        if (filePath) {
            // console.log("File uploaded successfully:", filePath);
            if (chatType === 'contact') {
                socket.emit('send-direct-message', {
                    sender: user._id,
                    receiver: currentChat._id,
                    messageType: 'file',
                    fileURL: filePath,
                });
            }
            else if (chatType === 'channel') {
                socket.emit('send-channel-message', {
                    sender: user._id,
                    channelId: currentChat._id,
                    receiver: null,
                    messageType: 'file',
                    fileURL: filePath,
                    content: undefined,
                });
            }
        }
    }, [filePath])


    return (
        <form onSubmit={handleSendMessage} className="h-16 bg-gray-800/80 backdrop-blur-lg border-t border-gray-700/50 flex items-center px-4 md:px-6 gap-3">
            {/* Input Container */}
            <div className="flex-1 flex bg-gray-700/60 rounded-xl items-center gap-2 pr-2 border border-gray-600/50 focus-within:ring-2 focus-within:ring-purple-500/30 transition-all duration-300">
                {/* Message Input */}
                <input
                    type="text"
                    className="flex-1 py-4 px-4 bg-transparent w-full rounded-xl focus:outline-none text-gray-200 placeholder-gray-400"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => {
                        if (e.target.value.trim() !== "" || message !== "") {
                            setMessage(e.target.value);
                        }
                    }}
                />

                {/* Attachment Button */}
                <button
                    onClick={handleAttachmentClick}
                    type='button'
                    disabled={isUploading}
                    className={`p-2 text-gray-400 ${isUploading ? "cursor-not-allowed" : "cursor-pointer"} hover:text-purple-400 transition-colors duration-300 rounded-full hover:bg-gray-600/50`}
                    title="Attach file"
                >
                    <GrAttachment className="text-xl" />
                </button>
                <input type='file' className='hidden' ref={fileInputRef} onChange={handleAttachmentChange} />

                {/* Emoji Picker */}
                <div className="relative">
                    <button
                        type='button'
                        className="p-2 text-gray-400 cursor-pointer hover:text-yellow-400 transition-colors duration-300 rounded-full hover:bg-gray-600/50"
                        onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
                        title="Add emoji"
                    >
                        <RiEmojiStickerLine className="text-xl" />
                    </button>
                    {emojiPickerOpen && (
                        <div ref={emojiRef} className="absolute bottom-14 right-0 z-50">
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                autoFocusSearch={false}
                                theme="dark"
                                width={300}
                                height={400}
                                previewConfig={{ showPreview: false }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Send Button */}
            <button
                type='submit'
                disabled={message === ""}
                className={`p-4 rounded-xl flex items-center justify-center transition-all duration-300 
                    ${message === ""
                        ? "text-gray-500 bg-gray-600 cursor-not-allowed "
                        : "bg-green-600 shadow-lg transform hover:scale-105 cursor-pointer"
                    }`}
                title="Send message"
            >
                <IoSend className="text-xl" />
            </button>
        </form>

    )
}

export default MessageBar