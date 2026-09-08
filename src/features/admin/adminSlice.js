import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as adminService from "./adminService";

// Fetch core dashboard metrics
export const fetchDashboardStats = createAsyncThunk(
    "admin/fetchDashboardStats",
    async (_, thunkAPI) => {
        try {
            return await adminService.dashboardStats();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// Fetch admin overview (transactions, credits/debits, KYC counts)
export const fetchOverviewStats = createAsyncThunk(
    "admin/fetchOverviewStats",
    async (_, thunkAPI) => {
        try {
            return await adminService.adminOverviewStats();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// Fetch revenue trends and breakdown
export const fetchRevenueStats = createAsyncThunk(
    "admin/fetchRevenueStats",
    async (_, thunkAPI) => {
        try {
            return await adminService.adminRevenueStats();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// Fetch top transacting users
export const fetchTopUsers = createAsyncThunk(
    "admin/fetchTopUsers",
    async (_, thunkAPI) => {
        try {
            return await adminService.adminTopUsers();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// Fetch all registered users
export const fetchAllUsers = createAsyncThunk(
    "admin/fetchAllUsers",
    async (_, thunkAPI) => {
        try {
            return await adminService.adminAllUsers();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

// Composite action: load full admin command center in parallel
export const loadFullAdminDashboard = createAsyncThunk(
    "admin/loadFullAdminDashboard",
    async (_, { dispatch }) => {
        await Promise.allSettled([
            dispatch(fetchDashboardStats()),
            dispatch(fetchOverviewStats()),
            dispatch(fetchRevenueStats()),
            dispatch(fetchTopUsers()),
            dispatch(fetchAllUsers()),
        ]);
    }
);

// Reverse a transfer transaction
export const reverseTransactionAction = createAsyncThunk(
    "admin/reverseTransaction",
    async (reference, thunkAPI) => {
        try {
            const result = await adminService.adminReverseTransfer(reference);
            // Refresh stats after successful reversal
            thunkAPI.dispatch(fetchDashboardStats());
            thunkAPI.dispatch(fetchOverviewStats());
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

const initialState = {
    dashboardStats: null,
    overviewStats: null,
    revenueStats: null,
    topUsers: [],
    allUsers: [],
    loading: false,
    reversing: false,
    error: null,
    actionError: null,
    actionSuccess: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearAdminErrors(state) {
            state.error = null;
            state.actionError = null;
        },
        clearAdminSuccess(state) {
            state.actionSuccess = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Composite dashboard load
            .addCase(loadFullAdminDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadFullAdminDashboard.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(loadFullAdminDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Dashboard stats
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.dashboardStats = action.payload;
            })

            // Overview stats
            .addCase(fetchOverviewStats.fulfilled, (state, action) => {
                state.overviewStats = action.payload;
            })

            // Revenue stats
            .addCase(fetchRevenueStats.fulfilled, (state, action) => {
                state.revenueStats = action.payload;
            })

            // Top users
            .addCase(fetchTopUsers.fulfilled, (state, action) => {
                state.topUsers = action.payload;
            })

            // All users
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload;
            })

            // Reverse Transaction
            .addCase(reverseTransactionAction.pending, (state) => {
                state.reversing = true;
                state.actionError = null;
                state.actionSuccess = null;
            })
            .addCase(reverseTransactionAction.fulfilled, (state, action) => {
                state.reversing = false;
                state.actionSuccess = action.payload?.message || "Transaction reversed successfully";
            })
            .addCase(reverseTransactionAction.rejected, (state, action) => {
                state.reversing = false;
                state.actionError = action.payload || "Failed to reverse transaction";
            });
    },
});

export const { clearAdminErrors, clearAdminSuccess } = adminSlice.actions;
export default adminSlice.reducer;
