import { createContext, useContext } from "react";
import { UserData } from "../features/auth/services/authService";

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

export const useAuth = () => useContext(AuthContext);