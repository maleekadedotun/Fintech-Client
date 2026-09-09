import api from "../../api/axios";

// Core dashboard metrics (users, wallets, balance, pending withdrawals, revenue, today transfers)
export const getDashboardStats = async () => {
    const response = await api.get("/admins/dashboard");
    return response.data;
};

// System-wide statistics (credits, debits, total txs, kyc counts)
export const getAdminOverviewStats = async () => {
    const response = await api.get("/admins/admin-stats");
    return response.data;
};

// Revenue analytics (daily revenue breakdown and category profits)
export const getRevenueStats = async () => {
    const response = await api.get("/admins/admin-revenue");
    return response.data;
};

// Top transacting users ranking
export const getTopUsers = async () => {
    const response = await api.get("/admins/top-users");
    return response.data;
};

// All registered users directory
export const getAllUsers = async () => {
    const response = await api.get("/auth");
    return response.data;
};

// Reverse a transfer transaction by reference
export const reverseTransfer = async (reference) => {
    const response = await api.post(`/admins/reverse-transfer/${reference}`);
    return response.data;
};

// Approve pending withdrawal
export const approveWithdrawal = async (withdrawalId) => {
    const response = await api.put(`/withdrawal/admin/withdrawals/${withdrawalId}/approve`);
    return response.data;
};

// --- KYC Admin Endpoints ---

// Fetch all pending KYC submissions
export const getPendingKYC = async () => {
    const response = await api.get("/kyc/kyc-pending");
    return response.data;
};

// Approve a user's KYC
export const approveKYC = async (userId) => {
    const response = await api.patch(`/kyc/kyc-verify/${userId}`);
    return response.data;
};

// Reject a user's KYC
export const rejectKYC = async (userId, reason = "") => {
    const response = await api.patch(`/kyc/kyc-reject/${userId}`, { reason });
    return response.data;
};

// Freeze or Unfreeze a user account
export const toggleFreezeUser = async (userId) => {
    const response = await api.patch(`/admins/users/${userId}/toggle-freeze`);
    return response.data;
};