import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    loading: false,

    success: false,

    message: "",

    error: null,

};

const pinSlice = createSlice({

    name: "pin",

    initialState,

    reducers: {

        pinStart: (state) => {

            state.loading = true;
            state.success = false;
            state.message = "";
            state.error = null;

        },

        pinSuccess: (state, action) => {

            state.loading = false;
            state.success = true;
            state.message = action.payload.message;
            state.error = null;

        },

        pinFailure: (state, action) => {

            state.loading = false;
            state.success = false;
            state.error = action.payload;

        },

        resetPin: (state) => {

            state.loading = false;
            state.success = false;
            state.message = "";
            state.error = null;

        },

    },

});

export const {
    pinStart,
    pinSuccess,
    pinFailure,
    resetPin,
} = pinSlice.actions;

export default pinSlice.reducer;