import api from "../../api/axios";

// Buy internet subscription
export const buyInternet = async (data) => {
    const response = await api.post("/internet/purchase-internet", data);
    return response.data;
};

// Verify internet account
export const verifyInternet = async (data) => {
    const response = await api.post("/internet/verify-internet", data);
    return response.data;
};

// Get internet plans for a specific provider (e.g. spectranet, smile-direct)
export const getInternetPlans = async (providerId) => {
    const response = await api.get(`/internet/plans/${providerId}`);
    return response.data;
};

// Get all internet providers
export const getInternetProviders = async () => {
    const response = await api.get("/internet/providers");
    return response.data;
};