import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@components/layout/Layout";
import { Login } from "@features/auth/pages/Login";
import { Home } from "@features/dashboard/pages/Home";
import { ResetPassword } from "@features/auth/pages/ResetPassword";
import { Projects } from "@features/projects/pages/Projects";
import { AddProject } from "@features/projects/pages/AddProject";
import { Settings } from "@features/settings/pages/Settings";
import { useAuth } from "@hooks/useAuth";
import { SelectAnexo } from "@features/projects/pages/SelectAnexo";
import { SelectSubAnexo } from "@features/projects/pages/SelectSubAnexo";
import { SelectProjectType } from "@features/projects/pages/SelectProjectType";

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
        <Route path="dashboard" element={<Home />} />

        {/* Rotas de visualização de projetos */}
        <Route path="projects">
          <Route index element={<SelectAnexo />} />
          <Route path="anexo/:anexoId" element={<SelectSubAnexo />} />
          <Route path="anexo/:anexoId/:subId" element={<Projects />} />
        </Route>

        {/* Rotas de criação de projetos */}
        <Route path="projects/new">
          <Route index element={<SelectAnexo />} />
          <Route path="anexo/:anexoId" element={<SelectSubAnexo />} />
          <Route path="anexo/:anexoId/:subId" element={<SelectProjectType />} />
          <Route path="anexo/:anexoId/:subId/:type" element={<AddProject />} />
        </Route>

        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
      />
    </Routes>
  );
};
