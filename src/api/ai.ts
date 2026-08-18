import apiClient from './apiConfig';

export const getDemand = () => apiClient.get('/api/ai/demand').then(res => res.data);
export const getPredictions = (patientId: string) => apiClient.get(`/api/ai/predictions/${patientId}`).then(res => res.data);
export const selfPredict = (payload: any) => apiClient.post('/api/ai/self-predict', payload).then(res => res.data);
export const predictConsultation = (payload: any) => apiClient.post('/api/ai/predict', payload).then(res => res.data);
