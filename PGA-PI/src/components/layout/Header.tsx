import { useEffect, useState, useRef, TouchEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAccessibility } from "@/hooks/useAccessibility";
import { Menu, ChevronLeft, ChevronRight, Settings, User, LogOut, Info, Plus, Minus, Contrast, Moon, Sun, Zap, ZapOff, Volume2, VolumeX, HelpCircle, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/constants";
import { Modal } from "@components/ui/modal";
import { Button } from "@components/ui/button";
import { KeyboardShortcuts, AccessibilityHelp } from "@/components/accessibility/KeyboardShortcuts";
import { type Theme } from "@/utils/theme";

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
  const {
    settings: accessibilitySettings,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast,
    setThemeMode,
    toggleReduceMotion,
    toggleSound,
    resetAllSettings,
    playSound,
    announceToScreenReader,
  } = useAccessibility();
  
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Estados para controlar a exibição dos modais
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  
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
    playSound('click');
  };

  const handleMenuItemClick = (action: string) => {
    setShowUserMenu(false);
    playSound('click');
    
    switch (action) {
      case "accessibility":
        setIsAccessibilityModalOpen(true);
        announceToScreenReader("Configurações de acessibilidade aberta");
        break;
      case "profile":
        setIsProfileModalOpen(true);
        announceToScreenReader("Modal de alteração de dados aberto");
        break;
      case "logout":
        logout();
        navigate(ROUTES.LOGIN);
        announceToScreenReader("Logout realizado com sucesso");
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
      playSound('click');
    }
    else if (isLeftSwipe && isMobile && isExpanded) {
      toggleSidebar();
      playSound('click');
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Handler para botões de acessibilidade com feedback
  const handleAccessibilityAction = (action: () => void, message: string) => {
    action();
    playSound('success');
    announceToScreenReader(message);
  };

  // Handler para mudança de tema
  const handleThemeChange = (theme: Theme) => {
    setThemeMode(theme);
    playSound('success');
    const themeNames = {
      light: 'tema claro',
      dark: 'tema escuro',
      system: 'tema do sistema'
    };
    announceToScreenReader(`${themeNames[theme]} ativado`);
  };

  // Handler para abrir modal de acessibilidade via atalho
  const handleToggleAccessibilityModal = () => {
    setIsAccessibilityModalOpen(!isAccessibilityModalOpen);
  };

  // Função para obter o ícone do tema atual
  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />;
      case 'dark':
        return <Moon className="h-5 w-5" />;
      case 'system':
        return <Monitor className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <>
      {/* Atalhos de teclado */}
      <KeyboardShortcuts onToggleAccessibilityMenu={handleToggleAccessibilityModal} />
      
      {/* Link para pular ao conteúdo principal */}
      <a
        id="skip-to-main"
        href="#main-content"
        className="skip-link"
        onFocus={() => announceToScreenReader('Link para pular ao conteúdo principal')}
      >
        Pular para conteúdo principal
      </a>

      <header 
        className={`sticky top-0 bg-white border-b border-gray-200 h-16 z-40 transition-all duration-300 ${showHeader ? 'transform-none' : '-translate-y-full'} ${!isMobile && isExpanded ? 'ml-60' : 'ml-20'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="banner"
        aria-label="Cabeçalho principal"
      >
        <div className="h-full px-2 sm:px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => {
                toggleSidebar();
                playSound('click');
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors accessibility-focus"
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
              className="h-8 w-8 rounded-full bg-[#ae0f0a] text-white flex items-center justify-center cursor-pointer hover:bg-[#8e0c08] transition-colors flex-shrink-0 accessibility-focus"
              onClick={handleUserMenuClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleUserMenuClick();
                }
              }}
              tabIndex={0}
              role="button"
              aria-haspopup="true"
              aria-expanded={showUserMenu}
              aria-label={`Menu do usuário ${user?.nome}`}
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
                  onClick={() => handleMenuItemClick('accessibility')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left accessibility-focus"
                  role="menuitem"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Acessibilidade
                </button>
                <button
                  onClick={() => handleMenuItemClick('profile')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left accessibility-focus"
                  role="menuitem"
                >
                  <User className="h-4 w-4 mr-2" />
                  Alterar Dados
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => handleMenuItemClick('logout')}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left accessibility-focus"
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

      {/* Modal de Acessibilidade */}
      <Modal
        isOpen={isAccessibilityModalOpen}
        onClose={() => {
          setIsAccessibilityModalOpen(false);
          announceToScreenReader("Configurações de acessibilidade fechadas");
        }}
        title="Configurações de Acessibilidade"
        className="max-w-[95%] md:max-w-lg mx-auto"
      >
        <div className="space-y-6">
          {/* Botão de Ajuda */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Configure as opções para melhorar sua experiência</span>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors accessibility-focus"
              aria-label="Mostrar/esconder ajuda de atalhos"
              aria-pressed={showHelp}
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>

          {/* Seção de Ajuda */}
          {showHelp && (
            <div className="mb-4">
              <AccessibilityHelp />
            </div>
          )}

          {/* Tamanho da Fonte */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Tamanho da Fonte</h3>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <span className="text-sm text-gray-700">Atual: {accessibilitySettings.fontSize}px</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleAccessibilityAction(decreaseFontSize, `Fonte diminuída para ${accessibilitySettings.fontSize - 2}px`)}
                  disabled={accessibilitySettings.fontSize <= 12}
                  className="p-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors accessibility-focus"
                  aria-label="Diminuir fonte (Alt + -)"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleAccessibilityAction(resetFontSize, "Fonte restaurada para tamanho padrão")}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm transition-colors accessibility-focus"
                  aria-label="Restaurar fonte padrão (Alt + 0)"
                >
                  Padrão
                </button>
                <button
                  onClick={() => handleAccessibilityAction(increaseFontSize, `Fonte aumentada para ${accessibilitySettings.fontSize + 2}px`)}
                  disabled={accessibilitySettings.fontSize >= 24}
                  className="p-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors accessibility-focus"
                  aria-label="Aumentar fonte (Alt + +)"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Contraste e Tema */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Contraste e Tema</h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleAccessibilityAction(
                  toggleHighContrast, 
                  accessibilitySettings.highContrast ? "Alto contraste desativado" : "Alto contraste ativado"
                )}
                className={`accessibility-toggle flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  accessibilitySettings.highContrast 
                    ? 'border-[#ae0f0a] bg-[#ae0f0a]/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-pressed={accessibilitySettings.highContrast}
                aria-label="Alternar alto contraste (Alt + C)"
              >
                <div className="flex items-center space-x-3">
                  <Contrast className="h-5 w-5" />
                  <span className="font-medium">Alto Contraste</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  accessibilitySettings.highContrast ? 'bg-[#ae0f0a]' : 'bg-gray-300'
                }`} aria-hidden="true">
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${
                    accessibilitySettings.highContrast ? 'translate-x-6 ml-1' : 'translate-x-0 ml-0.5'
                  }`}></div>
                </div>
              </button>

              {/* Seletor de Tema */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tema da Interface</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'dark', 'system'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleThemeChange(theme)}
                      className={`accessibility-toggle flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                        accessibilitySettings.theme === theme
                          ? 'border-[#ae0f0a] bg-[#ae0f0a]/10' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-pressed={accessibilitySettings.theme === theme}
                      aria-label={`Selecionar ${theme === 'light' ? 'tema claro' : theme === 'dark' ? 'tema escuro' : 'tema do sistema'}`}
                    >
                      <div className="mb-2">
                        {getThemeIcon(theme)}
                      </div>
                      <span className="text-xs font-medium capitalize">
                        {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Sistema'}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {accessibilitySettings.theme === 'system' 
                    ? 'Segue a preferência do seu dispositivo'
                    : `Tema ${accessibilitySettings.theme === 'light' ? 'claro' : 'escuro'} ativo`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Configurações de Movimento e Som */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Movimento e Som</h3>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => handleAccessibilityAction(
                  toggleReduceMotion, 
                  accessibilitySettings.reduceMotion ? "Animações reativadas" : "Animações reduzidas"
                )}
                className={`accessibility-toggle flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  accessibilitySettings.reduceMotion 
                    ? 'border-[#ae0f0a] bg-[#ae0f0a]/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-pressed={accessibilitySettings.reduceMotion}
                aria-label="Alternar redução de movimento (Alt + M)"
              >
                <div className="flex items-center space-x-3">
                  {accessibilitySettings.reduceMotion ? <ZapOff className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                  <span className="font-medium">Reduzir Animações</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  accessibilitySettings.reduceMotion ? 'bg-[#ae0f0a]' : 'bg-gray-300'
                }`} aria-hidden="true">
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${
                    accessibilitySettings.reduceMotion ? 'translate-x-6 ml-1' : 'translate-x-0 ml-0.5'
                  }`}></div>
                </div>
              </button>

              <button
                onClick={() => handleAccessibilityAction(
                  toggleSound, 
                  accessibilitySettings.soundEnabled ? "Sons do sistema desativados" : "Sons do sistema ativados"
                )}
                className={`accessibility-toggle flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  accessibilitySettings.soundEnabled 
                    ? 'border-[#ae0f0a] bg-[#ae0f0a]/10' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-pressed={accessibilitySettings.soundEnabled}
              >
                <div className="flex items-center space-x-3">
                  {accessibilitySettings.soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  <span className="font-medium">Sons do Sistema</span>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  accessibilitySettings.soundEnabled ? 'bg-[#ae0f0a]' : 'bg-gray-300'
                }`} aria-hidden="true">
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${
                    accessibilitySettings.soundEnabled ? 'translate-x-6 ml-1' : 'translate-x-0 ml-0.5'
                  }`}></div>
                </div>
              </button>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={() => handleAccessibilityAction(resetAllSettings, "Todas as configurações de acessibilidade foram restauradas")}
              className="flex-1 h-[48px] px-4 bg-gray-500 hover:bg-gray-600 rounded-lg font-['Source_Sans_3',Helvetica] font-medium text-white transition-colors duration-200 accessibility-focus"
            >
              Restaurar Padrão
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsAccessibilityModalOpen(false);
                playSound('success');
                announceToScreenReader("Configurações de acessibilidade salvas e modal fechado");
              }}
              className="flex-1 h-[48px] px-4 bg-[#ae0f0a] hover:bg-[#8e0c08] rounded-lg font-['Source_Sans_3',Helvetica] font-medium text-white transition-colors duration-200 accessibility-focus"
            >
              Salvar e Fechar
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
              className="h-[57px] px-6 bg-[#ae0f0a] hover:bg-[#8e0c08] rounded-lg font-['Source_Sans_3',Helvetica] font-bold text-white text-lg transition-colors duration-200 accessibility-focus"
            >
              Entendi
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
