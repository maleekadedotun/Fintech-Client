import * as adminAPI from "./adminAPI";

export const dashboardStats = async () => {
    const response = await adminAPI.getDashboardStats();
    return response?.data || response;
};

export const adminOverviewStats = async () => {
    const response = await adminAPI.getAdminOverviewStats();
    return response?.data || response;
};

export const adminRevenueStats = async () => {
    const response = await adminAPI.getRevenueStats();
    return response;
};

export const adminTopUsers = async () => {
    const response = await adminAPI.getTopUsers();
    return response?.data || response;
};

export const adminAllUsers = async () => {
    const response = await adminAPI.getAllUsers();
    return response?.data || response;
};

export const adminReverseTransfer = async (reference) => {
    const response = await adminAPI.reverseTransfer(reference);
    return response;
};

export const adminApproveWithdrawal = async (withdrawalId) => {
    const response = await adminAPI.approveWithdrawal(withdrawalId);
    return response;
};