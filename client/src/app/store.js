import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authAPI';
import chatReducer from '../features/chat/chatSlice';
import { chatApi } from '../features/chat/chatApi2';
import socketReducer from '../context/socketSlice';

export default configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        chat: chatReducer,
        socket: socketReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, chatApi.middleware),
});