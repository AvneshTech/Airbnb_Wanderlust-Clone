import axios from "axios";

// Single configured axios instance. withCredentials sends the session cookie cross-origin.
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  withCredentials: true,
});

export default axiosInstance;
