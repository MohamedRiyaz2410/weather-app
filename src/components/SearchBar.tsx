import { useEffect, useRef, useState } from "react";
import type { LocationSuggestion } from "../types/Weather";

interface Props {
  city: string;
  setCity: (city: string) => void;
  searchWeather: () => void;
  suggestions: LocationSuggestion[];
  suggestionsLoading: boolean;
  selectSuggestion: (suggestion: LocationSuggestion) => void;
  isDark: boolean;
  clearSuggestions: () => void;
  fetchCurrentLocationWeather: () => void;
}

function SearchBar({
  city,
  setCity,
  searchWeather,
  suggestions,
  suggestionsLoading,
  selectSuggestion,
  isDark,
  clearSuggestions,
  fetchCurrentLocationWeather,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [prevSuggestions, setPrevSuggestions] = useState(suggestions);

  const showSuggestions = suggestionsLoading || suggestions.length > 0;

  if (suggestions !== prevSuggestions) {
    setPrevSuggestions(suggestions);
    setFocusedIndex(-1);
  }

  // Click outside suggestions container to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        clearSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clearSuggestions]);

  return (
    <div ref={containerRef} className="relative">
      <div
        className={`flex flex-col gap-3 rounded-3xl border p-3 shadow-inner sm:flex-row ${
          isDark
            ? "border-white/10 bg-slate-950/50"
            : "border-white bg-white/80"
        }`}
      >
        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
                  selectSuggestion(suggestions[focusedIndex]);
                } else {
                  searchWeather();
                }
              } else if (e.key === "Escape") {
                clearSuggestions();
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (suggestions.length > 0) {
                  setFocusedIndex((prev) => (prev + 1) % suggestions.length);
                }
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (suggestions.length > 0) {
                  setFocusedIndex(
                    (prev) => (prev - 1 + suggestions.length) % suggestions.length
                  );
                }
              }
            }}
            placeholder="Enter city"
            aria-label="Search city name"
            aria-autocomplete="list"
            aria-controls="search-suggestions-list"
            aria-expanded={showSuggestions}
            className={`min-w-0 w-full rounded-2xl border pl-4 pr-12 py-4 text-base font-medium outline-none transition-colors focus:ring-2 focus:ring-sky-400 ${
              isDark
                ? "border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500"
                : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
            }`}
          />
          <button
            type="button"
            onClick={fetchCurrentLocationWeather}
            title="Use current location"
            aria-label="Use current location"
            className={`absolute right-3 p-2 rounded-xl transition-all duration-300 active:scale-95 cursor-pointer ${
              isDark
                ? "text-slate-500 hover:text-sky-400 hover:bg-slate-800/60"
                : "text-slate-400 hover:text-sky-500 hover:bg-slate-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="2" />
              <path strokeLinecap="round" d="M12 2v2M12 20v2M2 12h2M20 12h2" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={searchWeather}
          className="rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white shadow-lg shadow-slate-950/20 transition-colors hover:bg-sky-600 cursor-pointer"
        >
          Search
        </button>
      </div>

      {showSuggestions && (
        <div
          id="search-suggestions-list"
          role="listbox"
          aria-label="Location suggestions"
          className={`absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border shadow-lg ${
            isDark
              ? "border-slate-700 bg-slate-900"
              : "border-slate-200 bg-white"
          }`}
        >
          {suggestionsLoading && (
            <div
              className={`p-3 text-sm ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Finding places...
            </div>
          )}

          {!suggestionsLoading &&
            suggestions.map((suggestion, index) => {
              const isHighlighted = index === focusedIndex;
              return (
                <button
                  key={suggestion.id}
                  type="button"
                  role="option"
                  aria-selected={isHighlighted}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`block w-full px-4 py-3 text-left transition-colors ${
                    isHighlighted
                      ? isDark
                        ? "bg-slate-800 text-slate-100"
                        : "bg-sky-100 text-slate-900"
                      : isDark
                      ? "text-slate-100 hover:bg-slate-800/50"
                      : "text-slate-900 hover:bg-sky-50"
                  }`}
                >
                  <span className="block font-medium">
                    {suggestion.name}
                  </span>
                  <span
                    className={`block text-sm ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {[
                      suggestion.admin2 && suggestion.admin2 !== suggestion.name ? suggestion.admin2 : undefined,
                      suggestion.admin1 && suggestion.admin1 !== (suggestion.admin2 || suggestion.name) ? suggestion.admin1 : undefined,
                      suggestion.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
