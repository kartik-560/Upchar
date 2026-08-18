import apiClient from './apiConfig';

export const getDoctors = (search = '', specialization = '') => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (specialization) params.append('specialization', specialization);
  return apiClient.get(`/api/doctors?${params.toString()}`).then(res => res.data);
};

export const getDoctorById = (id: string) => apiClient.get(`/api/doctors/${id}`).then(res => res.data);
export const getDoctorAvailability = (doctorId: string) => apiClient.get(`/api/doctors/${doctorId}/availability`).then(res => res.data);
export const addDoctorAvailability = (doctorId: string, payload: any) => apiClient.post(`/api/doctors/${doctorId}/availability`, payload).then(res => res.data);
export const deleteDoctorAvailability = (id: string) => apiClient.delete(`/api/doctors/availability/${id}`).then(res => res.data);
export const getDoctorSlots = (doctorId: string, date: string) => apiClient.get(`/api/doctors/${doctorId}/slots?date=${date}`).then(res => res.data);
