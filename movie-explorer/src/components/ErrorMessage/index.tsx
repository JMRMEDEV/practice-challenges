import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';

interface IErrorMessageProps {
  /** Error message text to display to the user */
  message: string;
}

export const ErrorMessage = ({ message }: IErrorMessageProps) => {
  const { isDark } = useThemeStore();

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} flex items-center justify-center`}
    >
      <div className="text-center">
        <p className="text-red-500 text-xl mb-4">{message}</p>
        <Link
          to="/"
          className={`px-6 py-2 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition`}
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};
