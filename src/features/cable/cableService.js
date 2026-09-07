import api from "../../api/axios";

export const getCableProviders = async () => {
    const response = await api.get("/cable/providers");
    return response.data;
};

export const getCablePlans = async (providerId) => {
    const response = await api.get(`/cable/plans/${providerId}`);
    return response.data;
};

export const verifyCableCustomer = async (data) => {
    const response = await api.post("/cable/verify", data);
    return response.data;
};

export const buyCable = async (data) => {
    const response = await api.post("/cable/buy-cable", data);
    return response.data;
};
