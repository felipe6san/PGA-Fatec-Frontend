import axios from 'axios';
import { API_URL, BASE_ROUTE } from '@lib/config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o access token expirou, tenta renovar via refresh token (cookie)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login') &&
      !window.location.pathname.includes('/login')
    ) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch {
        localStorage.removeItem('userData');
        window.location.href = `${BASE_ROUTE}login`;
      }
    }

    return Promise.reject(error);
  }
);

export default api;