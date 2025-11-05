// src/features/auth/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define an API slice
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_HOST}/`,
        // The 'credentials: include' from your original fetch is handled here
        // for all endpoints.
        credentials: 'include',
    }),
    // 'User' tag is used for caching. Any mutation that affects the user's data
    // will invalidate this tag, causing queries that provide it to refetch.
    tagTypes: ['User'],
    endpoints: (builder) => ({
        // QUERY: Used for fetching data
        getLoggedInUser: builder.query({
            query: () => 'auth',
            // This query provides the 'User' tag.
            // If the cache with this tag is invalidated, this query will re-run.
            providesTags: ['User'],
        }),

        // MUTATIONS: Used for changing data on the server
        createUser: builder.mutation({
            query: (userData) => ({
                url: 'auth/register',
                method: 'POST',
                body: userData,
            }),
            // Invalidates the 'User' tag, triggering a refetch of getLoggedInUser
            invalidatesTags: ['User'],
        }),
        
        login: builder.mutation({
            query: (loginInfo) => ({
                url: 'auth/login',
                method: 'POST',
                body: loginInfo,
            }),
            invalidatesTags: ['User'],
        }),
        
        logout: builder.mutation({
            query: () => ({
                url: 'auth/logout',
                method: 'GET', // Or 'POST' depending on your backend
            }),
            invalidatesTags: ['User'],
        }),
        
        updateProfile: builder.mutation({
            query: (update) => ({
                url: 'profile', 
                method: 'PATCH', // PATCH is common for partial updates
                body: update,
            }),
            invalidatesTags: ['User'],
        }),
        
        updateProfileImage: builder.mutation({
            query: (formData) => ({
                url: 'profile/image',
                method: 'POST',
                // RTK Query automatically handles FormData and sets the correct headers
                body: formData,
            }),
            invalidatesTags: ['User'],
        }),

        deleteProfileImage: builder.mutation({
            query: () => ({
                url: 'profile/image',
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

// Export auto-generated hooks for use in components
export const {
    useGetLoggedInUserQuery,
    useCreateUserMutation,
    useLoginMutation,
    useLogoutMutation,
    useUpdateProfileMutation,
    useUpdateProfileImageMutation,
    useDeleteProfileImageMutation,
} = authApi;