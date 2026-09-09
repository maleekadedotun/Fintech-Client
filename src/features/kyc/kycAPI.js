import api from "../../api/axios";

// User submits KYC
export const submitKYC = async ({ idType, idNumber }) => {
    const response = await api.post("/kyc/kyc-submit", { idType, idNumber });
    return response.data;
};

// Fetch user profile to get up-to-date KYC and tier status
export const getMyKYCStatus = async () => {
    const response = await api.get("/auth/profile");
    return response.data;
};
