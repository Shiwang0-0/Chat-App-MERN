import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/configServer";

const api=createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({
        baseUrl:`${server}/api/v1`,
        tagsTypes:["chat","user","message"]
    }),
    endpoints:(builder)=>({

        myChats:builder.query({
            query:()=>({
                url:"/chat/mychat",
                credentials:"include"
            }),
            providesTags:["chat"]
        }),

        searchUser:builder.query({
            query:(name)=>({
                url:`/user/search?name=${name}`,
                credentials:"include"
            }),
            providesTags:["user"]
        }),

        sendFriendRequest:builder.mutation({
            query:(data)=>({
                url:`/user/request`,
                method:"POST",
                credentials:"include",
                body:data,
            }),
            invalidatesTags:["user"]    
        }),

        getNotifications:builder.query({
            query:()=>({
                url:`/user/notifications`,
                credentials:"include"
            }),
            keepUnusedDataFor:0
        }),

        acceptFriendRequest:builder.mutation({
            query:(data)=>({
                url:`/user/handlerequest`,
                method:"POST",
                credentials:"include",
                body:data,
            }),
            invalidatesTags:["chat"]    
        }),

        chatDetails:builder.query({
            query:({chatId,populate=false})=>{
                
                let url=`/chat/${chatId}`
                if(populate)
                    url+="/populate=true"
                    
                return {
                    url,
                    credentials:"include"
                }
                
            },
            providesTags:["chat"]
        }),

        getMessage:builder.query({
            query:({chatId,page})=>({
                url:`chat/message/${chatId}?page=${page}`,
                credentials:"include"
            }),
            providesTags:["message"]
        })



    })
    

});


export default api;
export const {useMyChatsQuery,useLazySearchUserQuery,useSendFriendRequestMutation,useGetNotificationsQuery,useAcceptFriendRequestMutation,useChatDetailsQuery,useGetMessageQuery} = api;