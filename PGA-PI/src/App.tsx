import { useEffect, useState } from "react";
import { Router } from "./Router";
import { AuthContext } from "./hooks/useAuth";
import { authService, UserData } from "./features/auth/services/authService";

export const App = (): JSX.Element => {
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
      <Router />
    </AuthContext.Provider>
  );
};