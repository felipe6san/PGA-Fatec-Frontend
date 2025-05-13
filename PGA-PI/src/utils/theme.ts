// Utilitários relacionados ao tema da aplicação

/**
 * Tipo de tema
 */
export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'app-theme';

/**
 * Obtém o tema atual
 */
export const getTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  return (localStorage.getItem(THEME_KEY) as Theme) || 'light';
};

/**
 * Define o tema atual
 */
export const setTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;
  
  // Salva o tema no localStorage
  localStorage.setItem(THEME_KEY, theme);
  
  // Aplica a classe no elemento HTML
  const root = window.document.documentElement;
  
  root.classList.remove('light', 'dark');
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

/**
 * Alterna entre temas light e dark
 */
export const toggleTheme = (): void => {
  const currentTheme = getTheme();
  
  if (currentTheme === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}; 