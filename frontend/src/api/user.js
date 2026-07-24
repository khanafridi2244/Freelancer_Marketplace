import api from './axios';

export const getUserProfile = (id) => api.get(`/users/${id}`);