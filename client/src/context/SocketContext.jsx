import { createContext, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { selectCurrentChat, setChatMessages, selectChatType, setDeleteDirectMessage, setDeleteChannelMessageByAdmin, setDeleteChannelMessage, getDmContactListAsync, getChannelsAsync, setChatType, setCurrentChat, getChannelMembersAsync } from "../features/chat/chatSlice";
import { useGetLoggedInUserQuery } from "../features/auth/authAPI";
import { setDeletingDmMessageId, setIsSendingMessage, setOnlineUsers } from "./socketSlice";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const dispatch = useDispatch();

    // Why use useRef()?
    // -> useRef() doesn't cause a re-render when updated. 
    // -> You want to persist the socket connection across renders without triggering re-renders.
    // -> It acts like a box where you store a value (socket.current = io(...)) and reuse it anywhere.

    const { data: user, isLoading: isGettingLoggedInUser } = useGetLoggedInUserQuery();
    const currentChat = useSelector(selectCurrentChat);
    const chatType = useSelector(selectChatType);

    const currentChatRef = useRef();
    const chatTypeRef = useRef();
    // Why This Happens (stale state issue)?
    // -> The useEffect hook runs after the component mounts, and it sets up the Socket.IO connection and event listeners.
    // -> If the currentChat state is updated in the Redux store after the useEffect runs, the event listener for receiveMessage captures the initial value of currentChat (likely null or undefined).
    // -> Since event listeners are set up only once in the useEffect, they won't automatically update to reflect changes to currentChat unless you explicitly handle this.
    useEffect(() => {
        currentChatRef.current = currentChat;
        chatTypeRef.current = chatType;
    }, [currentChat]);



    useEffect(() => {
        if (user) {
            socket.current = io(import.meta.env.VITE_HOST, {
                withCredentials: true,
                query: {
                    userId: user._id,
                }
            })

            socket.current.on("connect", () => {
                // console.log("connected to socket server", socket.current.id);
                console.log("connected to socket server");
            });

            socket.current.on('online-users', (onlineUserIds) => {
                dispatch(setOnlineUsers(onlineUserIds));
            });

            socket.current.on('receiveMessage', (message) => {
                // console.log("Received message:", message);
                if (currentChatRef.current && (currentChatRef.current._id === message.sender._id || currentChatRef.current._id === message.receiver._id)) {
                    // console.log("Received message for selected contact:", message);
                    { chatTypeRef.current === "contact" && dispatch(setChatMessages(message)); }
                    dispatch(setIsSendingMessage(false));
                }
                if (chatTypeRef.current === null) {
                    dispatch(getDmContactListAsync());
                }
            });

            socket.current.on("receive-channel-message", (message) => {
                if (currentChatRef.current && currentChatRef.current._id === message.channelId) {
                    // console.log("receiving channel message: ", message);
                    { chatTypeRef.current === "channel" && dispatch(setChatMessages(message)); }
                }
            })

            socket.current.on('direct-message-deleted', ({ messageId }) => {
                dispatch(setDeleteDirectMessage({ messageId }));
                dispatch(setDeletingDmMessageId({ messageId, deleted: true }));
            });

            socket.current.on('channel-message-deleted', ({ channelMessageId }) => {
                dispatch(setDeleteChannelMessage({ channelMessageId }));
            });

            socket.current.on('channel-message-deleted-by-admin', (deletedChannelMessageByAdmin) => {
                dispatch(setDeleteChannelMessageByAdmin(deletedChannelMessageByAdmin));
            });

            socket.current.on('channel-created', (channel) => {
                // console.log("Channel created:", channel);
                dispatch(getChannelsAsync());
            });

            socket.current.on('member-removed', (channelId) => {
                dispatch(getChannelsAsync());
                if (chatTypeRef.current === "channel" && currentChatRef.current?._id === channelId) {
                    dispatch(setCurrentChat(null));
                    dispatch(setChatType(null));
                }
            })

            socket.current.on('member-added', (channelId) => {
                dispatch(getChannelsAsync());
            });


            socket.current.on('channel-updated', (channel) => {
                dispatch(getChannelsAsync());
                if (chatTypeRef.current === "channel" && currentChatRef.current?._id === channel._id) {
                    dispatch(setCurrentChat(channel));
                }
            })

            socket.current.on('channel-deleted', (channelId) => {
                dispatch(getChannelsAsync());
                if (chatTypeRef.current === "channel" && currentChatRef.current?._id === channelId) {
                    dispatch(setCurrentChat(null));
                    dispatch(setChatType(null));
                }
            })

            socket.current.on('leave-channel', (channelId) => {
                if (chatTypeRef.current === "channel" && currentChatRef.current?._id === channelId) {
                    dispatch(getChannelMembersAsync({ channelId }));
                }
            })
        }
        return () => {
            if (socket.current) {
                socket.current.disconnect();
                console.log("Socket disconnected");
            }
        };
    }, [user]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
}