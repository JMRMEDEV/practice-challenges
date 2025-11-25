import { useThemeStore } from '../../store/themeStore';

interface IBadgeProps {
  /** Content to display inside the badge */
  children: React.ReactNode;
}

export const Badge = ({ children }: IBadgeProps) => {
  const { isDark } = useThemeStore();

  return (
    <span
      className={`px-3 py-1 ${isDark ? 'bg-slate-800 text-gray-300' : 'bg-gray-200 text-gray-700'} rounded-full text-sm`}
    >
      {children}
    </span>
  );
};
