import api from "../../api/axios";

// Fetch education providers
export const getEducationProviders = async () => {
    const response = await api.get("/education/get-educations");
    return response.data;
};

// Fetch education packages/plans for a provider (waec, jamb, neco, nabteb)
export const getEducationPlans = async (providerId) => {
    const response = await api.get(`/education/plans/${providerId}`);
    return response.data;
};

// Verify education details (e.g. Profile code)
export const verifyEducation = async (data) => {
    const response = await api.post("/education/verify-education", data);
    return response.data;
};

// Purchase education PIN
export const buyEducation = async (data) => {
    const response = await api.post("/education/purchase-education", data);
    return response.data;
};

