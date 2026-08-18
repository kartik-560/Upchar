import apiClient from './apiConfig';

export const startConsultation = (appointmentId: string) => apiClient.post('/api/consultations/start', { appointmentId }).then(res => res.data);
export const delayConsultation = (doctorId: string, delayMinutes: number) => apiClient.post('/api/consultations/delay', { doctorId, delayMinutes }).then(res => res.data);
export const saveConsultation = (consultationId: string, payload: any) => apiClient.post(`/api/consultations/${consultationId}/save`, payload).then(res => res.data);
export const endConsultation = (consultationId: string) => apiClient.post(`/api/consultations/${consultationId}/end`).then(res => res.data);
