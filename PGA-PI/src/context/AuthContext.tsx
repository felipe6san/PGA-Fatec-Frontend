import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import { authService, UserData } from "@features/auth/services/authService";

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [user, setUser] = useState<UserData | null>(authService.getCurrentUser());
  
  useEffect(() => {
    // Verificar autenticação durante inicialização
    setIsAuthenticated(authService.isAuthenticated());
    setUser(authService.getCurrentUser());
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const userData = await authService.login({ email, senha });
      setIsAuthenticated(true);
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 