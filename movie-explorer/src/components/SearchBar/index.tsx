import { MdSearch } from 'react-icons/md';
import { useThemeStore } from '../../store/themeStore';

interface ISearchBarProps {
  /** Current search query value */
  value: string;
  /** Callback function triggered when search input changes */
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: ISearchBarProps) => {
  const { isDark } = useThemeStore();

  return (
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for movies..."
        className={`w-full px-6 py-4 rounded-full border-2 focus:outline-none transition ${
          isDark
            ? 'bg-slate-800 text-white border-slate-700 focus:border-blue-500'
            : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500'
        }`}
      />
      <MdSearch
        className={`absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
      />
    </div>
  );
};
