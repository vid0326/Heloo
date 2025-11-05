// TODO:
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chatType: null,         // 'dm' or 'channel'
    currentChat: null,      // The full object of the current user or channel
    fileUploadProgress: 0,
    fileDownloadProgress: 0,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setChatType: (state, action) => {
            state.chatType = action.payload;
        },
        setFileUploadProgress: (state, action) => {
            state.fileUploadProgress = action.payload;
        },
        setFileDownloadProgress: (state, action) => {
            state.fileDownloadProgress = action.payload;
        },
    },
});

// Selectors for this slice
export const selectCurrentChat = (state) => state.chat.currentChat;
export const selectChatType = (state) => state.chat.chatType;
export const selectFileUploadProgress = (state) => state.chat.fileUploadProgress;
export const selectFileDownloadProgress = (state) => state.chat.fileDownloadProgress;

export const {
    setCurrentChat,
    setChatType,
    setFileUploadProgress,
    setFileDownloadProgress,
} = chatSlice.actions;

export default chatSlice.reducer;