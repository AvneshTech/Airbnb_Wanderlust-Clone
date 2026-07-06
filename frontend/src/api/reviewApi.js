import api from "./axiosInstance.js";

export const createReview = (listingId, data) =>
  api.post(`/listings/${listingId}/reviews`, data);

export const updateReview = (listingId, reviewId, data) =>
  api.put(`/listings/${listingId}/reviews/${reviewId}`, data);

export const deleteReview = (listingId, reviewId) =>
  api.delete(`/listings/${listingId}/reviews/${reviewId}`);
