import api from "./api"

export const getTeachers = async () => {
    const  response = await api.get("/teachers")
    return response.data.data;
};

export const createTeacher = async (teacherData) => {
    const response = await api.post("/teachers", teacherData);
    return response.data.data
};

export const getTeacherById = async (id) => {
    const response = await api.get(`/teachers/${id}`);
    return response.data.data;
};

export const updateTeacher = async (id, data) => {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data.data;
}

export const bulkCreateTeachers = async (teachers) => {
    const response = await api.post(
        "/teachers/bulk",
        { teachers }
    );
    return response.data.data;
}