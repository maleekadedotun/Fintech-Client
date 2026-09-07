import api from "../../api/axios";

export const buyElectricity = async (data) => {
    const response = await api.post("/electricity/purchase", data);
    return response.data;
};

export const verifyMeter = async (data) => {
    const response = await api.post("/electricity/verify", data);
    return response.data;
};
