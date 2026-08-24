import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//     user: null,
//     token: localStorage.getItem("token") || null,
//     loading: false,
//     error: null,
// };

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        loginStart(state) {
            state.loading = true;
            state.error = null;
        },

        // loginSuccess(state, action) {
        //     state.loading = false;
        //     state.error = null;

        //     state.user = {
        //         _id: action.payload._id,
        //         name: action.payload.name,
        //         email: action.payload.email,
        //         role: action.payload.role,
        //         isAdmin: action.payload.isAdmin,
        //     };

        //     state.token = action.payload.token;

        //     localStorage.setItem("token", action.payload.token);
        // },

        // loginSuccess(state, action) {
        //     state.loading = false;
        //     state.error = null;
        //     state.user = action.payload;
        //     state.token = action.payload.token;
        //     localStorage.setItem("token", action.payload.token);
        // },

        loginSuccess(state, action) {
            state.loading = false;
            state.error = null;

            state.user = {
                _id: action.payload._id,
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
                isAdmin: action.payload.isAdmin,
            };

            state.token = action.payload.token;

            // Save authentication data
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem(
                "user",
                JSON.stringify(state.user)
            );
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // logout(state) {

        //     state.user = null;

        //     state.token = null;

        //     localStorage.removeItem("token");
        // },

        logout(state) {
            state.user = null;
            state.token = null;

            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
});

export const {

    loginStart,

    loginSuccess,

    loginFailure,

    logout,

} = authSlice.actions;

export default authSlice.reducer;