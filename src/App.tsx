import { useEffect, useState } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Loading from "./components/Loading";

import type {
  LocationSuggestion,
  WeatherData,
} from "./types/Weather";
import {
  getLocationSuggestions,
  getWeather,
  getWeatherByLocation,
} from "./services/WeatherApi";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] =
    useState<WeatherData | null>(null);
  const [isDark, setIsDark] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");
  const [suggestions, setSuggestions] =
    useState<LocationSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] =
    useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationSuggestion | null>(null);

  useEffect(() => {
    const trimmedCity = city.trim();

    if (trimmedCity.length < 2) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setSuggestionsLoading(true);

        const data = await getLocationSuggestions(trimmedCity);

        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [city]);

  const searchWeather = async () => {
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError("");
      setSuggestions([]);

      const data = selectedLocation
        ? await getWeatherByLocation(selectedLocation)
        : await getWeather(city);

      setWeather(data);
    } catch {
      setError("City not found");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const selectSuggestion = (
    suggestion: LocationSuggestion
  ) => {
    const location = [
      suggestion.name,
      suggestion.admin1,
      suggestion.country,
    ]
      .filter(Boolean)
      .join(", ");

    setCity(location);
    setSelectedLocation(suggestion);
    setSuggestions([]);
  };

  const updateCity = (value: string) => {
    setCity(value);
    setSelectedLocation(null);

    if (value.trim().length < 2) {
      setSuggestions([]);
    }
  };

  return (
    <div
      className={`min-h-screen overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-slate-950 text-slate-100"
          : "bg-[#eef7fb] text-slate-950"
      }`}
    >
      <div
        className={`pointer-events-none fixed inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.28),_transparent_34%),radial-gradient(circle_at_75%_15%,_rgba(244,114,182,0.18),_transparent_28%)]"
            : "bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.28),_transparent_34%),radial-gradient(circle_at_82%_18%,_rgba(251,191,36,0.18),_transparent_30%)]"
        }`}
      />

      <button
        type="button"
        onClick={() => setIsDark((current) => !current)}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        className={`fixed right-4 top-4 z-20 flex h-10 w-20 items-center rounded-full p-1 shadow-lg transition-colors duration-300 ${
          isDark
            ? "bg-slate-800/90 ring-1 ring-white/10"
            : "bg-white/90 ring-1 ring-slate-200"
        }`}
      >
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full text-lg shadow transition-transform duration-300 ${
            isDark
              ? "translate-x-10 bg-slate-950"
              : "translate-x-0 bg-amber-300"
          }`}
        >
          {isDark ? "🌙" : "☀️"}
        </span>
      </button>

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-20 sm:px-6">
        <Header isDark={isDark} />

        <section
          className={`mt-8 rounded-[2rem] border p-4 shadow-2xl backdrop-blur-xl sm:p-6 ${
            isDark
              ? "border-white/10 bg-white/[0.06] shadow-black/40"
              : "border-white/70 bg-white/70 shadow-sky-200/60"
          }`}
        >
          <SearchBar
            city={city}
            setCity={updateCity}
            searchWeather={searchWeather}
            suggestions={suggestions}
            suggestionsLoading={suggestionsLoading}
            selectSuggestion={selectSuggestion}
            isDark={isDark}
          />

          {loading && <Loading isDark={isDark} />}

          {error && (
            <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
              {error}
            </p>
          )}

          {weather ? (
            <WeatherCard
              weather={weather}
              isDark={isDark}
            />
          ) : (
            !loading &&
            !error && (
              <div
                className={`mt-8 rounded-3xl border p-8 text-center ${
                  isDark
                    ? "border-white/10 bg-slate-950/40 text-slate-300"
                    : "border-slate-200 bg-white/60 text-slate-600"
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-500">
                  Ready for forecast
                </p>
                <p className="mt-3 text-lg">
                  Search a city to see live conditions and the week ahead.
                </p>
              </div>
            )
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
