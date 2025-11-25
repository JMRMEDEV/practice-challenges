export interface IThemeState {
  /** Indicates whether dark mode is enabled */
  isDark: boolean;
  /** Toggles between dark and light theme */
  toggleTheme: () => void;
}
