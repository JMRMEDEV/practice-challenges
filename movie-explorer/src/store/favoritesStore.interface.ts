import type { IMovie } from '../types/movie';

export interface IFavoritesState {
  /** Array representing the movies a user has marked as favorite */
  favorites: IMovie[];
  /** Adds a movie to the favorites list */
  addFavorite: (_movie: IMovie) => void;
  /** Removes a movie from the favorites list by ID */
  removeFavorite: (_id: number) => void;
  /** Checks if a movie is in the favorites list by ID */
  isFavorite: (_id: number) => boolean;
}
