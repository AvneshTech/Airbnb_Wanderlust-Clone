import api from "./axiosInstance.js";

export const fetchListings = (params = {}) => api.get("/listings", { params });
export const fetchListing = (id) => api.get(`/listings/${id}`);

// Listings use multipart/form-data because of the image upload.
export const createListing = (formData) =>
  api.post("/listings", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const updateListing = (id, formData) =>
  api.put(`/listings/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteListing = (id) => api.delete(`/listings/${id}`);
