import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/configServer";

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1`,
        tagsTypes: ["Chat", "User", "Message"]
    }),
    endpoints: (builder) => ({

        myChats: builder.query({
            query: () => ({
                url: "/chat/mychat",
                credentials: "include"
            }),
            providesTags: ["Chat"]
        }),

        searchUser: builder.query({
            query: (name) => ({
                url: `/user/search?name=${name}`,
                credentials: "include"
            }),
            providesTags: ["User"]
        }),

        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: `/user/request`,
                method: "POST",
                credentials: "include",
                body: data,
            }),
            invalidatesTags: ["User"]
        }),

        getNotifications: builder.query({
            query: () => ({
                url: `/user/notifications`,
                credentials: "include"
            }),
            keepUnusedDataFor: 0
        }),

        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: `/user/handlerequest`,
                method: "POST",
                credentials: "include",
                body: data,
            }),
            invalidatesTags: ["Chat"]
        }),

        chatDetails: builder.query({
            query: ({ chatId, populate = false }) => {

                let url = `/chat/${chatId}`
                if (populate)
                    url += "?populate=true"

                return {
                    url,
                    credentials: "include"
                }

            },
            providesTags: ["Chat"]
        }),

        getMessages:builder.query({
            query:({chatId,page})=>({
                url:`chat/message/${chatId}?page=${page}`,
                credentials:"include"
            }),
            keepUnusedDataFor: 0
        }),

        sendAttachments: builder.mutation({
            query: (data) => ({
                url: "/chat/message",
                method: "POST",
                credentials: "include",
                body: data,
            }),
        }),

        myGroups: builder.query({
            query: () => ({
                url: `/chat/mygroups`,
                credentials: "include"
            }),
            providesTags: ["Chat"]
        }),

        availableFriends: builder.query({
            query: (chatId) => {

                let url = `/user/friends`
                if (chatId)
                    url += `?chatId=${chatId}`

                return {
                    url,
                    credentials: "include"
                }

            },
            providesTags: ["Chat"]
        }),

        newGroup: builder.mutation({
            query: ({ name, members, avatar }) => ({
                url: `/chat/newgroup`,
                method: "POST",
                credentials: "include",
                body: { name, members, avatar },
            }),
            invalidatesTags: ["Chat"]
        }),

        renameGroup: builder.mutation({
            query: ({ chatId, name }) => ({
                url: `/chat/${chatId}`,
                method: "PUT",
                credentials: "include",
                body: { name },
            }),
            invalidatesTags: ["Chat"]
        }),

        addGroupMembers: builder.mutation({
            query: ({ chatId, members }) => ({
                url: `/chat/addmembers`,
                method: "PUT",
                credentials: "include",
                body: { chatId, members },
            }),
            invalidatesTags: ["Chat"]
        }),

        removeGroupMember: builder.mutation({
            query: ({ chatId, userId }) => ({
                url: `/chat/removemembers`,
                method: "PUT",
                credentials: "include",
                body: { chatId, userId },
            }),
            invalidatesTags: ["Chat"]
        }),

        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `/chat/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Chat"]
        }),

        leaveGroup: builder.mutation({
            query: (chatId) => ({
                url: `/chat/leave/${chatId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Chat"]
        }),
    })
});


export default api;
export const { useMyChatsQuery, useLazySearchUserQuery, useSendFriendRequestMutation, useGetNotificationsQuery, useAcceptFriendRequestMutation, useChatDetailsQuery, useGetMessagesQuery, useSendAttachmentsMutation, useMyGroupsQuery, useAvailableFriendsQuery, useNewGroupMutation, useRenameGroupMutation, useAddGroupMembersMutation, useRemoveGroupMemberMutation, useDeleteChatMutation, useLeaveGroupMutation } = api;