import api from "../../api/axios";

export const buyBetting = async (data) => {
    const response = await api.post("/betting/purchase-betting", data);
    return response.data;
};
