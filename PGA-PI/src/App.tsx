import { useState } from "react";
import { Router } from "./Router";
import { AuthContext } from "./hooks/useAuth";

export const App = (): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  const login = (username: string, password: string) => {
    if (username && password) {
      setIsAuthenticated(true);
      setUser({ username });
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      <Router />
    </AuthContext.Provider>
  );
};