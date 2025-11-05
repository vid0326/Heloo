import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isSendingMessage: false,
    isDeletingDmMessage: false,
    isDeletingChannelMessage: false,
    deletingDmMessageId: [],
    onlineUsers: [],
    isOnline: false,
}

export const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setIsSendingMessage: (state, action) => {
            state.isSendingMessage = action.payload;
        },
        setIsDeletingDmMessage: (state, action) => {
            state.isDeletingDmMessage = action.payload;
        },
        setIsDeletingChannelMessage: (state, action) => {
            state.isDeletingChannelMessage = action.payload;
        },
        setDeletingDmMessageId: (state, action) => {
            if (action.payload.deleted) {
                state.deletingDmMessageId = state.deletingDmMessageId.filter(id => id !== action.payload.messageId);
                return;
            }
            state.deletingDmMessageId.push(action.payload.messageId);
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
    },
});

export const selectOnlineUsers = (state) => state.socket.onlineUsers;

export const selectIsSendingMessage = (state) => state.socket.isSendingMessage;
export const selectIsDeletingDmMessage = (state) => state.socket.isDeletingDmMessage;
export const selectIsDeletingChannelMessage = (state) => state.socket.isDeletingChannelMessage;
export const selectDeletingDmMessageId = (state) => state.socket.deletingDmMessageId;
export const selectDeletingChannelMessageId = (state) => state.socket.deletingChannelMessageId

export const { setIsSendingMessage, setIsDeletingDmMessage, setIsDeletingChannelMessage, setDeletingDmMessageId, setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer