import { getDashboardStats } from "./adminAPI";

export const dashboardStats = async () => {

    const response = await getDashboardStats();

    return response.data;

};