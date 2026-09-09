import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as adminService from "./adminService";

// Dashboard Thunks

export const fetchDashboardStats = createAsyncThunk(
    "admin/fetchDashboardStats",
    async (_, thunkAPI) => {
        try {
            return await adminService.dashboardStats();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchOverviewStats = createAsyncThunk(
    "admin/fetchOverviewStats",
    async (_, thunkAPI) => {
        try {
            return await adminService.adminOverviewStats();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchRevenueStats = createAsyncThunk(
    "admin/fetchRevenueStats",
    async (_, thunkAPI) => {
        try {
            return await adminService.adminRevenueStats();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchTopUsers = createAsyncThunk(
    "admin/fetchTopUsers",
    async (_, thunkAPI) => {
        try {
            return await adminService.adminTopUsers();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchAllUsers = createAsyncThunk(
    "admin/fetchAllUsers",
    async (_, thunkAPI) => {
        try {
            return await adminService.adminAllUsers();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const loadFullAdminDashboard = createAsyncThunk(
    "admin/loadFullAdminDashboard",
    async (_, { dispatch }) => {
        await Promise.allSettled([
            dispatch(fetchDashboardStats()),
            dispatch(fetchOverviewStats()),
            dispatch(fetchRevenueStats()),
            dispatch(fetchTopUsers()),
            dispatch(fetchAllUsers()),
            dispatch(fetchPendingKYC()),
        ]);
    }
);

export const reverseTransactionAction = createAsyncThunk(
    "admin/reverseTransaction",
    async (reference, thunkAPI) => {
        try {
            const result = await adminService.adminReverseTransfer(reference);
            thunkAPI.dispatch(fetchDashboardStats());
            thunkAPI.dispatch(fetchOverviewStats());
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// KYC Thunks

export const fetchPendingKYC = createAsyncThunk(
    "admin/fetchPendingKYC",
    async (_, thunkAPI) => {
        try {
            return await adminService.adminGetPendingKYC();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const approveKYCAction = createAsyncThunk(
    "admin/approveKYC",
    async (userId, thunkAPI) => {
        try {
            const result = await adminService.adminApproveKYC(userId);
            thunkAPI.dispatch(fetchPendingKYC());
            return { ...result, userId };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const rejectKYCAction = createAsyncThunk(
    "admin/rejectKYC",
    async ({ userId, reason }, thunkAPI) => {
        try {
            const result = await adminService.adminRejectKYC(userId, reason);
            thunkAPI.dispatch(fetchPendingKYC());
            return { ...result, userId };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Toggle Freeze / Unfreeze user account
export const toggleFreezeUserAction = createAsyncThunk(
    "admin/toggleFreezeUser",
    async (userId, thunkAPI) => {
        try {
            const result = await adminService.adminToggleFreezeUser(userId);
            return result;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Slice

const initialState = {
    dashboardStats: null,
    overviewStats: null,
    revenueStats: null,
    topUsers: [],
    allUsers: [],
    pendingKYC: [],
    kycLoading: false,
    kycActionLoading: false,
    freezingUserId: null,
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
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.dashboardStats = action.payload;
            })
            .addCase(fetchOverviewStats.fulfilled, (state, action) => {
                state.overviewStats = action.payload;
            })
            .addCase(fetchRevenueStats.fulfilled, (state, action) => {
                state.revenueStats = action.payload;
            })
            .addCase(fetchTopUsers.fulfilled, (state, action) => {
                state.topUsers = action.payload;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.allUsers = action.payload;
            })
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
            })
            .addCase(fetchPendingKYC.pending, (state) => {
                state.kycLoading = true;
            })
            .addCase(fetchPendingKYC.fulfilled, (state, action) => {
                state.kycLoading = false;
                state.pendingKYC = Array.isArray(action.payload)
                    ? action.payload
                    : Array.isArray(action.payload?.data)
                    ? action.payload.data
                    : [];
            })
            .addCase(fetchPendingKYC.rejected, (state) => {
                state.kycLoading = false;
            })
            .addCase(approveKYCAction.pending, (state) => {
                state.kycActionLoading = true;
                state.actionError = null;
                state.actionSuccess = null;
            })
            .addCase(approveKYCAction.fulfilled, (state, action) => {
                state.kycActionLoading = false;
                state.actionSuccess = "KYC approved successfully";
                state.pendingKYC = state.pendingKYC.filter((u) => u._id !== action.payload.userId);
            })
            .addCase(approveKYCAction.rejected, (state, action) => {
                state.kycActionLoading = false;
                state.actionError = action.payload || "Failed to approve KYC";
            })
            .addCase(rejectKYCAction.pending, (state) => {
                state.kycActionLoading = true;
                state.actionError = null;
                state.actionSuccess = null;
            })
            .addCase(rejectKYCAction.fulfilled, (state, action) => {
                state.kycActionLoading = false;
                state.actionSuccess = "KYC rejected";
                state.pendingKYC = state.pendingKYC.filter((u) => u._id !== action.payload.userId);
            })
            .addCase(rejectKYCAction.rejected, (state, action) => {
                state.kycActionLoading = false;
                state.actionError = action.payload || "Failed to reject KYC";
            })

            // ── Toggle Freeze / Unfreeze User ────────────────────────────────
            .addCase(toggleFreezeUserAction.pending, (state, action) => {
                state.freezingUserId = action.meta.arg;
            })
            .addCase(toggleFreezeUserAction.fulfilled, (state, action) => {
                state.freezingUserId = null;
                const { userId, isFrozen } = action.payload;
                state.allUsers = state.allUsers.map((u) =>
                    u._id === userId ? { ...u, isFrozen } : u
                );
            })
            .addCase(toggleFreezeUserAction.rejected, (state, action) => {
                state.freezingUserId = null;
                state.actionError = action.payload || "Failed to update account restriction";
            });
    },
});

export const { clearAdminErrors, clearAdminSuccess } = adminSlice.actions;
export default adminSlice.reducer;
