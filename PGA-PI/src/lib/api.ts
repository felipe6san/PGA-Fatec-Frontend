import axios from 'axios';
import { API_URL, BASE_ROUTE } from '@lib/config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT em todas as requisições autenticadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && 
        !window.location.pathname.includes('/login')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userData');
      window.location.href = `${BASE_ROUTE}login`;
    }
    return Promise.reject(error);
  }
);

export default api;