import { createContext, useContext } from "react";

type User = {
  username: string;
} | null;

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);