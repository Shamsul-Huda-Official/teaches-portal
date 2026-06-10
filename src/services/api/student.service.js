import api from "./api";

export const getStudents = async (params = {}) => {
    const response = await api.get(`/students`, { params })
    return response.data.data
};

export const createStudent = async (studentData) => {
    const response = await api.post(`/students`, studentData);
    return response.data.data;
};

export const getStudentById = async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data.data;
};

export const bulkCreateStudent = async (students) => {
    const response = await api.post(`/students/bulk`, { students })
    return response.data.data
}

export const updateStudent = async (id, data) => {
    const response = await api.put(`/students/${id}`, data)
    return response.data.data
}

export const deleteStudent = async (id) => {
    const response = await api.delete(`/students/${id}`)
    return response.data.data
}

export const getStudentsByClass = async (classId) => {
    const response = await api.get(
        `/students/class/${classId}`
    )
    return response.data.data
}

export const getStudentsByDivision = async (classId, divisionId) => {
    const response = await api.get(
        `/students/class/${classId}/division/${divisionId}`
    );
    return response.data.data;
}