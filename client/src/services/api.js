// src/services/api.js
import axios from 'axios';

// Update API_URL line
const hostname = window.location.hostname; // Gets local hostname
const API_URL = process.env.REACT_APP_API_URL || `http://${hostname}:5000/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error handling interceptor
api.interceptors.response.use(
  response => response,
  error => {
    // Handle specific error cases
    if (error.response) {
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      console.error('Network Error:', error.request);
      throw new Error('Network error - please check your connection');
    } else {
      console.error('Error:', error.message);
      throw error;
    }
  }
);

// Athletes API
export const athleteApi = {
  getAthletes: async (params = {}) => {
    const response = await api.get('/athletes', { params });
    return response.data;
  },

  getAthlete: async (id) => {
    const response = await api.get(`/athletes/${id}`);
    return response.data;
  },

  createAthlete: async (data) => {
    const response = await api.post('/athletes', data);
    return response.data;
  },

  updateAthlete: async (id, data) => {
    const response = await api.put(`/athletes/${id}`, data);
    return response.data;
  },

  deleteAthlete: async (id) => {
    const response = await api.delete(`/athletes/${id}`);
    return response.data;
  }
};

// Assessments API
export const assessmentApi = {
  getAssessments: async (params = {}) => {
    const response = await api.get('/assessments', { params });
    return response.data;
  },

  getAssessment: async (id) => {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  },

  getAthleteAssessments: async (athleteId, params = {}) => {
    const response = await api.get('/assessments', { 
      params: { athleteId, ...params } 
    });
    return response.data;
  },

  createAssessment: async (data) => {
    const response = await api.post('/assessments', data);
    return response.data;
  },

  updateAssessment: async (id, data) => {
    const response = await api.put(`/assessments/${id}`, data);
    return response.data;
  },

  deleteAssessment: async (id) => {
    const response = await api.delete(`/assessments/${id}`);
    return response.data;
  }
};

// MeasurementTypes API
export const measurementTypeApi = {
  getMeasurementTypes: async (params = {}) => {
    const response = await api.get('/measurement-types', { params });
    return response.data;
  },

  createMeasurementType: async (data) => {
    const response = await api.post('/measurement-types', data);
    return response.data;
  },

  updateMeasurementType: async (id, data) => {
    const response = await api.put(`/measurement-types/${id}`, data);
    return response.data;
  },

  deleteMeasurementType: async (id) => {
    const response = await api.delete(`/measurement-types/${id}`);
    return response.data;
  },

  reinitializeDefaults: async () => {
    const response = await api.post('/measurement-types/reinitialize-defaults');
    return response.data;
  }
};

// Analytics API
export const analyticsApi = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await api.get('/statistics/dashboard');
    return response.data;
  },

  // Get performance trends for a specific metric
  getPerformanceTrends: async (metric, timeframe = '1y') => {
    const response = await api.get('/statistics/trends', {
      params: { metric, timeframe }
    });
    return response.data;
  },

  // Get comparative statistics between athletes
  getComparativeStats: async (athleteIds, metrics) => {
    const response = await api.get('/statistics/compare', {
      params: { 
        athletes: Array.isArray(athleteIds) ? athleteIds.join(',') : athleteIds,
        metrics: Array.isArray(metrics) ? metrics.join(',') : metrics
      }
    });
    return response.data;
  },

  // Get athlete statistics
  getAthleteStats: async (athleteId) => {
    const response = await api.get(`/athletes/${athleteId}/statistics`);
    return response.data;
  },

  // Get athlete performance trends
  getAthleteTrends: async (athleteId, metric) => {
    const response = await api.get(`/athletes/${athleteId}/trends`, {
      params: { metric }
    });
    return response.data;
  }
};

export default api;