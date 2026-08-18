import apiClient from './apiConfig';

export const getPatientDiagnoses = (patientId: string) => apiClient.get(`/api/diagnoses/patient/${patientId}`).then(res => res.data);
export const getPatientPrescriptions = (patientId: string) => apiClient.get(`/api/prescriptions/patient/${patientId}`).then(res => res.data);
export const getPrescriptionById = (prescriptionId: string) => apiClient.get(`/api/prescriptions/${prescriptionId}`).then(res => res.data);
