import { useState, useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }, [onSearch]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search research papers..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />
    </div>
  );
}
