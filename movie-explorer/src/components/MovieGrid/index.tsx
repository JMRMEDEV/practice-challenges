import type { IMovie } from '../../types/movie';
import { MovieCard } from '../MovieCard';

interface IMovieGridProps {
  /** Array of movies to display in the grid */
  movies: IMovie[];
}

export const MovieGrid = ({ movies }: IMovieGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};
