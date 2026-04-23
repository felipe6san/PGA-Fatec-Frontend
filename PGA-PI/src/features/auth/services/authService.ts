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
}

export interface LoginResponse {
  access_token: string;
  user: UserData;
}

export interface ContextsResponse {
  regionais?: Array<{ pessoa_id: number; nome: string }>;
  unidades?: Array<{ unidade_id: number; nome_unidade: string }>;
}

export interface SelectContextPayload {
  tipo: 'unidade' | 'regional' | 'global';
  id?: number | null;
}

export interface SelectContextResponse {
  access_token: string;
  refresh_token?: string;
}

/** Função de autenticação */
export const authService = {
  /** Realiza o login do usuário
   * @param credentials - Objeto com email e senha
   * @returns Promise com os dados do usuário
   */
  async login(credentials: LoginCredentials): Promise<UserData> {
    try {
      const response = await api.post<LoginResponse>(
        API_ENDPOINTS.LOGIN,
        credentials
      );

      if (response.status !== 200) {
        throw new Error("Falha na autenticação");
      }

      const data: LoginResponse = response.data;
      const access_token: string = data.access_token;

      const userData = parseJwt(access_token);
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("userData", JSON.stringify(userData));

      return data.user;
    } catch (error) {
      console.error("Erro durante o login:", error);
      throw error;
    }
  },

  async getContexts(): Promise<ContextsResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await api.get<ContextsResponse>(API_ENDPOINTS.CONTEXTS, { headers });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar contexts:', error);
      return {} as ContextsResponse;
    }
  },

  async selectContext(payload: SelectContextPayload): Promise<SelectContextResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await api.post<SelectContextResponse>(API_ENDPOINTS.SELECT_CONTEXT, payload, { headers });
      if (response.status === 200) {
        const data = response.data;
        if (data.access_token) {
          localStorage.setItem('accessToken', data.access_token);
          const userData = parseJwt(data.access_token);
          localStorage.setItem('userData', JSON.stringify(userData));
        }
      }
      return response.data;
    } catch (error) {
      console.error('Erro ao selecionar contexto:', error);
      throw error;
    }
  },

  /** Logout do usuário
   * Remove o token de acesso e os dados do usuário do armazenamento local
   */
  logout(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
  },

  /** Verifica se o usuário está autenticado
   * @returns true se o usuário estiver autenticado, false caso contrário
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  },

  /** Retorna os dados do usuário atual
   * @returns Objeto com os dados do usuário ou null se não estiver autenticado
   */
  getCurrentUser(): UserData | null {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  },
};

/** Função auxiliar para decodificar o token JWT
 * @param token - O token JWT a ser decodificado
 * @returns Objeto com os dados do usuário
 */
function parseJwt(token: string): UserData {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Erro ao decodificar token JWT:", e);
    return { pessoa_id: 0, email: "", nome: "" };
  }
}
