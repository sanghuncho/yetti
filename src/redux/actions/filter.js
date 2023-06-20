import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
    name: 'filter',
    initialState: { value: {isOpen: false} },
    reducers:{
        filterOpen: (state) => {
            state.value.isOpen = true;
        }, 
        filterClose: (state) => {
            state.value.isOpen = false;
        }
    }
})

export const { filterOpen, filterClose } = filterSlice.actions;
export default filterSlice.reducer;