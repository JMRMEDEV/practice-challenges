import { useState, useEffect, useCallback, useRef } from 'react';
import { getPopularMovies, searchMovies } from '../utils/api';
import type { IMovie } from '../types/movie';

const cache = new Map<string, { data: IMovie[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

export const useMovies = (searchQuery: string) => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const fetchMovies = useCallback(async (query: string, pageNum: number) => {
    const cacheKey = `${query}-${pageNum}`;
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = query
        ? await searchMovies(query, pageNum)
        : await getPopularMovies(pageNum);

      cache.set(cacheKey, { data: response.results, timestamp: Date.now() });
      return response.results;
    } catch {
      throw new Error('Failed to fetch movies');
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      setPage(1);

      try {
        const data = await fetchMovies(searchQuery, 1);
        setMovies(data);
        setHasMore(data.length > 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, fetchMovies]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextPage = page + 1;
      const data = await fetchMovies(searchQuery, nextPage);
      setMovies((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(data.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, loading, hasMore, fetchMovies]);

  return { movies, loading, error, loadMore, hasMore };
};
