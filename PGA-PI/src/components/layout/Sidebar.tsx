import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
  { path: "/", label: "Home", icon: "🏠" },
  { path: "/projects", label: "Projetos", icon: "📋" },
  { path: "/add-project", label: "Adicionar Projeto", icon: "➕" },
  { path: "/settings", label: "Configurações", icon: "⚙️" },
];

export const Sidebar = (): JSX.Element => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/fatec-votorantim-1.png" 
            alt="Fatec Votorantim" 
            className="h-12"
          />
        </div>
        
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">PGA 2025</h3>
            <p className="text-sm text-gray-500">Bem-vindo, {user?.nome}</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 rounded-lg ${
                location.pathname === item.path
                  ? "bg-[#ae0f0a] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100"
        >
          <span className="mr-3">🚪</span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};