import api from "../../api/axios";

export const buyInsurance = async (data) => {
    const response = await api.post("/insurance/purchase-insurance", data);
    return response.data;
};
