import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getCableProviders,
    getCablePlans,
    verifyCableCustomer,
    buyCable,
} from "./cableService";

export const DEFAULT_CABLE_PROVIDERS = [
    {
        id: "dstv",
        serviceID: "dstv",
        name: "DStv",
        iconBg: "bg-blue-600",
        desc: "Premium HD entertainment & sport",
    },
    {
        id: "gotv",
        serviceID: "gotv",
        name: "GOtv",
        iconBg: "bg-emerald-600",
        desc: "Affordable family TV channels",
    },
    {
        id: "startimes",
        serviceID: "startimes",
        name: "StarTimes",
        iconBg: "bg-amber-600",
        desc: "Digital terrestrial & satellite TV",
    },
    {
        id: "showmax",
        serviceID: "showmax",
        name: "Showmax",
        iconBg: "bg-rose-600",
        desc: "Online movies, series & live sport",
    },
];

// ================= FETCH CABLE PROVIDERS =================
export const fetchCableProviders = createAsyncThunk(
    "cable/fetchCableProviders",
    async (_, thunkAPI) => {
        try {
            const response = await getCableProviders();
            const providers = response?.data || (Array.isArray(response) ? response : []);

            if (Array.isArray(providers) && providers.length > 0) {
                return providers.map((p) => {
                    const match = DEFAULT_CABLE_PROVIDERS.find(
                        (dp) =>
                            dp.serviceID === p.serviceID ||
                            dp.id === p.id ||
                            dp.serviceID === String(p.id).toLowerCase()
                    );
                    return {
                        id: p.id || p.serviceID,
                        serviceID: p.serviceID || p.id,
                        name: match?.name || p.name || p.serviceID,
                        iconBg: match?.iconBg || "bg-purple-600",
                        desc: match?.desc || "Digital television subscription",
                    };
                });
            }
            return DEFAULT_CABLE_PROVIDERS;
        } catch (error) {
            return DEFAULT_CABLE_PROVIDERS;
        }
    }
);

// ================= FETCH CABLE PLANS =================
export const fetchCablePlans = createAsyncThunk(
    "cable/fetchCablePlans",
    async (providerId, thunkAPI) => {
        try {
            const response = await getCablePlans(providerId);
            const plans = response?.data || (Array.isArray(response) ? response : []);
            return plans;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch subscription packages";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ================= VERIFY CABLE CUSTOMER =================
export const verifyCableCustomerAccount = createAsyncThunk(
    "cable/verifyCableCustomerAccount",
    async ({ providerId, smartCardNumber }, thunkAPI) => {
        try {
            const response = await verifyCableCustomer({ providerId, smartCardNumber });
            return response?.data || response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to verify Smartcard number";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ================= PURCHASE CABLE SUBSCRIPTION =================
export const purchaseCable = createAsyncThunk(
    "cable/purchaseCable",
    async (payload, thunkAPI) => {
        try {
            const response = await buyCable(payload);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Cable TV subscription renewal failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    // Providers
    providers: DEFAULT_CABLE_PROVIDERS,
    selectedProvider: DEFAULT_CABLE_PROVIDERS[0],
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

const cableSlice = createSlice({
    name: "cable",
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
        resetCable: (state) => {
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
            // Fetch Providers
            .addCase(fetchCableProviders.pending, (state) => {
                state.loadingProviders = true;
            })
            .addCase(fetchCableProviders.fulfilled, (state, action) => {
                state.loadingProviders = false;
                if (Array.isArray(action.payload) && action.payload.length > 0) {
                    state.providers = action.payload;
                    if (!state.selectedProvider) {
                        state.selectedProvider = action.payload[0];
                    }
                }
            })
            .addCase(fetchCableProviders.rejected, (state) => {
                state.loadingProviders = false;
            })

            // Fetch Plans
            .addCase(fetchCablePlans.pending, (state) => {
                state.loadingPlans = true;
                state.plansError = null;
            })
            .addCase(fetchCablePlans.fulfilled, (state, action) => {
                state.loadingPlans = false;
                state.plans = action.payload;
                state.selectedPlan = action.payload?.[0] || null;
                state.plansError = null;
            })
            .addCase(fetchCablePlans.rejected, (state, action) => {
                state.loadingPlans = false;
                state.plans = [];
                state.selectedPlan = null;
                state.plansError = action.payload;
            })

            // Verify SmartCard
            .addCase(verifyCableCustomerAccount.pending, (state) => {
                state.verifying = true;
                state.verificationError = null;
                state.verifiedCustomer = null;
            })
            .addCase(verifyCableCustomerAccount.fulfilled, (state, action) => {
                state.verifying = false;
                state.verifiedCustomer = action.payload;
                state.verificationError = null;
            })
            .addCase(verifyCableCustomerAccount.rejected, (state, action) => {
                state.verifying = false;
                state.verifiedCustomer = null;
                state.verificationError = action.payload;
            })

            // Purchase Cable
            .addCase(purchaseCable.pending, (state) => {
                state.purchasing = true;
                state.purchaseError = null;
            })
            .addCase(purchaseCable.fulfilled, (state, action) => {
                state.purchasing = false;
                state.purchaseSuccess = action.payload?.data || action.payload;
                state.purchaseError = null;
            })
            .addCase(purchaseCable.rejected, (state, action) => {
                state.purchasing = false;
                state.purchaseError = action.payload;
            });
    },
});

export const {
    setSelectedProvider,
    setSelectedPlan,
    clearVerification,
    resetCable,
} = cableSlice.actions;

export default cableSlice.reducer;
