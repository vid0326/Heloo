// TODO: 
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import { setFileDownloadProgress, setFileUploadProgress } from './chatSlice'; // We'll use this for progress

const baseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_HOST}/`,
    credentials: 'include',
});

// This is the custom query function for handling file uploads/downloads with progress
const axiosBaseQuery = () => async ({ url, method, data, params, responseType }, { dispatch }) => {
    try {
        const result = await axios({
            url: `${import.meta.env.VITE_HOST}${url}`,
            method,
            data,
            params,
            responseType,
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
                if (url.includes('uploadFile') && progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    dispatch(setFileUploadProgress(percentCompleted));
                }
            },
            onDownloadProgress: (progressEvent) => {
                if (responseType === 'blob' && progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    dispatch(setFileDownloadProgress(percentCompleted));
                }
            },
        });
        return { data: result.data };
    } catch (axiosError) {
        return {
            error: { status: axiosError.response?.status, data: axiosError.response?.data },
        };
    }
};

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery, // Use fetchBaseQuery for most endpoints
    tagTypes: ['Channels', 'ChannelMembers', 'Messages', 'DmContacts', 'Contacts'],
    endpoints: (builder) => ({
        // QUERIES (Reading Data)
        getChannels: builder.query({
            query: () => 'channels',
            transformResponse: (response) => response.channels,
            providesTags: (result = []) => [
                ...result.map(({ _id }) => ({ type: 'Channels', id: _id })),
                { type: 'Channels', id: 'LIST' },
            ],
        }),
        getDmContactList: builder.query({
            query: () => 'contacts/getdmcontacts',
            transformResponse: (response) => response.contacts,
            providesTags: ['DmContacts'],
        }),
        getMessages: builder.query({
            query: ({ senderId, receiverId }) => `messages?senderId=${senderId}&receiverId=${receiverId}`,
            providesTags: (result, error, { receiverId }) => [{ type: 'Messages', id: receiverId }],
        }),
        getChannelMessages: builder.query({
            query: (channelId) => `channels/messages/${channelId}`,
            transformResponse: (response) => response.channelMessages,
            providesTags: (result, error, channelId) => [{ type: 'Messages', id: channelId }],
        }),
        getChannelMembers: builder.query({
            query: (channelId) => `channels/members/${channelId}`,
            transformResponse: (response) => response.members,
            providesTags: (result, error, channelId) => [{ type: 'ChannelMembers', id: channelId }],
        }),
        searchContacts: builder.query({
            query: (searchQuery) => ({
                url: 'contacts/search',
                method: 'POST',
                body: searchQuery,
            }),
            transformResponse: (response) => response.contacts,
            providesTags: ['Contacts'],
        }),
        downloadFile: builder.query({
            queryFn: async (filePath, api) => {
                const result = await axiosBaseQuery()(
                    { url: `/${filePath}`, method: 'GET', responseType: 'blob' },
                    api
                );
                // Handle the download link creation after getting the blob
                if (result.data) {
                    const blob = result.data;
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filePath.split('/').pop();
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    return { data: { success: true } };
                }
                return { error: result.error };
            },
        }),

        // MUTATIONS (Changing Data)
        createChannel: builder.mutation({
            query: ({ name, members }) => ({
                url: 'channels/create',
                method: 'POST',
                body: { name, members },
            }),
            invalidatesTags: [{ type: 'Channels', id: 'LIST' }],
        }),
        updateChannelProfile: builder.mutation({
            query: ({ channelId, ...patch }) => ({
                url: `channels/channel-profile/${channelId}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { channelId }) => [{ type: 'Channels', id: channelId }, { type: 'Channels', id: 'LIST' }],
        }),
        updateChannelProfileImage: builder.mutation({
            query: ({ channelId, formData }) => ({
                url: `channels/channel-image/${channelId}`,
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: (result, error, { channelId }) => [{ type: 'Channels', id: channelId }, { type: 'Channels', id: 'LIST' }],
        }),
        deleteChannelProfileImage: builder.mutation({
            query: (channelId) => ({
                url: `channels/channel-image/${channelId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, channelId) => [{ type: 'Channels', id: channelId }, { type: 'Channels', id: 'LIST' }],
        }),
        addMembers: builder.mutation({
            query: ({ channelId, members }) => ({
                url: 'channels/add-members',
                method: 'POST',
                body: { channelId, members },
            }),
            invalidatesTags: (result, error, { channelId }) => [{ type: 'ChannelMembers', id: channelId }],
        }),
        removeMember: builder.mutation({
            query: ({ channelId, memberId }) => ({
                url: 'channels/remove-member',
                method: 'POST',
                body: { channelId, memberId },
            }),
            invalidatesTags: (result, error, { channelId }) => [{ type: 'ChannelMembers', id: channelId }],
        }),
        leaveChannel: builder.mutation({
            query: ({ channelId, memberId }) => ({
                url: 'channels/leave-channel',
                method: 'POST',
                body: { channelId, memberId },
            }),
            invalidatesTags: [{ type: 'Channels', id: 'LIST' }],
        }),
        deleteChannel: builder.mutation({
            query: (channelId) => ({
                url: `channels/delete/${channelId}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Channels', id: 'LIST' }],
        }),
        uploadFile: builder.mutation({
            queryFn: async ({ formData }, api) => {
                const result = await axiosBaseQuery()(
                    { url: '/messages/uploadFile', method: 'POST', data: formData },
                    api
                );
                return result;
            },
        }),
    }),
});

export const {
    useGetChannelsQuery,
    useGetDmContactListQuery,
    useGetMessagesQuery,
    useGetChannelMessagesQuery,
    useGetChannelMembersQuery,
    useSearchContactsQuery,
    useDownloadFileQuery,
    useCreateChannelMutation,
    useUpdateChannelProfileMutation,
    useUpdateChannelProfileImageMutation,
    useDeleteChannelProfileImageMutation,
    useAddMembersMutation,
    useRemoveMemberMutation,
    useLeaveChannelMutation,
    useDeleteChannelMutation,
    useUploadFileMutation,
    useLazyDownloadFileQuery,
} = chatApi;