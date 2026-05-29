import { useState, useEffect, useCallback } from 'react';
import { getTheme, setTheme, type Theme } from '@/utils/theme';

export interface AccessibilitySettings {
  fontSize: number;
  highContrast: boolean;
  theme: Theme;
  reduceMotion: boolean;
  soundEnabled: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 16,
  highContrast: false,
  theme: 'light',
  reduceMotion: false,
  soundEnabled: true,
};

const STORAGE_KEY = 'accessibility-settings';

export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsedSettings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
      
      // Sincronizar com o tema atual do sistema
      const currentTheme = getTheme();
      return {
        ...parsedSettings,
        theme: currentTheme,
      };
    } catch {
      return {
        ...DEFAULT_SETTINGS,
        theme: getTheme(),
      };
    }
  });

  // Aplicar configurações no DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar tamanho da fonte
    root.style.fontSize = `${settings.fontSize}px`;
    
    // Aplicar classes de acessibilidade (exceto tema, que já é gerenciado pelo sistema existente)
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('reduce-motion', settings.reduceMotion);
    
    // Usar o sistema de tema existente
    setTheme(settings.theme);
    
    // Salvar no localStorage (excluindo tema que já é gerenciado separadamente)
    try {
      const settingsToSave = { ...settings };
      delete (settingsToSave as any).theme; // Não salvar tema aqui, pois já é gerenciado pelo sistema existente
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (error) {
      console.warn('Não foi possível salvar configurações de acessibilidade:', error);
    }
  }, [settings]);

  // Detectar preferências do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches && !settings.reduceMotion) {
        updateSettings({ reduceMotion: true });
      }
    };

    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      // Só atualizar se o tema estiver configurado como 'system'
      if (settings.theme === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleReducedMotionChange);
    colorSchemeQuery.addEventListener('change', handleColorSchemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotionChange);
      colorSchemeQuery.removeEventListener('change', handleColorSchemeChange);
    };
  }, [settings]);

  // Sincronizar com mudanças externas do tema
  useEffect(() => {
    const checkThemeChange = () => {
      const currentTheme = getTheme();
      if (currentTheme !== settings.theme) {
        // Re-ler todos os settings do localStorage para não sobrescrever
        // valores definidos por outra instância do hook (ex: KeyboardShortcuts)
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          const savedSettings = saved ? JSON.parse(saved) : {};
          setSettings(prev => ({ ...prev, ...savedSettings, theme: currentTheme }));
        } catch {
          setSettings(prev => ({ ...prev, theme: currentTheme }));
        }
      }
    };

    // Verificar mudanças no tema a cada segundo (pode ser otimizado com mutation observer se necessário)
    const interval = setInterval(checkThemeChange, 1000);
    
    return () => clearInterval(interval);
  }, [settings.theme]);

  const updateSettings = useCallback((newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const increaseFontSize = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + 2, 24)
    }));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - 2, 12)
    }));
  }, []);

  const resetFontSize = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      fontSize: 16
    }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newTheme: Theme = settings.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setSettings(prev => ({
      ...prev,
      theme: newTheme
    }));
  }, [settings.theme]);

  const setThemeMode = useCallback((theme: Theme) => {
    setTheme(theme);
    setSettings(prev => ({
      ...prev,
      theme
    }));
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      reduceMotion: !prev.reduceMotion
    }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      soundEnabled: !prev.soundEnabled
    }));
  }, []);

  const resetAllSettings = useCallback(() => {
    const defaultWithCurrentTheme = {
      ...DEFAULT_SETTINGS,
      theme: getTheme(), // Manter o tema atual
    };
    setSettings(defaultWithCurrentTheme);
    
    // Aplicar configurações padrão mas manter o tema
    const root = document.documentElement;
    root.style.fontSize = '16px';
    root.classList.remove('high-contrast', 'reduce-motion');
  }, []);

  const playSound = useCallback((soundType: 'success' | 'error' | 'click' = 'click') => {
    if (!settings.soundEnabled) return;

    // Simular som com Web Audio API ou AudioContext
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Diferentes frequências para diferentes tipos de som
      const frequencies = {
        click: 800,
        success: 1000,
        error: 400
      };

      oscillator.frequency.setValueAtTime(frequencies[soundType], audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.warn('Não foi possível reproduzir som:', error);
    }
  }, [settings.soundEnabled]);

  // Função para anunciar mudanças para leitores de tela
  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return {
    settings,
    updateSettings,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast,
    toggleDarkMode,
    setThemeMode,
    toggleReduceMotion,
    toggleSound,
    resetAllSettings,
    playSound,
    announceToScreenReader,
  };
}; 