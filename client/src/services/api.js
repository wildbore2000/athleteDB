// services/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const athleteAssessmentApi = {
  // Get all assessments with pagination and filters
  getAssessments: async (params) => {
    const response = await api.get('/assessments', { params });
    return response.data;
  },

  // Get single assessment
  getAssessment: async (id) => {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  },

  // Create new assessment
  createAssessment: async (data) => {
    const response = await api.post('/assessments', data);
    return response.data;
  },

  // Update assessment
  updateAssessment: async (id, data) => {
    const response = await api.put(`/assessments/${id}`, data);
    return response.data;
  },

  // Delete assessment
  deleteAssessment: async (id) => {
    const response = await api.delete(`/assessments/${id}`);
    return response.data;
  }
};

export default api;