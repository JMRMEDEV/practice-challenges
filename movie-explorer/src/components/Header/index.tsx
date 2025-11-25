import { Link } from 'react-router-dom';
import { MdFavorite, MdMovie, MdLightMode, MdDarkMode } from 'react-icons/md';
import { useThemeStore } from '../../store/themeStore';

interface IHeaderProps {
  /** Main title text to display in the header */
  title: string;
  /** Optional icon element to display next to the title */
  icon?: React.ReactNode;
  /** Whether to show the theme toggle button */
  showThemeToggle?: boolean;
  /** Whether to show the favorites link button */
  showFavoritesLink?: boolean;
  /** Optional URL for the back navigation link */
  backLink?: string;
  /** Optional label/content for the back button */
  backLabel?: React.ReactNode;
}

export const Header = ({
  title,
  icon,
  showThemeToggle = false,
  showFavoritesLink = false,
  backLink,
  backLabel,
}: IHeaderProps) => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header className={`${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon || (
              <MdMovie
                className={`w-8 h-8 ${isDark ? 'text-blue-500' : 'text-blue-600'}`}
              />
            )}
            <h1
              className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
            >
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {showThemeToggle && (
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'} transition`}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <MdLightMode className="w-6 h-6 text-yellow-400" />
                ) : (
                  <MdDarkMode className="w-6 h-6 text-slate-700" />
                )}
              </button>
            )}
            {showFavoritesLink && (
              <Link
                to="/favorites"
                className={`px-4 py-2 ${isDark ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white rounded-lg transition flex items-center gap-2`}
              >
                <MdFavorite className="w-5 h-5" />
                Favorites
              </Link>
            )}
            {backLink && (
              <Link
                to={backLink}
                className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition`}
              >
                {backLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
