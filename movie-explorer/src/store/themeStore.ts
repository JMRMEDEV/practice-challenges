import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IThemeState } from './themeStore.interface';

export const useThemeStore = create<IThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    { name: 'theme-preference' }
  )
);
