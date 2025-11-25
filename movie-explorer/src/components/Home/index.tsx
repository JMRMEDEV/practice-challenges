import { useState, useEffect, useRef, Suspense } from 'react';
import { MdSearch } from 'react-icons/md';
import { useMovies } from '../../hooks/useMovies';
import { useThemeStore } from '../../store/themeStore';
import { Header } from '../Header';
import { SearchBar } from '../SearchBar';
import { MovieGrid } from '../MovieGrid';
import { EmptyState } from '../EmptyState';
import { Loader } from '../Loader';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { movies, loading, error, loadMore, hasMore } = useMovies(searchQuery);
  const { isDark } = useThemeStore();
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div
        className={`${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg sticky top-0 z-50`}
      >
        <Header title="Movie Explorer" showThemeToggle showFavoritesLink />
        <div className="container mx-auto px-4 pt-6 pb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div
            className={`${isDark ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-red-100 border-red-400 text-red-700'} border px-6 py-4 rounded-lg mb-6`}
          >
            {error}
          </div>
        )}

        <Suspense fallback={<Loader />}>
          <MovieGrid movies={movies} />
        </Suspense>

        {loading && (
          <div className="flex justify-center py-12">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-4 ${isDark ? 'border-blue-500' : 'border-blue-600'} border-t-transparent`}
            />
          </div>
        )}

        {!loading && movies.length === 0 && (
          <EmptyState
            icon={<MdSearch className="w-full h-full opacity-50" />}
            title={searchQuery ? 'No movies found' : 'Start searching'}
            description={
              searchQuery
                ? 'Try a different search term'
                : 'Search for your favorite movies'
            }
          />
        )}

        <div ref={observerRef} className="h-10" />
      </main>
    </div>
  );
};
