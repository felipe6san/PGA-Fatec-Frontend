import { ReactNode, useEffect, useState, useRef, TouchEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Menu, ChevronLeft, ChevronRight, Settings, User, LogOut, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { Modal } from "@components/ui/modal";
import { Button } from "@components/ui/button";

interface HeaderProps {
  toggleSidebar: () => void;
  isMobile?: boolean;
  isExpanded: boolean;
}

export const Header = ({
  toggleSidebar,
  isMobile = false,
  isExpanded,
}: HeaderProps): JSX.Element => {
  const { user, logout } = useAuth();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Estados para controlar a exibição dos modais
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Estados para controlar o gesto de swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Fecha o menu quando clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      // Em desktop, sempre mostra o header
      if (window.innerWidth >= 768) {
        setShowHeader(true);
        return;
      }

      // Em mobile, esconde quando rola para baixo
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleMenuItemClick = (action: string) => {
    setShowUserMenu(false);
    
    switch (action) {
      case "preferences":
        setIsPreferencesModalOpen(true);
        break;
      case "profile":
        setIsProfileModalOpen(true);
        break;
      case "logout":
        logout();
        navigate(ROUTES.LOGIN);
        break;
      default:
        break;
    }
  };

  // Handlers para gesto de swipe
  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isRightSwipe && isMobile && !isExpanded) {
      toggleSidebar();
    }
    else if (isLeftSwipe && isMobile && isExpanded) {
      toggleSidebar();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <>
      <header 
        className={`sticky top-0 bg-white border-b border-gray-200 h-16 z-40 transition-all duration-300 ${showHeader ? 'transform-none' : '-translate-y-full'} ${!isMobile && isExpanded ? 'ml-60' : 'ml-20'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="h-full px-2 sm:px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isMobile ? "Toggle mobile menu" : (isExpanded ? "Recolher menu" : "Expandir menu")}
            >
              {isMobile ? (
                <Menu className="h-5 w-5 text-gray-700" />
              ) : isExpanded ? (
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-700" />
              )}
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">PGA 2025</h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 relative">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline-block truncate max-w-[100px] md:max-w-none">
              {user?.nome}
            </span>
            <div 
              className="h-8 w-8 rounded-full bg-[#ae0f0a] text-white flex items-center justify-center cursor-pointer hover:bg-[#8e0c08] transition-colors flex-shrink-0"
              onClick={handleUserMenuClick}
              aria-haspopup="true"
              aria-expanded={showUserMenu}
            >
              {user?.nome?.charAt(0).toUpperCase()}
            </div>

            {/* Menu flutuante do usuário */}
            {showUserMenu && (
              <div 
                ref={userMenuRef}
                className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                {/* Mostrar o nome do usuário apenas no menu em mobile */}
                {isMobile && (
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    {user?.nome}
                  </div>
                )}
                <button
                  onClick={() => handleMenuItemClick('preferences')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Preferências
                </button>
                <button
                  onClick={() => handleMenuItemClick('profile')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  <User className="h-4 w-4 mr-2" />
                  Alterar Dados
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleMenuItemClick('logout')}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                  role="menuitem"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Preferências */}
      <Modal
        isOpen={isPreferencesModalOpen}
        onClose={() => setIsPreferencesModalOpen(false)}
        title="Preferências do Usuário"
        className="max-w-[90%] md:max-w-md mx-auto"
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <Info className="w-16 h-16 text-[#ae0f0a]" />
            <p className="text-lg font-['Source_Sans_3',Helvetica] text-gray-700">
              A personalização de preferências do usuário será implementada em uma versão futura!
            </p>
            <Button
              type="button"
              onClick={() => setIsPreferencesModalOpen(false)}
              className="h-[57px] px-6 bg-[#ae0f0a] hover:bg-[#8e0c08] rounded-lg font-['Source_Sans_3',Helvetica] font-bold text-white text-lg transition-colors duration-200"
            >
              Entendi
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Alteração de Dados */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Alteração de Dados"
        className="max-w-[90%] md:max-w-md mx-auto"
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <Info className="w-16 h-16 text-[#ae0f0a]" />
            <p className="text-lg font-['Source_Sans_3',Helvetica] text-gray-700">
              A funcionalidade de alteração de dados pessoais será implementada em uma versão futura!
            </p>
            <Button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="h-[57px] px-6 bg-[#ae0f0a] hover:bg-[#8e0c08] rounded-lg font-['Source_Sans_3',Helvetica] font-bold text-white text-lg transition-colors duration-200"
            >
              Entendi
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
