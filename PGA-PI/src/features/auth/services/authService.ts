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

export const authService = {
  async login(credentials: LoginCredentials): Promise<UserData> {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error('Falha na autenticação');
      }
      console.log('Login response:', response);
      
      const data: LoginResponse = await response.json();
      
      const userData = parseJwt(data.access_token);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      return data.user;
    } catch (error) {
      console.error('Erro durante o login:', error);
      throw error;
    }
  },
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
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