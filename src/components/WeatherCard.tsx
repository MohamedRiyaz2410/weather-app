import type { WeatherData } from "../types/Weather";

interface Props {
  weather: WeatherData;
  isDark: boolean;
}

function WeatherCard({ weather, isDark }: Props) {
  return (
    <div
      className={`rounded-xl p-6 mt-5 shadow-lg transition-colors ${
        isDark
          ? "bg-slate-900 text-slate-100 shadow-black/30"
          : "bg-white text-slate-900"
      }`}
    >
      <h2 className="text-2xl font-bold">
        {weather.city}
      </h2>

      <div className="mt-4 space-y-2">
        <p className="text-4xl font-bold text-sky-500">
          {weather.temperature}°C
        </p>

        <p className={isDark ? "text-slate-300" : "text-slate-600"}>
          Humidity: {weather.humidity}%
        </p>

        <p className={isDark ? "text-slate-300" : "text-slate-600"}>
          Wind Speed: {weather.windSpeed} km/h
        </p>
      </div>
    </div>
  );
}

export default WeatherCard;
