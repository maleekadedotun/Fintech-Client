// import { createSlice } from "@reduxjs/toolkit";

// // const initialState = {
// //     user: null,
// //     token: localStorage.getItem("token") || null,
// //     loading: false,
// //     error: null,
// // };

// const initialState = {
//     user: JSON.parse(localStorage.getItem("user")) || null,
//     token: localStorage.getItem("token") || null,
//     loading: false,
//     error: null,
// };

// const authSlice = createSlice({
//     name: "auth",

//     initialState,

//     reducers: {

//         loginStart(state) {
//             state.loading = true;
//             state.error = null;
//         },

//         // loginSuccess(state, action) {
//         //     state.loading = false;
//         //     state.error = null;

//         //     state.user = {
//         //         _id: action.payload._id,
//         //         name: action.payload.name,
//         //         email: action.payload.email,
//         //         role: action.payload.role,
//         //         isAdmin: action.payload.isAdmin,
//         //     };

//         //     state.token = action.payload.token;

//         //     localStorage.setItem("token", action.payload.token);
//         // },

//         // loginSuccess(state, action) {
//         //     state.loading = false;
//         //     state.error = null;
//         //     state.user = action.payload;
//         //     state.token = action.payload.token;
//         //     localStorage.setItem("token", action.payload.token);
//         // },

//         loginSuccess(state, action) {
//             state.loading = false;
//             state.error = null;

//             state.user = {
//                 _id: action.payload._id,
//                 name: action.payload.name,
//                 email: action.payload.email,
//                 role: action.payload.role,
//                 isAdmin: action.payload.isAdmin,
//             };

//             state.token = action.payload.token;

//             // Save authentication data
//             localStorage.setItem("token", action.payload.token);
//             localStorage.setItem(
//                 "user",
//                 JSON.stringify(state.user)
//             );
//         },
//         loginFailure(state, action) {
//             state.loading = false;
//             state.error = action.payload;
//         },

//         // logout(state) {

//         //     state.user = null;

//         //     state.token = null;

//         //     localStorage.removeItem("token");
//         // },

//         logout(state) {
//             state.user = null;
//             state.token = null;

//             localStorage.removeItem("token");
//             localStorage.removeItem("user");
//         },
//     },
// });

// export const {

//     loginStart,

//     loginSuccess,

//     loginFailure,

//     logout,

// } = authSlice.actions;

// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // LOGIN DATA
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  // LOGIN STATE
  loading: false,
  error: null,

  // REGISTER STATE
  registerLoading: false,
  registerError: null,
  registerSuccess: false,

  // Newly created account information
  registeredAccount: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    // =========================
    // LOGIN
    // =========================

    loginStart(state) {
      state.loading = true;
      state.error = null;
    },

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
      localStorage.setItem(
        "token",
        action.payload.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(state.user)
      );
    },

    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },


    // =========================
    // REGISTER
    // =========================

    registerStart(state) {
      state.registerLoading = true;
      state.registerError = null;
      state.registerSuccess = false;
    },

    registerSuccess(state, action) {
      state.registerLoading = false;
      state.registerError = null;
      state.registerSuccess = true;

      // Store newly registered user and account details
      state.registeredAccount = {
        user: action.payload.data,

        accountName: action.payload.accountName,

        accountNumber: action.payload.accountNumber,

        bankName: action.payload.bankName,
      };
    },

    registerFailure(state, action) {
      state.registerLoading = false;
      state.registerError = action.payload;
      state.registerSuccess = false;
    },

    resetRegisterState(state) {
      state.registerLoading = false;
      state.registerError = null;
      state.registerSuccess = false;
      state.registeredAccount = null;
    },


    // =========================
    // LOGOUT
    // =========================

    logout(state) {
      state.user = null;
      state.token = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

  },
});


export const {

  // LOGIN
  loginStart,
  loginSuccess,
  loginFailure,

  // REGISTER
  registerStart,
  registerSuccess,
  registerFailure,
  resetRegisterState,

  // LOGOUT
  logout,

} = authSlice.actions;


export default authSlice.reducer;