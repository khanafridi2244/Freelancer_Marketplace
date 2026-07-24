import api from './axios';

export const getTasks = () => api.get('/tasks');
export const getTaskById = (id) => api.get(`/tasks/${id}`);
export const createTask = (data) => api.post('/tasks', data);
export const completeTask = (id) => api.patch(`/tasks/${id}/complete`);
