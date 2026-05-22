import api from "./api";

export const getClasses = async () => {
    const response = await api.get(`/classes`)
    return response.data.data
}

export const createClass = async (classData) => {
    const response = await api.post(`/classes`, classData)
    return response.data.data
}

export const getClassById = async (id) => {
    const response = await api.get(`/classes/${id}`)
    return response.data.data
}

export const updateClass = async (id, data) => {
    const response = await api.put(`classes/${id}`, data)
    return response.data.data
}

export const deleteClass = async (id) => {
    const response = await api.delete(`/classes/${id}`)
    return response.data.data
}