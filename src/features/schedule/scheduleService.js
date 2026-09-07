import api from "../../api/axios";

export const createScheduledTransfer = async (data) => {
    const response = await api.post("/schedule/transfer-schedule", data);
    return response.data;
};

export const getScheduledTransfers = async () => {
    const response = await api.get("/schedule");
    return response.data;
};

export const pauseScheduledTransfer = async (id) => {
    const response = await api.patch(`/schedule/${id}/pause`);
    return response.data;
};

export const resumeScheduledTransfer = async (id) => {
    const response = await api.patch(`/schedule/${id}/resume`);
    return response.data;
};

export const deleteScheduledTransfer = async (id) => {
    const response = await api.delete(`/schedule/${id}/delete`);
    return response.data;
};
