import { MdFavorite, MdArrowBack } from 'react-icons/md';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useThemeStore } from '../../store/themeStore';
import { Header } from '../Header';
import { MovieGrid } from '../MovieGrid';
import { EmptyState } from '../EmptyState';

export const Favorites = () => {
  const { favorites } = useFavoritesStore();
  const { isDark } = useThemeStore();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <Header
        title="My Favorites"
        icon={<MdFavorite className="w-8 h-8 text-red-500" />}
        backLink="/"
        backLabel={
          <>
            <MdArrowBack /> Back to Home
          </>
        }
      />

      <main className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <EmptyState
            icon={<MdFavorite className="w-full h-full" />}
            title="No favorites yet"
            description="Start adding movies to your favorites!"
            actionLabel="Browse Movies"
            actionLink="/"
          />
        ) : (
          <MovieGrid movies={favorites} />
        )}
      </main>
    </div>
  );
};
