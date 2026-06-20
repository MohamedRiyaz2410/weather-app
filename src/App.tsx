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
  getCityNameFromCoords,
  getWeatherBackground,
} from "./services/WeatherApi";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] =
    useState<WeatherData | null>(null);
  const [isDark, setIsDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

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

  // Sync and listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const trimmedCity = city.trim();

    if (trimmedCity.length < 2) {
      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        setSuggestionsLoading(true);

        const data = await getLocationSuggestions(trimmedCity, controller.signal);

        setSuggestions(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setSuggestions([]);
      } finally {
        if (!controller.signal.aborted) {
          setSuggestionsLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
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
      suggestion.admin2 && suggestion.admin2 !== suggestion.name ? suggestion.admin2 : undefined,
      suggestion.admin1 && suggestion.admin1 !== (suggestion.admin2 || suggestion.name) ? suggestion.admin1 : undefined,
      suggestion.country,
    ]
      .filter(Boolean)
      .join(", ");

    setCity(location);
    setSelectedLocation(suggestion);
    setSuggestions([]);
  };

  const fetchWeatherForCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError("");
    setSuggestions([]);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const { name, country } = await getCityNameFromCoords(latitude, longitude);

          const data = await getWeatherByLocation({
            latitude,
            longitude,
            name,
            country,
          });

          const locationDescription = [name, country].filter(Boolean).join(", ");
          setCity(locationDescription);
          setSelectedLocation({
            id: 0,
            name,
            country,
            latitude,
            longitude,
          });
          setWeather(data);
        } catch {
          setError("Failed to fetch weather for your location");
          setWeather(null);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(err.message || "Failed to retrieve location");
        setLoading(false);
      }
    );
  };

  const updateCity = (value: string) => {
    setCity(value);
    setSelectedLocation(null);

    if (value.trim().length < 2) {
      setSuggestions([]);
    }
  };

  const bgTheme = getWeatherBackground(weather ? weather.weatherCode : null, isDark);

  return (
    <div
      className={`min-h-screen overflow-hidden transition-colors duration-500 ${bgTheme.containerClass}`}
    >
      <div
        className={`pointer-events-none fixed inset-0 transition-all duration-700 ${bgTheme.overlayClass}`}
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

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-8 sm:py-16 md:py-20 sm:px-6">
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
            clearSuggestions={() => setSuggestions([])}
            fetchCurrentLocationWeather={fetchWeatherForCurrentLocation}
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
