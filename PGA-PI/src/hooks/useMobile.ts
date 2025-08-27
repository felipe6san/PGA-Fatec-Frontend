import { useState, useEffect } from 'react';

interface MobileInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'landscape' | 'portrait';
  isTouchDevice: boolean;
  isHighDensity: boolean;
}

export const useMobile = (): MobileInfo => {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLandscape: false,
    isPortrait: false,
    screenWidth: 0,
    screenHeight: 0,
    orientation: 'portrait',
    isTouchDevice: false,
    isHighDensity: false,
  });

  useEffect(() => {
    const updateMobileInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Detectar tipo de dispositivo
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      
      // Detectar orientação
      const isLandscape = width > height;
      const isPortrait = height > width;
      const orientation = isLandscape ? 'landscape' : 'portrait';
      
      // Detectar dispositivo touch
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Detectar tela de alta densidade
      const isHighDensity = window.devicePixelRatio > 1;
      
      setMobileInfo({
        isMobile,
        isTablet,
        isDesktop,
        isLandscape,
        isPortrait,
        screenWidth: width,
        screenHeight: height,
        orientation,
        isTouchDevice,
        isHighDensity,
      });
    };

    // Executar imediatamente
    updateMobileInfo();
    
    // Adicionar listeners
    window.addEventListener('resize', updateMobileInfo);
    window.addEventListener('orientationchange', updateMobileInfo);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateMobileInfo);
      window.removeEventListener('orientationchange', updateMobileInfo);
    };
  }, []);

  return mobileInfo;
};

// Hook específico para breakpoints
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<string>('');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setBreakpoint('xs');
      } else if (width < 768) {
        setBreakpoint('sm');
      } else if (width < 1024) {
        setBreakpoint('md');
      } else if (width < 1280) {
        setBreakpoint('lg');
      } else {
        setBreakpoint('xl');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

// Hook para detectar se está em modo PWA
export const usePWA = () => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
      const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
      
      setIsPWA(isStandalone || isFullscreen || isMinimalUI);
    };

    checkPWA();
    
    // Listener para mudanças no modo de exibição
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkPWA);
    
    return () => mediaQuery.removeEventListener('change', checkPWA);
  }, []);

  return isPWA;
};
