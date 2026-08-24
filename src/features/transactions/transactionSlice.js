import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { getTransactions } from "./transactionService";
import { getTransactions } from "../../features/transactions/transactionService";

export const fetchTransactions = createAsyncThunk(
    "transactions/fetchTransactions",
    async (_, thunkAPI) => {
        try {
            return await getTransactions();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

const transactionSlice = createSlice({
    name: "transactions",

    initialState: {
        transactions: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: builder => {

        builder

            .addCase(fetchTransactions.pending, state => {
                state.loading = true;
            })

            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;

                state.transactions =
                    action.payload.transactions ||
                    action.payload.data ||
                    action.payload;
            })

            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default transactionSlice.reducer;