import api from "../../api/axios";

export const buyAirtime = async (payload) => {
    const response = await api.post(
        "/airtime/buy-airTime",
        payload
    );

    return response.data;
};

export const getAirtimeNetworks = async () => {
    const response = await api.get("/airtime/get-networks");
    return response.data;
};
