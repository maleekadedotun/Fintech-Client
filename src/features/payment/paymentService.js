import api from "../../api/axios";

export const createCheckoutSession = async (amount) => {
    const response = await api.post(
        "/payment/fund",
        { amount }
    );

    return response.data;
};

export const verifyPayment = async (sessionId) => {
    const response = await api.get(
        `/payment/verify/${sessionId}`
    );

    return response.data;
};