import { useState } from "react";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Loading from "./components/Loading";

import type { WeatherData } from "./types/weather";
import { getWeather } from "./services/weatherApi";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const searchWeather = async () => {
    if (!city.trim()) return;

    try {
      setLoading(true);
      setError("");

      const data = await getWeather(city);

      setWeather(data);
    } catch {
      setError("City not found");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center p-4">
      <div className="max-w-md w-full">
        <Header />

        <SearchBar
          city={city}
          setCity={setCity}
          searchWeather={searchWeather}
        />

        {loading && <Loading />}

        {error && (
          <p className="text-red-500 mt-4">
            {error}
          </p>
        )}

        {weather && (
          <WeatherCard weather={weather} />
        )}
      </div>
    </div>
  );
}

export default App;