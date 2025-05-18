import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";

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
  const { user } = useAuth();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <header
      className={`sticky top-0 bg-white border-b border-gray-200 h-16 z-40 transition-transform duration-300
        ${!showHeader && isMobile ? "-translate-y-full" : "translate-y-0"}
        ${isExpanded ? "md:ml-0" : "md:ml-20"}
      `}
    >
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Botão mobile */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>

          {/* Botão desktop com setas */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors hidden md:flex items-center justify-center"
          >
            {isExpanded ? (
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            ) : (
              <ChevronRight className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Info do usuário */}
        <div className="flex items-center space-x-4">
          <span className="hidden md:inline text-sm font-medium text-gray-700">
            {user?.nome}
          </span>
          <div className="h-8 w-8 rounded-full bg-[#ae0f0a] text-white flex items-center justify-center font-medium">
            {user?.nome?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
