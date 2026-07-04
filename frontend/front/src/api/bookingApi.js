import api from "./axiosInstance.js";

export const createBooking = (data) => api.post("/bookings", data);
export const fetchMyBookings = () => api.get("/bookings/my");
export const fetchBooking = (id) => api.get(`/bookings/${id}`);
export const confirmBooking = (id) => api.patch(`/bookings/${id}/confirm`);
export const cancelBooking = (id) => api.delete(`/bookings/${id}`);
