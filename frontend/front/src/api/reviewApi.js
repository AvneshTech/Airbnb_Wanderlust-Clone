import api from "./axiosInstance.js";

export const createReview = (listingId, data) =>
  api.post(`/listings/${listingId}/reviews`, data);

export const deleteReview = (listingId, reviewId) =>
  api.delete(`/listings/${listingId}/reviews/${reviewId}`);
