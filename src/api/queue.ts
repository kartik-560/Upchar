import apiClient from './apiConfig';

export const getQueue = (doctorId: string) => apiClient.get(`/api/queue/${doctorId}`).then(res => res.data);
export const checkIn = (appointmentId: string) => apiClient.post('/api/queue/checkin', { appointmentId }).then(res => res.data);
export const markLate = (appointmentId: string) => apiClient.post('/api/queue/simulate-late', { appointmentId }).then(res => res.data);
export const markEmergency = (appointmentId: string) => apiClient.post('/api/queue/emergency', { appointmentId }).then(res => res.data);
