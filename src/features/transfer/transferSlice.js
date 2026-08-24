import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    loading: false,

    success: false,

    transfer: null,

    error: null,

    message: "",

};

const transferSlice = createSlice({

    name: "transfer",

    initialState,

    reducers: {

        transferStart: (state) => {

            state.loading = true;

            state.success = false;

            state.error = null;

        },

        transferSuccess: (state, action) => {

            state.loading = false;

            state.success = true;

            state.transfer = action.payload;
            state.message = action.payload?.message;

        },

        transferFailure: (state, action) => {

            state.loading = false;

            state.success = false;

            state.error = action.payload;

        },

        resetTransfer: (state) => {

            state.loading = false;

            state.success = false;

            state.transfer = null;

            state.error = null;

        },

    },

});

export const {

    transferStart,

    transferSuccess,

    transferFailure,

    resetTransfer,

} = transferSlice.actions;

export default transferSlice.reducer;