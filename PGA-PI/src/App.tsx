import { Router } from "@routes/index";
import { AuthProvider } from "@context/AuthContext";

export const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};