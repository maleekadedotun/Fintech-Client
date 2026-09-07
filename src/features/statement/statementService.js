import api from "../../api/axios";

export const getStatement = async (params = {}) => {
    const response = await api.get("/statement/get-statement", { params });
    return response.data;
};

export const downloadStatement = async (params = {}) => {
    const response = await api.get("/statement/download-statement", {
        params,
        responseType: "blob",
    });
    return response.data;
};
