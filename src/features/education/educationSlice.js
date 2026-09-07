import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getEducationProviders,
    getEducationPlans,
    buyEducation,
    verifyEducation,
} from "./educationService";

export const DEFAULT_EDUCATION_PROVIDERS = [
    {
        id: "1",
        serviceID: "waec",
        name: "WAEC",
        displayName: "WAEC Result Checker",
        color: "from-blue-600 to-indigo-800",
        desc: "Instant result checker e-PIN with serial number",
    },
    {
        id: "2",
        serviceID: "waec-registration",
        name: "WAEC Registration",
        displayName: "WAEC Registration PIN",
        color: "from-sky-600 to-blue-800",
        desc: "WAEC GCE registration e-PIN",
    },
    {
        id: "3",
        serviceID: "neco",
        name: "NECO",
        displayName: "NECO Result Token",
        color: "from-purple-600 to-pink-700",
        desc: "Check SSCE & BECE examination results",
    },
    {
        id: "4",
        serviceID: "jamb",
        name: "JAMB",
        displayName: "JAMB UTME / DE PIN",
        color: "from-emerald-600 to-teal-800",
        desc: "UTME with Mock or without Mock profile registration",
    },
    {
        id: "5",
        serviceID: "nabteb",
        name: "NABTEB",
        displayName: "NABTEB Scratch Card",
        color: "from-amber-500 to-orange-700",
        desc: "National Business and Technical Examinations",
    },
];

// ================= FETCH EDUCATION PROVIDERS =================
export const fetchEducationProviders = createAsyncThunk(
    "education/fetchEducationProviders",
    async (_, thunkAPI) => {
        try {
            const response = await getEducationProviders();
            const rawData = response?.data || response;

            let parsedList = [];
            if (Array.isArray(rawData)) {
                parsedList = rawData;
            } else if (rawData && typeof rawData === "object") {
                parsedList = Object.entries(rawData).map(([key, val]) => ({
                    id: key,
                    serviceID: val.serviceID || val,
                    name: val.name || val.serviceID || val,
                }));
            }

            if (parsedList.length > 0) {
                return parsedList.map((p) => {
                    const match = DEFAULT_EDUCATION_PROVIDERS.find(
                        (dp) =>
                            dp.serviceID === p.serviceID ||
                            dp.id === String(p.id) ||
                            dp.serviceID === String(p.name).toLowerCase()
                    );
                    return {
                        id: p.id || p.serviceID,
                        serviceID: p.serviceID || p.id,
                        name: p.name || match?.name || p.serviceID,
                        displayName: match?.displayName || p.name || p.serviceID,
                        color: match?.color || "from-indigo-600 to-purple-800",
                        desc: match?.desc || "Examination e-PIN token",
                    };
                });
            }

            return DEFAULT_EDUCATION_PROVIDERS;
        } catch (error) {
            return DEFAULT_EDUCATION_PROVIDERS;
        }
    }
);

// ================= FETCH EDUCATION PLANS =================
export const fetchEducationPlans = createAsyncThunk(
    "education/fetchEducationPlans",
    async (providerKey, thunkAPI) => {
        try {
            const response = await getEducationPlans(providerKey);
            const plans = response?.data || (Array.isArray(response) ? response : []);
            return plans;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch exam packages";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ================= VERIFY EDUCATION =================
export const verifyEducationAccount = createAsyncThunk(
    "education/verifyEducationAccount",
    async (payload, thunkAPI) => {
        try {
            const response = await verifyEducation(payload);
            return response?.data || response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Verification failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// ================= PURCHASE EDUCATION PIN =================
export const purchaseEducationPin = createAsyncThunk(
    "education/purchaseEducationPin",
    async (payload, thunkAPI) => {
        try {
            const response = await buyEducation(payload);
            return response;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Exam PIN purchase failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    // Providers
    providers: DEFAULT_EDUCATION_PROVIDERS,
    selectedProvider: DEFAULT_EDUCATION_PROVIDERS[0],
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

const educationSlice = createSlice({
    name: "education",
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
        resetEducation: (state) => {
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
            .addCase(fetchEducationProviders.pending, (state) => {
                state.loadingProviders = true;
            })
            .addCase(fetchEducationProviders.fulfilled, (state, action) => {
                state.loadingProviders = false;
                if (Array.isArray(action.payload) && action.payload.length > 0) {
                    state.providers = action.payload;
                    if (!state.selectedProvider) {
                        state.selectedProvider = action.payload[0];
                    }
                }
            })
            .addCase(fetchEducationProviders.rejected, (state) => {
                state.loadingProviders = false;
            })

            // Fetch Plans
            .addCase(fetchEducationPlans.pending, (state) => {
                state.loadingPlans = true;
                state.plansError = null;
            })
            .addCase(fetchEducationPlans.fulfilled, (state, action) => {
                state.loadingPlans = false;
                state.plans = action.payload;
                state.selectedPlan = action.payload?.[0] || null;
                state.plansError = null;
            })
            .addCase(fetchEducationPlans.rejected, (state, action) => {
                state.loadingPlans = false;
                state.plans = [];
                state.selectedPlan = null;
                state.plansError = action.payload;
            })

            // Verify Account
            .addCase(verifyEducationAccount.pending, (state) => {
                state.verifying = true;
                state.verificationError = null;
                state.verifiedCustomer = null;
            })
            .addCase(verifyEducationAccount.fulfilled, (state, action) => {
                state.verifying = false;
                state.verifiedCustomer = action.payload;
                state.verificationError = null;
            })
            .addCase(verifyEducationAccount.rejected, (state, action) => {
                state.verifying = false;
                state.verifiedCustomer = null;
                state.verificationError = action.payload;
            })

            // Purchase PIN
            .addCase(purchaseEducationPin.pending, (state) => {
                state.purchasing = true;
                state.purchaseError = null;
            })
            .addCase(purchaseEducationPin.fulfilled, (state, action) => {
                state.purchasing = false;
                state.purchaseSuccess = action.payload?.data || action.payload;
                state.purchaseError = null;
            })
            .addCase(purchaseEducationPin.rejected, (state, action) => {
                state.purchasing = false;
                state.purchaseError = action.payload;
            });
    },
});

export const {
    setSelectedProvider,
    setSelectedPlan,
    clearVerification,
    resetEducation,
} = educationSlice.actions;

export default educationSlice.reducer;
