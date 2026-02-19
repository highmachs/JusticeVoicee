import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Chat & Voice ---
export const chatWithSakhi = async (query) => {
  const response = await api.post('/chat/', { query });
  return response.data;
};

export const transcribeAudio = async (audioBlob) => {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.wav');
  formData.append('lang', 'hi'); 
  
  const response = await api.post('/voice/asr', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getTTS = async (text) => {
    const response = await api.post('/voice/tts', null, { params: { text, lang: 'hi' } });
    return response.data; // returns { audio_url: "..." }
};

// --- History & Incidents ---
export const clearHistory = async () => {
  await api.delete('/history/clear-all/');
};

export const createIncident = async (data) => {
    // data: { description, incident_type, location_lat, location_long }
    const response = await api.post('/history/incidents/', data);
    return response.data;
};

export const uploadEvidence = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/history/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

// --- Deep Services ---
export const getNearybyHelp = async (lat, lng) => {
    const response = await api.post('/services/connect/nearby', { lat, lng });
    return response.data.results;
};

export const generatePDVAPdf = async (data) => {
    const response = await api.post('/services/action/generate-pdf', data, { responseType: 'blob' });
    return response.data;
};

export const triageMessage = async (text) => {
    const response = await api.post('/services/triage', { text });
    return response.data; // { category, severity, recommendation }
};

export const syncOfflineData = async () => {
    const response = await api.get('/services/sync/offline-data');
    console.log("Offline Data Synced:", response.data);
    return response.data;
};

export default api;
