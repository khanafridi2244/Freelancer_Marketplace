import api from './axios';

export const createBid = (taskId, data) => api.post(`/tasks/${taskId}/bids`, data);
export const getBidsForTask = (taskId) => api.get(`/tasks/${taskId}/bids`);
export const acceptBid = (bidId) => api.patch(`/bids/${bidId}/accept`);
export const getMyBids = () => api.get('/bids/my-bids');