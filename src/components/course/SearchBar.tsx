import { Input, Button } from '@/components/ui';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search courses...',
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch?.(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder}
          className="pl-10 pr-4"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <Button variant="primary" onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
}
