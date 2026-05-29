import api from "@lib/api";
import { API_ENDPOINTS } from "@lib/config";

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface UserData {
  pessoa_id: number;
  email: string;
  nome: string;
  tipo_usuario: string;
  active_context?: { tipo: string; id?: string | null } | null;
}

export interface ContextsResponse {
  regionais?: Array<{ pessoa_id: string; nome: string }>;
  unidades?: Array<{ unidade_id: string; nome_unidade: string }>;
}

export interface SelectContextPayload {
  tipo: 'unidade' | 'regional' | 'global';
  id?: string | null;
}

/** Serviço de autenticação — tokens gerenciados por cookies HttpOnly no servidor */
export const authService = {
  async login(credentials: LoginCredentials): Promise<UserData> {
    // POST /auth/login: backend seta cookies access_token + refresh_token (HttpOnly)
    // Retorna { user: UserData }
    const response = await api.post<{ user: UserData }>(API_ENDPOINTS.LOGIN, credentials);
    return response.data.user;
  },

  async getContexts(): Promise<ContextsResponse> {
    try {
      const response = await api.get<ContextsResponse>(API_ENDPOINTS.CONTEXTS);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contexts:', error);
      return {} as ContextsResponse;
    }
  },

  async selectContext(payload: SelectContextPayload): Promise<void> {
    // POST /auth/select-context: backend atualiza cookie com novo active_context
    await api.post(API_ENDPOINTS.SELECT_CONTEXT, payload);
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch {
      // ignora erro de rede no logout
    }
    localStorage.removeItem('userData');
  },

  async isAuthenticated(): Promise<boolean> {
    try {
      await api.get(API_ENDPOINTS.ME);
      return true;
    } catch {
      return false;
    }
  },

  async getMe(): Promise<UserData | null> {
    try {
      const response = await api.get<UserData>(API_ENDPOINTS.ME);
      return response.data;
    } catch {
      return null;
    }
  },

  getCurrentUser(): UserData | null {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
};
