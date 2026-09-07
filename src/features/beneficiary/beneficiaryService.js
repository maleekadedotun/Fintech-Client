import api from "../../api/axios";

export const getBeneficiaries = async () => {
    const response = await api.get("/beneficiary");
    return response.data;
};

export const saveBeneficiary = async (data) => {
    const response = await api.post("/beneficiary/save-beneficiary", data);
    return response.data;
};

export const deleteBeneficiary = async (id) => {
    const response = await api.delete(`/beneficiary/delete/${id}`);
    return response.data;
};
