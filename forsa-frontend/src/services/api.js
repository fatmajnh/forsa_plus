import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const annoncesService = {
  getAll: () => api.get('/annonces/get'),
  create: (data) => api.post('/annonces/create', data),
  update: (id, data) => api.put(`/annonces/${id}`, data),
  delete: (id) => api.delete(`/annonces/${id}`),
};

export default api;
