import api from "../../api/axios";

export const getDashboardStats = async () => {

    const response = await api.get(
        "/admins/dashboard"
    );

    return response.data;
};