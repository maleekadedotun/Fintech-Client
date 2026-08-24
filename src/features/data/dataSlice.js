import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { buyData } from "./dataService";


// ================= BUY DATA =================

export const purchaseData = createAsyncThunk(
    "data/purchaseData",

    async (
        {
            phoneNumber,
            networkId,
            planId,
            pin,
        },
        thunkAPI
    ) => {

        try {

            const response = await buyData({
                phoneNumber,
                networkId,
                planId,
                pin,
            });

            return response;

        } catch (error) {

            // return thunkAPI.rejectWithValue(
            //     error.response?.data || {
            //         message:
            //             error.message ||
            //             "Data purchase failed",
            //     }
            // );

            console.log(
                "DATA PURCHASE BACKEND ERROR:",
                error.response?.data
            );

            return isRejectedWithValue(
                error.response?.data ||
                "Data purchase failed"
            );

        }

    }
);


// ================= INITIAL STATE =================

const initialState = {

    loading: false,

    success: false,

    transaction: null,

    reference: null,

    message: "",

    error: null,

    provider: null,

};


// ================= SLICE =================

const dataSlice = createSlice({

    name: "data",

    initialState,

    reducers: {

        resetData: (state) => {

            state.loading = false;

            state.success = false;

            state.transaction = null;

            state.reference = null;

            state.message = "";

            state.error = null;

            state.provider = null;

        },

    },

    extraReducers: (builder) => {

        builder

            // ================= PENDING =================

            .addCase(
                purchaseData.pending,
                (state) => {

                    state.loading = true;

                    state.success = false;

                    state.message = "";

                    state.error = null;

                    state.provider = null;

                }
            )


            // ================= SUCCESS =================

            .addCase(
                purchaseData.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.success = true;

                    state.error = null;

                    state.message =
                        action.payload?.message ||
                        "Data purchase successful";

                    state.transaction =
                        action.payload?.transaction ||
                        action.payload?.data ||
                        null;

                    state.reference =
                        action.payload?.reference ||
                        action.payload?.transaction?.reference ||
                        null;

                    state.provider =
                        action.payload?.provider ||
                        null;

                }
            )


            // ================= FAILED =================

            .addCase(
                purchaseData.rejected,
                (state, action) => {

                    state.loading = false;

                    state.success = false;

                    state.error =
                        action.payload?.message ||
                        "Data purchase failed";

                    state.message = "";

                    state.provider =
                        action.payload?.provider ||
                        null;

                }
            );

    },

});


export const {
    resetData,
} = dataSlice.actions;


export default dataSlice.reducer;