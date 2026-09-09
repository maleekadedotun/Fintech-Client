import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as kycAPI from "./kycAPI";

export const submitKYCAction = createAsyncThunk(
    "kyc/submitKYC",
    async ({ idType, idNumber }, thunkAPI) => {
        try {
            const data = await kycAPI.submitKYC({ idType, idNumber });
            // Refresh profile
            thunkAPI.dispatch(fetchMyKYCStatus());
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const fetchMyKYCStatus = createAsyncThunk(
    "kyc/fetchMyKYCStatus",
    async (_, thunkAPI) => {
        try {
            const response = await kycAPI.getMyKYCStatus();
            const userData = response.data || response;

            // Sync with localStorage
            const storedUser = JSON.parse(localStorage.getItem("user")) || {};
            const updatedUser = {
                ...storedUser,
                tier: userData.tier,
                kycStatus: userData.kycStatus,
                idType: userData.idType,
                idNumber: userData.idNumber,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            return userData;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

const initialState = {
    kycStatus: null,
    tier: 1,
    idType: null,
    idNumber: null,
    loading: false,
    submitting: false,
    error: null,
    successMessage: null,
};

const kycSlice = createSlice({
    name: "kyc",
    initialState,
    reducers: {
        clearKycState(state) {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Submit KYC
            .addCase(submitKYCAction.pending, (state) => {
                state.submitting = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(submitKYCAction.fulfilled, (state, action) => {
                state.submitting = false;
                state.kycStatus = "pending";
                state.successMessage = action.payload?.message || "KYC submitted successfully. Awaiting admin review.";
            })
            .addCase(submitKYCAction.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload || "Failed to submit KYC";
            })

            // Fetch Status
            .addCase(fetchMyKYCStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyKYCStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.kycStatus = action.payload.kycStatus;
                state.tier = action.payload.tier;
                state.idType = action.payload.idType;
                state.idNumber = action.payload.idNumber;
            })
            .addCase(fetchMyKYCStatus.rejected, (state, action) => {
                state.loading = false;
            });
    },
});

export const { clearKycState } = kycSlice.actions;
export default kycSlice.reducer;
