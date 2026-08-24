import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    success: false,
    transaction: null,
    message: "",
    error: null,
};

const airtimeSlice = createSlice({
    name: "airtime",

    initialState,

    reducers: {
        airtimeStart: (state) => {
            state.loading = true;
            state.success = false;
            state.message = "";
            state.error = null;
        },

        airtimeSuccess: (state, action) => {
            state.loading = false;
            state.success = true;
            state.transaction = action.payload?.data;
            state.message =
                action.payload?.message ||
                "Airtime purchase successful";
            state.error = null;
        },

        airtimeFailure: (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload;
        },

        resetAirtime: (state) => {
            state.loading = false;
            state.success = false;
            state.transaction = null;
            state.message = "";
            state.error = null;
        },
    },
});

export const {
    airtimeStart,
    airtimeSuccess,
    airtimeFailure,
    resetAirtime,
} = airtimeSlice.actions;

export default airtimeSlice.reducer;