import api from "./axiosInstance.js";

export const fetchChatHistory = () => api.get("/chat/history");
export const sendChatMessage = (message) => api.post("/chat", { message });
export const clearChat = () => api.post("/chat/clear");
