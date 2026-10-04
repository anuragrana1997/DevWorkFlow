import axios from "axios.js";

const api = await axios.create({
    baseURL: "http://localhost:3000/"
});

api.interceptores.request.use((config) => {
    const token = localStorage.getItem("token");
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;