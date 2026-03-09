"use client";

import { Input, useDebounce } from "@tfs-ucmp/ui";
import { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

/**
 * SearchBar - Client Component
 * Search input with debouncing
 */
export function SearchBar({ placeholder = "Search...", onSearch: _onSearch }: SearchBarProps) {
  const [search, setSearch] = useState("");
  const _debouncedSearch = useDebounce(search, 300);

  // Effect would go here to call onSearch with debouncedSearch
  // useEffect(() => { onSearch?.(debouncedSearch) }, [debouncedSearch, onSearch])

  return (
    <div className="relative">
      <svg
        aria-hidden="true"
        className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <Input
        className="pl-10"
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        type="search"
        value={search}
      />
    </div>
  );
}
