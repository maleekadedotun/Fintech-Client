import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    buyInternet,
    verifyInternet,
    getInternetPlans,
    getInternetProviders,
} from "./internetService";

export const DEFAULT_INTERNET_PROVIDERS = [
    {
        id: "spectranet",
        serviceID: "spectranet",
        name: "Spectranet 4G LTE",
        shortName: "Spectranet",
        color: "from-blue-600 to-indigo-700",
        description: "Fast & reliable 4G LTE broadband",
    },
    {
        id: "smile",
        serviceID: "smile-direct",
        name: "Smile Communications",
        shortName: "Smile",
        color: "from-pink-600 to-rose-700",
        description: "Superfast 4G LTE mobile broadband",
    },
];

// ================= FETCH INTERNET PLANS =================
export const fetchInternetPlans = createAsyncThunk(
    "internet/fetchInternetPlans",
    async (providerId, thunkAPI) => {
        try {
            const response = await getInternetPlans(providerId);
            const plans = response?.data || (Array.isArray(response) ? response : []);
            return plans;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch internet plans";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ================= FETCH INTERNET PROVIDERS =================
export const fetchInternetProviders = createAsyncThunk(
    "internet/fetchInternetProviders",
    async (_, thunkAPI) => {
        try {
            const response = await getInternetProviders();
            const providers = response?.data || (Array.isArray(response) ? response : []);

            // Map and enrich with branding colors
            return providers.map((p) => {
                const match = DEFAULT_INTERNET_PROVIDERS.find(
                    (dp) => dp.serviceID === p.serviceID || dp.id === p.serviceID
                );
                return {
                    id: match?.id || p.serviceID,
                    serviceID: p.serviceID,
                    name: match?.name || p.name || p.serviceID,
                    shortName: match?.shortName || p.name || p.serviceID,
                    color: match?.color || "from-cyan-600 to-blue-700",
                    description: match?.description || "High-speed broadband service",
                };
            });
        } catch (error) {
            // Return fallback default providers on network failure
            return DEFAULT_INTERNET_PROVIDERS;
        }
    }
);

// ================= VERIFY INTERNET ACCOUNT =================
export const verifyInternetAccount = createAsyncThunk(
    "internet/verifyInternetAccount",
    async ({ disco, serviceID, billersCode }, thunkAPI) => {
        try {
            const response = await verifyInternet({ disco, serviceID, billersCode });
            return response?.data || response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Unable to verify internet account";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ================= PURCHASE INTERNET =================
export const purchaseInternet = createAsyncThunk(
    "internet/purchaseInternet",
    async (payload, thunkAPI) => {
        try {
            const response = await buyInternet(payload);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Internet subscription failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    // Providers
    providers: DEFAULT_INTERNET_PROVIDERS,
    selectedProvider: DEFAULT_INTERNET_PROVIDERS[0],
    loadingProviders: false,

    // Plans
    plans: [],
    loadingPlans: false,
    plansError: null,
    selectedPlan: null,

    // Verification
    verifying: false,
    verifiedCustomer: null,
    verificationError: null,

    // Purchase
    purchasing: false,
    purchaseSuccess: null,
    purchaseError: null,
};

const internetSlice = createSlice({
    name: "internet",
    initialState,
    reducers: {
        setSelectedProvider: (state, action) => {
            state.selectedProvider = action.payload;
            state.plans = [];
            state.selectedPlan = null;
            state.plansError = null;
            state.verifiedCustomer = null;
            state.verificationError = null;
        },
        setSelectedPlan: (state, action) => {
            state.selectedPlan = action.payload;
        },
        clearVerification: (state) => {
            state.verifiedCustomer = null;
            state.verificationError = null;
        },
        resetInternet: (state) => {
            state.purchasing = false;
            state.purchaseSuccess = null;
            state.purchaseError = null;
            state.verifying = false;
            state.verifiedCustomer = null;
            state.verificationError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Plans
            .addCase(fetchInternetPlans.pending, (state) => {
                state.loadingPlans = true;
                state.plansError = null;
            })
            .addCase(fetchInternetPlans.fulfilled, (state, action) => {
                state.loadingPlans = false;
                state.plans = action.payload;
                state.selectedPlan = action.payload?.[0] || null;
                state.plansError = null;
            })
            .addCase(fetchInternetPlans.rejected, (state, action) => {
                state.loadingPlans = false;
                state.plans = [];
                state.selectedPlan = null;
                state.plansError = action.payload;
            })

            // Fetch Providers
            .addCase(fetchInternetProviders.pending, (state) => {
                state.loadingProviders = true;
            })
            .addCase(fetchInternetProviders.fulfilled, (state, action) => {
                state.loadingProviders = false;
                if (Array.isArray(action.payload) && action.payload.length > 0) {
                    state.providers = action.payload;
                    // Maintain selection if already chosen
                    if (!state.selectedProvider) {
                        state.selectedProvider = action.payload[0];
                    }
                }
            })
            .addCase(fetchInternetProviders.rejected, (state) => {
                state.loadingProviders = false;
            })

            // Verify Account
            .addCase(verifyInternetAccount.pending, (state) => {
                state.verifying = true;
                state.verificationError = null;
                state.verifiedCustomer = null;
            })
            .addCase(verifyInternetAccount.fulfilled, (state, action) => {
                state.verifying = false;
                state.verifiedCustomer = action.payload;
                state.verificationError = null;
            })
            .addCase(verifyInternetAccount.rejected, (state, action) => {
                state.verifying = false;
                state.verifiedCustomer = null;
                state.verificationError = action.payload;
            })

            // Purchase Internet
            .addCase(purchaseInternet.pending, (state) => {
                state.purchasing = true;
                state.purchaseError = null;
            })
            .addCase(purchaseInternet.fulfilled, (state, action) => {
                state.purchasing = false;
                state.purchaseSuccess = action.payload?.data || action.payload;
                state.purchaseError = null;
            })
            .addCase(purchaseInternet.rejected, (state, action) => {
                state.purchasing = false;
                state.purchaseError = action.payload;
            });
    },
});

export const {
    setSelectedProvider,
    setSelectedPlan,
    clearVerification,
    resetInternet,
} = internetSlice.actions;

export default internetSlice.reducer;
