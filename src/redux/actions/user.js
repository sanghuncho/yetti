import { createSlice } from "@reduxjs/toolkit";
import { removeStorage } from "../../utils/storage";

export const userSlice = createSlice({
    name: 'user',
    initialState: { isLogin: false, value: {email: "", name: "", statusCode:""} },
    reducers:{
        login: (state, action) => {
            state.isLogin = true;
            state.value.email = action.payload.email;
            state.value.name = action.payload.name;
            state.value.statusCode = action.payload.statusCode;
        }, 
        logout: (state) => {
            state.isLogin = false;
            state.value = {email: "", name: "", statusCode:""};
        },
    }
})

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;