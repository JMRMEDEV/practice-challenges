import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MdFavorite,
  MdFavoriteBorder,
  MdArrowBack,
  MdStar,
} from 'react-icons/md';
import { useMovieDetails } from '../../hooks/useMovieDetails';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useThemeStore } from '../../store/themeStore';
import { getImageUrl } from '../../utils/api';
import { Loader } from '../Loader';
import { ErrorMessage } from '../ErrorMessage';
import { ImageSkeleton } from '../ImageSkeleton';
import { BackdropSkeleton } from '../BackdropSkeleton';
import { Badge } from '../Badge';

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { movie, loading, error } = useMovieDetails(Number(id));
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const { isDark } = useThemeStore();
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);

  if (loading) return <Loader />;
  if (error || !movie)
    return <ErrorMessage message={error || 'Movie not found'} />;

  const favorite = isFavorite(movie.id);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="relative h-96 md:h-[500px]">
        {!backdropLoaded && <BackdropSkeleton />}
        <img
          src={getImageUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className={`w-full h-full object-cover ${backdropLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setBackdropLoaded(true)}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-slate-900 via-slate-900/60' : 'from-gray-50 via-gray-50/60'} to-transparent`}
        />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="relative w-64">
            {!posterLoaded && (
              <ImageSkeleton className="w-64 h-96 rounded-lg" />
            )}
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-64 rounded-lg shadow-2xl"
              onLoad={() => setPosterLoaded(true)}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1
                  className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}
                >
                  {movie.title}
                </h1>
                <div
                  className={`flex items-center gap-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  <span>{movie.release_date?.split('-')[0]}</span>
                  <span>•</span>
                  <span>{movie.runtime} min</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-yellow-500">
                    <MdStar /> {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  favorite ? removeFavorite(movie.id) : addFavorite(movie)
                }
                className={`p-3 rounded-full ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-200 hover:bg-gray-300'} transition`}
              >
                {favorite ? (
                  <MdFavorite className="w-8 h-8 text-red-500" />
                ) : (
                  <MdFavoriteBorder className="w-8 h-8" />
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <Badge key={genre.id}>{genre.name}</Badge>
              ))}
            </div>

            <div className="mb-6">
              <h2
                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}
              >
                Overview
              </h2>
              <p
                className={`${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}
              >
                {movie.overview}
              </p>
            </div>

            <Link
              to="/"
              className={`inline-flex items-center gap-2 px-6 py-3 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition`}
            >
              <MdArrowBack /> Back to Movies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
