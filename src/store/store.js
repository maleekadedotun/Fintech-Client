import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import transactionReducer from "../features/transactions/transactionSlice";
import transferReducer from "../features/transfer/transferSlice";
import pinReducer from "../features/pin/pinSlice";
import airtimeReducer from "../features/airtime/airtimeSlice";
import dataReducer from "../features/data/dataSlice";
import internetReducer from "../features/internet/internetSlice";
import cableReducer from "../features/cable/cableSlice";
import educationReducer from "../features/education/educationSlice";
import adminReducer from "../features/admin/adminSlice";
import kycReducer from "../features/kyc/kycSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionReducer,
        transfer: transferReducer,
        pin: pinReducer,
        airtime: airtimeReducer,
        data: dataReducer,
        internet: internetReducer,
        cable: cableReducer,
        education: educationReducer,
        admin: adminReducer,
        kyc: kycReducer,
    },
});

