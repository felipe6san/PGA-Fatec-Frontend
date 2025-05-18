import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@components/layout/Layout";
import { Login } from "@features/auth/pages/Login";
import { Home } from "@features/dashboard/pages/Home";
import { ResetPassword } from "@features/auth/pages/ResetPassword";
import { Projects } from "@features/projects/pages/Projects";
import { AddProject } from "@features/projects/pages/AddProject";
import { Settings } from "@features/settings/pages/Settings";
import { useAuth } from "@hooks/useAuth";

// Componente para rotas protegidas
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const Router = (): JSX.Element => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="add-project" element={<AddProject />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
      />
    </Routes>
  );
};
