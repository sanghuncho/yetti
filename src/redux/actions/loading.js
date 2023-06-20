import { createSlice } from "@reduxjs/toolkit";

export const loadingSlice = createSlice({
    name: 'loading',
    initialState: { isLoading: false },
    reducers:{
        startLoading: (state) => {
            state.isLoading = true;
        }, 
        endLoading: (state) => {
            state.isLoading = false;
        }
    }
})

export const { startLoading, endLoading } = loadingSlice.actions;
export default loadingSlice.reducer;