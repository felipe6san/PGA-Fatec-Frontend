import api from '../../../lib/api';
import { API_ENDPOINTS } from '../../../lib/config';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface UserData {
  pessoa_id: number;
  email: string;
  nome: string;
}

export interface LoginResponse {
  access_token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<UserData> {
    try {
      const response = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, credentials);
      
      // Armazenar token JWT
      const { access_token } = response.data;
      localStorage.setItem('accessToken', access_token);
      
      // Decodificar o token para obter dados do usuário
      const userData = parseJwt(access_token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('Erro durante o login:', error);
      throw error;
    }
  },
  
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
  
  getCurrentUser(): UserData | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }
};

// Função auxiliar para decodificar o token JWT
function parseJwt(token: string): UserData {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Erro ao decodificar token JWT:', e);
    return { pessoa_id: 0, email: '', nome: '' };
  }
} 