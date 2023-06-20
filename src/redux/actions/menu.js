import { createSlice } from "@reduxjs/toolkit";

export const menuSlice = createSlice({
    name: 'menu',
    initialState: { value: {isOpen: true} },
    reducers:{
        menuOpen: (state) => {
            state.value.isOpen = true;
        }, 
        menuClose: (state) => {
            state.value.isOpen = false;
        },
    }
})

export const { menuOpen, menuClose } = menuSlice.actions;
export default menuSlice.reducer;