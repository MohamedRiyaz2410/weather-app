import type { LocationSuggestion } from "../types/Weather";

interface Props {
  city: string;
  setCity: (city: string) => void;
  searchWeather: () => void;
  suggestions: LocationSuggestion[];
  suggestionsLoading: boolean;
  selectSuggestion: (suggestion: LocationSuggestion) => void;
  isDark: boolean;
}

function SearchBar({
  city,
  setCity,
  searchWeather,
  suggestions,
  suggestionsLoading,
  selectSuggestion,
  isDark,
}: Props) {
  const showSuggestions =
    suggestionsLoading || suggestions.length > 0;

  return (
    <div className="relative">
      <div
        className={`flex flex-col gap-3 rounded-3xl border p-3 shadow-inner sm:flex-row ${
          isDark
            ? "border-white/10 bg-slate-950/50"
            : "border-white bg-white/80"
        }`}
      >
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchWeather();
            }
          }}
          placeholder="Enter city"
          className={`min-w-0 flex-1 rounded-2xl border px-4 py-4 text-base font-medium outline-none transition-colors focus:ring-2 focus:ring-sky-400 ${
            isDark
              ? "border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500"
              : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400"
          }`}
        />

        <button
          type="button"
          onClick={searchWeather}
          className="rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white shadow-lg shadow-slate-950/20 transition-colors hover:bg-sky-600"
        >
          Search
        </button>
      </div>

      {showSuggestions && (
        <div
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
            suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => selectSuggestion(suggestion)}
                className={`block w-full px-4 py-3 text-left transition-colors ${
                  isDark
                    ? "text-slate-100 hover:bg-slate-800"
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
                  {[suggestion.admin1, suggestion.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
