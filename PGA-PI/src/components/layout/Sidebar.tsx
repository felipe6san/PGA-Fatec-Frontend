import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoImage, logoMini } from "@/assets";
import { useAuth } from "../../hooks/useAuth";
import { 
  Home, 
  ClipboardList, 
  PlusCircle, 
  Settings, 
  LogOut,
} from "lucide-react";
import { Tooltip } from "../ui/tooltip";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/projects", label: "Projetos", icon: ClipboardList },
  { path: "/add-project", label: "Adicionar Projeto", icon: PlusCircle },
  { path: "/settings", label: "Configurações", icon: Settings },
];

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

export const Sidebar = ({ isExpanded, toggleSidebar }: SidebarProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };
  
  return (
    <>
      {/* Overlay para mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out z-50
          ${isExpanded ? "w-64" : "w-24"}
          ${!isExpanded ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo e cabeçalho */}
          <div className="p-6">
            <div className="flex items-center justify-center mb-8">
              <img 
                src={isExpanded ? logoImage : logoMini}
                alt="Fatec Votorantim" 
                className={`transition-all duration-300 ${
                  isExpanded ? "w-40" : "w-16"  // Aumentado de w-12 para w-16
                }`}
              />
            </div>
            
            {isExpanded && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-700">PGA 2025</h3>
                  <p className="text-sm text-gray-500">Bem-vindo, {user?.nome}</p>
                </div>
              </div>
            )}
          </div>

          {/* Menu de navegação com tooltips */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <Tooltip 
                key={item.path}
                content={item.label}
                show={!isExpanded}
              >
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors
                    ${location.pathname === item.path
                      ? "bg-[#ae0f0a] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                    }
                    ${!isExpanded && "justify-center"}
                  `}
                >
                  <item.icon className={`${isExpanded ? "mr-3" : ""} h-6 w-6`} /> {/* Aumentado de h-5 w-5 para h-6 w-6 */}
                  {isExpanded && <span>{item.label}</span>}
                </button>
              </Tooltip>
            ))}
          </nav>

          {/* Footer com tooltip no botão de sair */}
          <div className="p-4 border-t border-gray-200">
            <Tooltip 
              content="Sair"
              show={!isExpanded}
            >
              <button
                onClick={logout}
                className={`flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors
                  ${!isExpanded && "justify-center"}
                `}
              >
                <LogOut className={`${isExpanded ? "mr-3" : ""} h-6 w-6`} /> {/* Aumentado de h-5 w-5 para h-6 w-6 */}
                {isExpanded && <span>Sair</span>}
              </button>
            </Tooltip>
          </div>
        </div>
      </aside>
    </>
  );
};