import api from "../../api/axios";

export const createTransactionPin = async (pin) => {

    const response = await api.post(
        "/pin/create",
        {
            pin,
        }
    );

    return response.data;
};


export const sendPinResetOtp = async () => {

    const response = await api.post(
        "/pin/send-reset-otp"
    );

    return response.data;
};


export const resetTransactionPin = async (data) => {

    const response = await api.post(
        "/pin/reset",
        data
    );

    return response.data;
};