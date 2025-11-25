import { useThemeStore } from '../../store/themeStore';

export const Loader = () => {
  const { isDark } = useThemeStore();

  return (
    <div
      className={`min-h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} flex items-center justify-center`}
    >
      <div
        className={`animate-spin rounded-full h-16 w-16 border-4 ${isDark ? 'border-blue-500' : 'border-blue-600'} border-t-transparent`}
      />
    </div>
  );
};
