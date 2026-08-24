// import {
//     loginUser,
//     registerUser,
// } from "./authAPI";

// export const login = async (credentials) => {
//     return await loginUser(credentials);
// };

// export const register = async (data) => {
//     return await registerUser(data);
// };

// import { loginUser } from "./authAPI";

import { loginUser } from "./authAPI";

export const login = async (credentials) => {
    return await loginUser(credentials);
};

// export const login = async (credentials) => {

//     const response = await loginUser(credentials);

//     return response.data;
// };