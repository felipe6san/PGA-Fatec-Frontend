import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@components/layout/Layout";
import { Login } from "@features/auth/pages/Login";
import { Home } from "@features/dashboard/pages/Home";
import { ResetPassword } from "@features/auth/pages/ResetPassword";
import { Projects } from "@features/projects/pages/Projects";
import { AddProject } from "@features/projects/pages/AddProject";
import { Settings } from "@features/settings/pages/Settings";
import { useAuth } from "@hooks/useAuth";
import { BASE_ROUTE } from "@lib/config";
import { ROUTES } from "@utils/constants";

// Componente para rotas protegidas
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export const Router = (): JSX.Element => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path={`${BASE_ROUTE}login`}
        element={isAuthenticated ? <Navigate to={ROUTES.HOME} replace /> : <Login />}
      />

      <Route path={`${BASE_ROUTE}reset-password`} element={<ResetPassword />} />

      <Route
        path={BASE_ROUTE}
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path={`${BASE_ROUTE}projects`} element={<Projects />} />
        <Route path={`${BASE_ROUTE}add-project`} element={<AddProject />} />
        <Route path={`${BASE_ROUTE}settings`} element={<Settings />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? ROUTES.HOME : ROUTES.LOGIN} />}
      />
    </Routes>
  );
};
