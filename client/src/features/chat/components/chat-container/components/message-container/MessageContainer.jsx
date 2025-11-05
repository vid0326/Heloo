import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { downloadFileAsync, getChannelMessagesAsync, getMessagesAsync, selectFileDownloadProgress, selectFileUploadProgress, selectIsDownloading, selectIsUploading, selectChatMessages, selectChatType, selectCurrentChat, setFileDownloadProgress, selectIsGettingMessages } from '../../../../chatSlice';
import moment from 'moment';
import { IoMdArrowRoundDown } from 'react-icons/io';
import { GrDocumentZip, GrUpload } from 'react-icons/gr';
import { IoCloseSharp } from 'react-icons/io5';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { colors } from '../../../../../../lib/utils';
import { useSocket } from '../../../../../../context/SocketContext';
import { useGetLoggedInUserQuery } from '../../../../../auth/authAPI';
import { selectDeletingDmMessageId, selectIsSendingMessage, setDeletingDmMessageId, setIsDeletingDmMessage } from '../../../../../../context/socketSlice';

const MessageContainer = () => {
  const { data: user, isLoading: isGettingLoggedInUser } = useGetLoggedInUserQuery();

  const currentChat = useSelector(selectCurrentChat);
  const chatMessages = useSelector(selectChatMessages);
  const chatType = useSelector(selectChatType);
  const isDownloading = useSelector(selectIsDownloading);
  const isUploading = useSelector(selectIsUploading);
  const FileUploadProgress = useSelector(selectFileUploadProgress);
  const FileDownloadProgress = useSelector(selectFileDownloadProgress);
  const isSendingMessage = useSelector(selectIsSendingMessage);
  // console.log(isUploading, FileDownloadProgress)
  const isGettingMessages = useSelector(selectIsGettingMessages);
  const deletingDmMessageId = useSelector(selectDeletingDmMessageId);

  const socket = useSocket();
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const [showImage, setShowImage] = useState(false);
  const [filePath, setFilePath] = useState(null);

  useEffect(() => {

    if (chatType == "contact") {
      dispatch(getMessagesAsync({
        senderId: user._id,
        receiverId: currentChat._id,
      }));
    }
    else if (chatType == "channel") {
      dispatch(getChannelMessagesAsync({ channelId: currentChat._id }))
    }
  }, [chatType, currentChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [chatMessages]);


  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const handleImageClick = (filePath) => {
    setShowImage(true);
    setFilePath(filePath);
  }

  const handleDirectMessageDelete = (messageId) => {
    dispatch(setDeletingDmMessageId({ messageId, deleted: false }));
    socket.emit('delete-direct-message', {
      senderId: user._id,
      receiverId: currentChat._id,
      messageId: messageId,
    });
  }

  const handleChannelMessageDelete = (channelMessageId, byAdmin) => {
    // console.log("handleChannelMessageDelete", byAdmin)
    if (byAdmin) {
      socket.emit('delete-channel-message-by-admin', {
        channelId: currentChat._id,
        channelMessageId: channelMessageId,
      });
      return;
    }
    socket.emit('delete-channel-message', {
      channelId: currentChat._id,
      channelMessageId: channelMessageId,
    });
  }

  // ye hai ki message kaisa dikhega
  const renderMessages = () => {
    let lastDate = null;
    // console.log(chatMessages)

    // TODO: live typing, unread messages

    return (
      <>
        {chatMessages.length > 0 ? chatMessages.map((message, index) => {
          const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
          const showDate = messageDate !== lastDate;
          lastDate = messageDate;

          return (
            <div key={index}>
              {showDate && (
                <div className="text-center text-gray-500 my-2">
                  {moment(message.timestamp).format("LL")}
                </div>
              )}
              {chatType === "contact" && renderDMMessages(message)}
              {chatType === "channel" && renderChannelMessages(message)}
            </div>
          );
        }) :
          <div className="text-gray-500 text-center mt-4">
            No messages yet. Start the conversation!
          </div>
        }
        {isSendingMessage && <div className="text-blue-500 text-right">Sending message...</div>}
      </>
    );
  };

  // dm ke liye
  function renderDMMessages(message) {
    const isCurrentUser = message.sender === user._id;

    return (
      <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
        <div className={`max-w-[80%] ${isCurrentUser ? "text-right" : "text-left"}`}>
          {/* Text Messages */}
          {message.messageType === "text" && (
            <div
              className={`relative group inline-block p-4 rounded-xl my-1 break-words shadow-lg ${isCurrentUser
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none"
                : "bg-gray-700 text-white rounded-bl-none"
                }`}
            >
              {/* Delete Button for text*/}
              {message.sender !== user._id ? null : deletingDmMessageId.includes(message._id) ?
                <div className="h-5 w-5 border-2 border-white border-t-red-500 rounded-full animate-spin absolute -top-2 -right-2 bg-red-500" />
                :
                <button
                  onClick={() => handleDirectMessageDelete(message._id)}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300
                         bg-red-500 hover:bg-red-600 p-1.5 rounded-full shadow-lg transform hover:scale-110"
                  title="Delete message"
                >
                  <IoCloseSharp className="h-3 w-3 text-white" />
                </button>
              }
              <p className="text-gray-100">{message.content}</p>
            </div>
          )}

          {/* File Messages */}
          {message.messageType === "file" && (
            <div
              className={`relative group inline-block rounded-xl my-1 border ${isCurrentUser
                ? "border-purple-500/30 bg-gray-800 rounded-br-none"
                : "border-gray-600 bg-gray-800 rounded-bl-none"
                }`}
            >
              {/* Delete Button for files */}
              {message.sender !== user._id ? null : deletingDmMessageId.includes(message._id) ?
                <div className="h-5 w-5 border-2 border-white border-t-red-500 rounded-full animate-spin absolute -top-2 -right-2 bg-red-500" />
                :
                <button
                  onClick={() => handleDirectMessageDelete(message._id)}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300
                         bg-red-500 hover:bg-red-600 p-1.5 rounded-full shadow-lg transform hover:scale-110"
                  title="Delete message"
                >
                  <IoCloseSharp className="h-3 w-3 text-white" />
                </button>
              }

              {checkIfImage(message.fileURL) ? (
                <div onClick={() => handleImageClick(message.fileURL)} className='cursor-pointer'>
                  <img
                    className="max-h-80 w-auto rounded-md object-cover transition-transform duration-300"
                    src={`${import.meta.env.VITE_HOST}/${message.fileURL}`}
                    alt="img"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 p-3">
                  <div className="flex items-center gap-3">
                    <GrDocumentZip className={isCurrentUser ? "text-purple-400" : "text-gray-400"} size={24} />
                    <span className={isCurrentUser ? "text-purple-100" : "text-gray-200"}>
                      {message.fileURL.split("/").pop()}
                    </span>
                  </div>
                  {!isDownloading ? (
                    <button
                      onClick={() => dispatch(downloadFileAsync(message.fileURL))}
                      className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-all duration-300"
                    >
                      <IoMdArrowRoundDown className={isCurrentUser ? "text-purple-400" : "text-gray-400"} />
                    </button>
                  ) : <IoMdArrowRoundDown className={`animate-bounce ${isCurrentUser ? "text-purple-400" : "text-gray-400"} text-xl`} />
                  }
                </div>
              )}
            </div>
          )}

          <div className={`text-xs mt-1 px-1 ${isCurrentUser ? "text-gray-400" : "text-gray-500"}`}>
            {moment(message.timestamp).format("hh:mm A")}
            <span className="ml-1 text-blue-400">✓</span>
            {/* TODO: blue-tick */}
            {/* {message.isRead && isCurrentUser && (
              <span className="ml-1 text-blue-400">✓✓</span>
            )} */}
          </div>
        </div>
      </div>
    );
  }

  // channel message ke liye
  function renderChannelMessages(message) {
    const isCurrentUser = user._id === message.sender._id;
    const isAdmin = user._id === currentChat.admin._id;

    return (
      <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
        {!isCurrentUser && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-600">
              {message.sender.profileImage ? (
                <img
                  src={`${import.meta.env.VITE_HOST}/${message.sender.profileImage}`}
                  alt={message.sender.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {message.sender.profileImage ? (
                    <AvatarImage
                      className="object-cover w-full h-full bg-black"
                      src={`${import.meta.env.VITE_HOST}/${message.sender.profileImage}`}
                      alt="profile"
                    />
                  ) : (
                    <div className={`uppercase h-10 w-10 text-xl flex items-center justify-center ${colors[message.sender.color]} rounded-full`}>
                      {message.sender.fullName.split('')[0]}
                    </div>
                  )}
                </Avatar>
              )}
            </div>
          </div>
        )}

        <div className={`max-w-[80%] ${isCurrentUser ? "text-right" : "text-left"}`}>
          {!isCurrentUser && (
            <div className="text-sm mb-1">
              <span className="text-gray-200 font-medium">{message.sender.fullName}</span>
              <span className="text-gray-400 ml-2">@{message.sender.username}</span>
            </div>
          )}

          {message.isDeleted ? (
            <div className="inline-block px-3 py-2 bg-gray-800/50 text-gray-400 rounded-lg italic">
              Message deleted by admin
            </div>
          ) : message.messageType === "text" ? (
            <div
              className={`relative group inline-block p-4 rounded-xl my-1 break-words shadow-lg ${isCurrentUser
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none"
                : "bg-gray-700 text-white rounded-bl-none"
                }`}
            >
              {(isCurrentUser || isAdmin) && (
                <button
                  onClick={() => handleChannelMessageDelete(message._id, (isAdmin && !isCurrentUser))}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300
                          bg-red-500 hover:bg-red-600 p-1.5 rounded-full shadow-lg transform hover:scale-110"
                  title="Delete message"
                >
                  <IoCloseSharp className="h-3 w-3 text-white" />
                </button>
              )}
              <p className="text-gray-100">{message.content}</p>
            </div>
          ) : (
            <div
              className={`relative group inline-block rounded-xl my-1 border ${isCurrentUser
                ? "border-purple-500/30 bg-gray-800 rounded-br-none"
                : "border-gray-600 bg-gray-800 rounded-bl-none"
                }`}
            >
              {(isCurrentUser || isAdmin) && (
                <button
                  onClick={() => handleChannelMessageDelete(message._id, (isAdmin && !isCurrentUser))}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300
                          bg-red-500 hover:bg-red-600 p-1.5 rounded-full shadow-lg transform hover:scale-110 z-10"
                  title="Delete message"
                >
                  <IoCloseSharp className="h-3 w-3 text-white" />
                </button>
              )}

              {checkIfImage(message.fileURL) ? (
                <div onClick={() => handleImageClick(message.fileURL)} className='cursor-pointer'>
                  <img
                    className="max-h-80 w-auto rounded-md object-cover transition-transform duration-300"
                    src={`${import.meta.env.VITE_HOST}/${message.fileURL}`}
                    alt="img"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 p-3">
                  <div className="flex items-center gap-3">
                    <GrDocumentZip className={isCurrentUser ? "text-purple-400" : "text-gray-400"} size={24} />
                    <span className="text-gray-200">{message.fileURL.split("/").pop()}</span>
                  </div>
                  {!isDownloading ? (
                    <button
                      onClick={() => dispatch(downloadFileAsync(message.fileURL))}
                      className="bg-gray-700 hover:bg-gray-600 p-2 rounded-full transition-all duration-300"
                    >
                      <IoMdArrowRoundDown className={isCurrentUser ? "text-purple-400" : "text-gray-400"} />
                    </button>
                  ) :
                    <IoMdArrowRoundDown className={`animate-bounce ${isCurrentUser ? "text-purple-400" : "text-gray-400"} text-xl`} />
                  }
                </div>
              )}
            </div>
          )}

          <div className={`text-xs mt-1 px-1 ${isCurrentUser ? "text-gray-400" : "text-gray-500"}`}>
            {moment(message.timestamp).format("hh:mm A")}
            {message.isRead && isCurrentUser && (
              <span className="ml-1 text-blue-400">✓✓</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 md:px-8 px-4 bg-gradient-to-b from-gray-900 to-gray-800 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent relative">
      {isGettingMessages ? (
        <div className="flex flex-col items-center justify-center h-[60vh] select-none">
          <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="text-lg text-indigo-300 font-semibold tracking-wide animate-pulse">Fetching messages...</span>
        </div>
      ) : renderMessages()}

      {/* Image Preview Modal */}
      {showImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <div className="relative max-w-full max-h-[90vh] flex justify-center">
            <img
              src={`${import.meta.env.VITE_HOST}/${filePath}`}
              alt="Preview"
              className="max-h-[80vh] rounded-lg shadow-2xl object-contain border border-gray-700/50"
            />
          </div>
          <div className="fixed bottom-8 flex gap-4">
            <button
              className="bg-indigo-600/90 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
              onClick={() => dispatch(downloadFileAsync(filePath))}
            >
              <IoMdArrowRoundDown className="text-xl" />
            </button>
            <button
              className="bg-red-600/90 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
              onClick={() => {
                setShowImage(false);
                setFilePath(null);
              }}
            >
              <IoCloseSharp className="text-xl" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Progress Indicator */}
      {isUploading && (
        <div className="bg-gray-800/90 float-right backdrop-blur-sm px-4 py-2 rounded-full shadow-xl border border-gray-700 flex items-center gap-2">
          <GrUpload className="text-blue-400 animate-pulse" />
          <span className="text-sm text-gray-200">
            Uploading <span className="font-medium text-blue-400">{FileUploadProgress}%</span>
          </span>
        </div>
      )}

      <div className='absolute bottom-0' ref={scrollRef} />
    </div>
  )
}

export default MessageContainer