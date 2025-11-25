import { useState, useEffect } from 'react';
import { getMovieDetails } from '../utils/api';
import type { IMovieDetails } from '../types/movie';

const cache = new Map<number, { data: IMovieDetails; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000;

export const useMovieDetails = (id: number) => {
  const [movie, setMovie] = useState<IMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const cached = cache.get(id);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setMovie(cached.data);
        setLoading(false);
        return;
      }

      try {
        const data = await getMovieDetails(id);
        cache.set(id, { data, timestamp: Date.now() });
        setMovie(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch movie details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  return { movie, loading, error };
};
