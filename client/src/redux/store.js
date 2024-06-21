import { configureStore } from "@reduxjs/toolkit";
import api from "./api/api";
import authSlice from "./reducers/auth";
import miscSlice from "./reducers/others.";


const store=configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,
        [miscSlice.name]:miscSlice.reducer,
        [api.reducerPath]:api.reducer
    },
    middleware:(defaultMid)=>[...defaultMid(),api.middleware]
})

export default store

