
import api from "../../api/axios";

export const buyData = async ({
    phoneNumber,
    networkId,
    planId,
    amount,
    pin,
}) => {

    const response = await api.post("/data/data-purchase", {
        phoneNumber,
        networkId,
        planId,
        amount,
        pin,
    });

    return response.data;
};