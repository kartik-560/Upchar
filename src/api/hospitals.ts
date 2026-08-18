import apiClient from './apiConfig';

export const getHospitals = () => apiClient.get('/api/hospitals').then(res => res.data);
export const getDepartments = (hospitalId: string) => apiClient.get(`/api/hospitals/${hospitalId}/departments`).then(res => res.data);
