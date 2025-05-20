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
    <header className={`sticky top-0 bg-white border-b border-gray-200 h-16 z-40 transition-all duration-300`}>
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">PGA 2025</h1>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{user?.nome}</span>
          <div className="h-8 w-8 rounded-full bg-[#ae0f0a] text-white flex items-center justify-center">
            {user?.nome?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
