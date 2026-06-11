import api from "./api";

export const getPeriods = async (params = {}) => {
    const response = await api.get(`/periods`, { params });
    return response.data.data;
};

export const createPeriod = async (periodData) => {
    const response = await api.post(`/periods`, periodData);
    return response.data.data;
};

export const assignSubject = async (periodId, subjectId) => {
    const response = await api.put(`/periods/${periodId}/assign`, { subjectId });
    return response.data.data;
}

export const getPeriodById = async (id) => {
    const response = await api.get(`/periods/${id}`);
    return response.data.data;
}

export const deletePeriod = async (id) => {
    const response = await api.delete(`/periods/${id}`);
    return response.data.data;
}