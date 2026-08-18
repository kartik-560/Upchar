import apiClient from './apiConfig';

export const login = (payload: any) => apiClient.post('/api/auth/login', payload).then(res => res.data);
export const register = (payload: any) => apiClient.post('/api/auth/register', payload).then(res => res.data);
export const getProfile = (id: string) => apiClient.get(`/api/auth/${id}`).then(res => res.data);
export const updateProfile = (id: string, payload: any) => apiClient.put(`/api/auth/${id}`, payload).then(res => res.data);
