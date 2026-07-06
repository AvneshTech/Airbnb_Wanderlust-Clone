import api from "./axiosInstance.js";
// Check the api.js file for the base URL and other configurations
// All the API requests related to chat functionality will be defined here
// All api check later it is not working properly
export const fetchChatHistory = () => api.get("/chat/history");
export const sendChatMessage = (message) => api.post("/chat", { message });
export const clearChat = () => api.post("/chat/clear");
