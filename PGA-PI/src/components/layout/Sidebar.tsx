import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { 
  Home, 
  ClipboardList, 
  PlusCircle, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/projects", label: "Projetos", icon: ClipboardList },
  { path: "/add-project", label: "Adicionar Projeto", icon: PlusCircle },
  { path: "/settings", label: "Configurações", icon: Settings },
];

// Define props for Sidebar
interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

export const Sidebar = ({ isExpanded, toggleSidebar }: SidebarProps): JSX.Element => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  return (
    <aside className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-20"}`}>
      <div className="p-6">
        <div className="flex items-center justify-center mb-8">
          <img 
            src="/fatec-votorantim-1.png" 
            alt="Fatec Votorantim" 
            className={`h-12 ${!isExpanded && "h-10"}`}
          />
        </div>
        
        <div className={`mb-6 pb-6 border-b border-gray-200 ${!isExpanded && "hidden"}`}>
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
              } ${!isExpanded && "justify-center"}`}
            >
              <item.icon className={`${isExpanded ? "mr-3" : ""} h-5 w-5`} />
              <span className={`${!isExpanded && "hidden"}`}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className={`absolute bottom-0 p-6 border-t border-gray-200 transition-all duration-300 ease-in-out ${isExpanded ? "w-64" : "w-20"}`}>
        <button
          onClick={logout}
          className={`flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 ${!isExpanded && "justify-center"}`}
        >
          <LogOut className={`${isExpanded ? "mr-3" : ""} h-5 w-5`} />
          <span className={`${!isExpanded && "hidden"}`}>{isExpanded ? "Sair" : ""}</span>
        </button>
        <button
          onClick={toggleSidebar}
          className={`flex items-center w-full px-4 py-3 mt-2 text-gray-700 rounded-lg hover:bg-gray-100 ${!isExpanded && "justify-center"}`}
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5 mr-3" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
          <span className={`${!isExpanded && "hidden"}`}>{isExpanded ? "Recolher" : ""}</span>
        </button>
      </div>
    </aside>
  );
};