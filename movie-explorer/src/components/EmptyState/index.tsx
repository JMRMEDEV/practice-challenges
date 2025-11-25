import { Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';

interface IEmptyStateProps {
  /** Icon element to display at the top of the empty state */
  icon: React.ReactNode;
  /** Main title text for the empty state */
  title: string;
  /** Descriptive text explaining the empty state */
  description: string;
  /** Optional label for the action button */
  actionLabel?: string;
  /** Optional link URL for the action button */
  actionLink?: string;
}

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
}: IEmptyStateProps) => {
  const { isDark } = useThemeStore();

  return (
    <div className="text-center py-20">
      <div
        className={`w-24 h-24 mx-auto mb-4 flex items-center justify-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}
      >
        {icon}
      </div>
      <h2
        className={`text-2xl font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}
      >
        {title}
      </h2>
      <p className={`${isDark ? 'text-gray-500' : 'text-gray-500'} mb-6`}>
        {description}
      </p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className={`inline-block px-6 py-3 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition`}
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
};
