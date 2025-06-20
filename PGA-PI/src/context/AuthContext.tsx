import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, type UserData } from '@/features/auth/services/authService';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há dados de usuário salvos
    const checkStoredAuth = () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getCurrentUser();
          console.log('Usuário carregado do localStorage:', userData);
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Limpar dados corrompidos
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // O authService.login retorna UserData diretamente
      const userData = await authService.login({ email, senha: password });
      console.log('Login realizado com:', userData);
      
      // O authService já salva no localStorage, então só precisamos atualizar o state
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Re-exportar o tipo UserData do authService
export type { UserData } from '@/features/auth/services/authService';