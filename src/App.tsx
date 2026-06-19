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
      className={`min-h-screen flex justify-center items-center p-4 transition-colors duration-300 ${
        isDark
          ? "bg-slate-950 text-slate-100"
          : "bg-sky-50 text-slate-900"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsDark((current) => !current)}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        className={`fixed right-4 top-4 flex h-10 w-20 items-center rounded-full p-1 shadow-lg transition-colors duration-300 ${
          isDark
            ? "bg-slate-800"
            : "bg-white"
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

      <div className="max-w-md w-full">
        <Header isDark={isDark} />

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
          <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-red-500">
            {error}
          </p>
        )}

        {weather && (
          <WeatherCard
            weather={weather}
            isDark={isDark}
          />
        )}
      </div>
    </div>
  );
}

export default App;
