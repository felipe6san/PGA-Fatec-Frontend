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

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
}

export const Sidebar = ({ isExpanded, toggleSidebar }: SidebarProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    {
      label: "Visão Geral",
      path: "/dashboard",
      icon: Home,
    },
    {
      label: "Projetos",
      path: "/projects",
      icon: ClipboardList,
      subItems: [
        { 
          label: "Anexo 1", 
          path: "/projects/anexo/1",
          subItems: [
            { label: "Anexo 1.1", path: "/projects/anexo/1/1" },
            { label: "Anexo 1.2", path: "/projects/anexo/1/2" },
            { label: "Anexo 1.3", path: "/projects/anexo/1/3" }
          ]
        },
        { 
          label: "Anexo 2", 
          path: "/projects/anexo/2",
          subItems: [
            { label: "Anexo 2.1", path: "/projects/anexo/2/1" },
            { label: "Anexo 2.2", path: "/projects/anexo/2/2" },
            { label: "Anexo 2.3", path: "/projects/anexo/2/3" }
          ]
        },
        { 
          label: "Anexo 3", 
          path: "/projects/anexo/3",
          subItems: [
            { label: "Anexo 3.1", path: "/projects/anexo/3/1" },
            { label: "Anexo 3.2", path: "/projects/anexo/3/2" },
            { label: "Anexo 3.3", path: "/projects/anexo/3/3" }
          ]
        },
        { 
          label: "Anexo 4", 
          path: "/projects/anexo/4",
          subItems: [
            { label: "Anexo 4.1", path: "/projects/anexo/4/1" },
            { label: "Anexo 4.2", path: "/projects/anexo/4/2" },
            { label: "Anexo 4.3", path: "/projects/anexo/4/3" }
          ]
        },
        { 
          label: "Anexo 5", 
          path: "/projects/anexo/5",
          subItems: [
            { label: "Anexo 5.1", path: "/projects/anexo/5/1" },
            { label: "Anexo 5.2", path: "/projects/anexo/5/2" },
            { label: "Anexo 5.3", path: "/projects/anexo/5/3" }
          ]
        },
        { 
          label: "Anexo 6", 
          path: "/projects/anexo/6",
          subItems: [
            { label: "Anexo 6.1", path: "/projects/anexo/6/1" },
            { label: "Anexo 6.2", path: "/projects/anexo/6/2" },
            { label: "Anexo 6.3", path: "/projects/anexo/6/3" }
          ]
        }
      ]
    },
    {
      label: "Adicionar Projeto",
      path: "/projects/new",
      icon: PlusCircle,
    },
    {
      label: "Configurações",
      path: "/settings",
      icon: Settings,
    }
  ];

  // Previne o comportamento padrão e navega programaticamente
  const handleNavigation = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  // Renderiza os subitens quando o item pai está expandido
  const renderSubItems = (item: any) => {
    if (!isExpanded || !item.subItems) return null;

    return (
      <div className="pl-8 mt-1 space-y-1">
        {item.subItems.map((subItem: any) => (
          <button
            key={subItem.path}
            onClick={(e) => handleNavigation(e, subItem.path)}
            className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors
              ${location.pathname === subItem.path
                ? "bg-[#ae0f0a]/10 text-[#ae0f0a]"
                : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            {subItem.label}
          </button>
        ))}
      </div>
    );
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
              <div key={item.path}>
                <Tooltip 
                  content={item.label}
                  show={!isExpanded}
                >
                  <button
                    onClick={(e) => handleNavigation(e, item.path)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors
                      ${location.pathname === item.path
                        ? "bg-[#ae0f0a] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                      }
                      ${!isExpanded && "justify-center"}
                    `}
                  >
                    <item.icon className={`${isExpanded ? "mr-3" : ""} h-6 w-6`} />
                    {isExpanded && <span>{item.label}</span>}
                  </button>
                </Tooltip>
                {renderSubItems(item)}
              </div>
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