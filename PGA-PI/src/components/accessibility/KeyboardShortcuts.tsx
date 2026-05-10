import { useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface KeyboardShortcutsProps {
  onToggleAccessibilityMenu?: () => void;
}

export const KeyboardShortcuts = ({ onToggleAccessibilityMenu }: KeyboardShortcutsProps) => {
  const {
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast,
    toggleDarkMode,
    toggleReduceMotion,
    playSound,
    announceToScreenReader,
  } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar se estiver em um campo de entrada
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      // Atalhos de acessibilidade
      if (event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
        switch (event.key) {
          case 'a':
          case 'A':
            event.preventDefault();
            onToggleAccessibilityMenu?.();
            playSound('click');
            announceToScreenReader('Menu de acessibilidade ativado');
            break;
          
          case '+':
          case '=':
            event.preventDefault();
            increaseFontSize();
            playSound('success');
            announceToScreenReader('Fonte aumentada');
            break;
          
          case '-':
          case '_':
            event.preventDefault();
            decreaseFontSize();
            playSound('success');
            announceToScreenReader('Fonte diminuída');
            break;
          
          case '0':
            event.preventDefault();
            resetFontSize();
            playSound('success');
            announceToScreenReader('Fonte restaurada para tamanho padrão');
            break;
          
          case 'c':
          case 'C':
            event.preventDefault();
            toggleHighContrast();
            playSound('success');
            announceToScreenReader('Alto contraste alternado');
            break;
          
          case 'd':
          case 'D':
            event.preventDefault();
            toggleDarkMode();
            playSound('success');
            announceToScreenReader('Tema alternado');
            break;
          
          case 'm':
          case 'M':
            event.preventDefault();
            toggleReduceMotion();
            playSound('success');
            announceToScreenReader('Redução de movimento alternada');
            break;
        }
      }

      // Atalho para pular para o conteúdo principal
      if (event.key === 'Tab' && !event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey) {
        const skipLink = document.getElementById('skip-to-main');
        if (skipLink && document.activeElement === document.body) {
          event.preventDefault();
          skipLink.focus();
        }
      }

      // Escape para fechar modais/menus
      if (event.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.getAttribute('aria-expanded') === 'true') {
          activeElement.click();
          playSound('click');
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Mostrar atalhos quando Alt é pressionado
      if (event.key === 'Alt') {
        announceToScreenReader('Atalhos de acessibilidade disponíveis: Alt + A para menu, Alt + Plus para aumentar fonte, Alt + Minus para diminuir fonte, Alt + C para alto contraste, Alt + D para alternar tema');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [increaseFontSize, decreaseFontSize, resetFontSize, toggleHighContrast, toggleDarkMode, toggleReduceMotion, playSound, announceToScreenReader, onToggleAccessibilityMenu]);

  // Componente invisível - apenas gerencia atalhos
  return null;
};

// Componente para mostrar lista de atalhos
export const AccessibilityHelp = () => {
  return (
    <div className="accessibility-help text-sm text-gray-700 dark:text-gray-300">
      <ul className="space-y-2">
        <li className="flex items-center gap-3"><kbd className="bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] px-2 py-0.5 rounded text-xs font-mono min-w-[80px] text-center">Alt + A</kbd><span>Abrir acessibilidade</span></li>
        <li className="flex items-center gap-3"><kbd className="bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] px-2 py-0.5 rounded text-xs font-mono min-w-[80px] text-center">Alt + +</kbd><span>Aumentar fonte</span></li>
        <li className="flex items-center gap-3"><kbd className="bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] px-2 py-0.5 rounded text-xs font-mono min-w-[80px] text-center">Alt + -</kbd><span>Diminuir fonte</span></li>
        <li className="flex items-center gap-3"><kbd className="bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] px-2 py-0.5 rounded text-xs font-mono min-w-[80px] text-center">Alt + 0</kbd><span>Restaurar fonte</span></li>
        <li className="flex items-center gap-3"><kbd className="bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] px-2 py-0.5 rounded text-xs font-mono min-w-[80px] text-center">Alt + C</kbd><span>Alto contraste</span></li>
        <li className="flex items-center gap-3"><kbd className="bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] px-2 py-0.5 rounded text-xs font-mono min-w-[80px] text-center">Alt + D</kbd><span>Tema claro/escuro</span></li>
        <li className="flex items-center gap-3"><kbd className="bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] px-2 py-0.5 rounded text-xs font-mono min-w-[80px] text-center">Alt + M</kbd><span>Reduzir animações</span></li>
        <li className="flex items-center gap-3"><kbd className="bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] px-2 py-0.5 rounded text-xs font-mono min-w-[80px] text-center">Tab</kbd><span>Navegar elementos</span></li>
        <li className="flex items-center gap-3"><kbd className="bg-gray-100 dark:bg-[#21262d] border border-gray-300 dark:border-[#30363d] px-2 py-0.5 rounded text-xs font-mono min-w-[80px] text-center">Esc</kbd><span>Fechar modal</span></li>
      </ul>
    </div>
  );
};