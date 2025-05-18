import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const Layout = (): JSX.Element => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Detecta se é mobile
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setIsSidebarExpanded(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && isSidebarExpanded) {
      setIsSidebarExpanded(false);
    } else if (isRightSwipe && !isSidebarExpanded) {
      setIsSidebarExpanded(true);
    }

    setTouchEnd(null);
    setTouchStart(null);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div 
      className="flex h-screen bg-gray-50 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        toggleSidebar={toggleSidebar}
      />
      
      {/* Ajustado as margens aqui */}
      <div className={`flex flex-col flex-1 transition-all duration-300
        ${isSidebarExpanded ? "md:ml-[16rem]" : "md:ml-[5rem]"}`}
      >
        <Header 
          toggleSidebar={toggleSidebar} 
          isMobile={isMobile}
          isExpanded={isSidebarExpanded}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 md:px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};