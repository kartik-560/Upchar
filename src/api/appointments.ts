import apiClient from './apiConfig';

export const getAppointmentsByPatient = (patientId: string) => apiClient.get(`/api/appointments/patient/${patientId}`).then(res => res.data);
export const getAppointmentById = (appointmentId: string) => apiClient.get(`/api/appointments/${appointmentId}`).then(res => res.data);
export const bookAppointment = (payload: any) => apiClient.post('/api/appointments', payload).then(res => res.data);
export const cancelAppointment = (appointmentId: string, payload: any = {}) => apiClient.post(`/api/appointments/${appointmentId}/cancel`, payload).then(res => res.data);
export const rescheduleAppointment = (appointmentId: string, payload: any) => apiClient.post(`/api/appointments/${appointmentId}/reschedule`, payload).then(res => res.data);
