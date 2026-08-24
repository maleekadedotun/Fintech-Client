import api from "../../api/axios";

export const transferFunds = async (payload) => {

    const response = await api.post(
        "/wallet/transfer",
        payload
    );

    return response.data;

};