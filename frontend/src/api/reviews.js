import api from './axios';

export const createReview = (taskId, data) => api.post(`/tasks/${taskId}/reviews`, data);
export const getUserReviews = (userId) => api.get(`/users/${userId}/reviews`);