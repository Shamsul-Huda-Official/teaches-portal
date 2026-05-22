import api from "./api"

export const getTeachers = async () => {
    const  response = await api.get("/teachers")
    return response.data.data;
}

export const createTeacher = async (teacherData) => {
    const response = await api.post("/teachers", teacherData);
    return response.data.data
}