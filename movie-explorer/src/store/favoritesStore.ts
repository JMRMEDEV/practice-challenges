import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IFavoritesState } from './favoritesStore.interface';

export const useFavoritesStore = create<IFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (movie) => set({ favorites: [...get().favorites, movie] }),
      removeFavorite: (id) =>
        set({ favorites: get().favorites.filter((m) => m.id !== id) }),
      isFavorite: (id) => get().favorites.some((m) => m.id === id),
    }),
    { name: 'movie-favorites' }
  )
);
