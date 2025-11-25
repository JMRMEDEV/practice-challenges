import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useThemeStore } from '../../store/themeStore';
import { getImageUrl } from '../../utils/api';
import type { IMovie } from '../../types/movie';

interface IMovieCardProps {
  /** Movie object containing all movie details to display */
  movie: IMovie;
}

export const MovieCard = ({ movie }: IMovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { isDark } = useThemeStore();
  const favorite = isFavorite(movie.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    favorite ? removeFavorite(movie.id) : addFavorite(movie);
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      className={`group relative block overflow-hidden rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-200'} transition hover:scale-105`}
    >
      {!imageLoaded && (
        <div className="h-96 w-full animate-pulse bg-gradient-to-br from-slate-700 to-slate-600" />
      )}
      <img
        src={getImageUrl(movie.poster_path)}
        alt={movie.title}
        className={`h-96 w-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition group-hover:opacity-100">
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-lg font-bold text-white mb-1">{movie.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-yellow-400">
              ★ {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-sm text-gray-300">
              {movie.release_date?.split('-')[0]}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 p-2 rounded-full bg-black/60 hover:bg-black/80 transition z-10"
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {favorite ? (
          <MdFavorite className="w-6 h-6 text-red-500" />
        ) : (
          <MdFavoriteBorder className="w-6 h-6 text-white" />
        )}
      </button>
    </Link>
  );
};
