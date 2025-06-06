import { Router } from "@routes/index";
import { AuthProvider } from "@context/AuthContext";
import { Toaster } from "./components/ui/toaster";

export const App = (): JSX.Element => {
  return (
    <AuthProvider>
      <div className="App">
        <Router />
        <Toaster />
      </div>
    </AuthProvider>
  );
};