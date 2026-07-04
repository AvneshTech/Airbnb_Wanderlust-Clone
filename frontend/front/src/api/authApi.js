import api from "./axiosInstance.js";

export const signupRequest = (data) => api.post("/auth/signup", data);
export const loginRequest = (data) => api.post("/auth/login", data);
export const logoutRequest = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");
