import type { WeatherData } from "../types/weather";

interface Props {
  weather: WeatherData;
}

function WeatherCard({ weather }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-5">
      <h2 className="text-2xl font-bold">
        {weather.city}
      </h2>

      <div className="mt-4 space-y-2">
        <p className="text-4xl font-bold">
          {weather.temperature}°C
        </p>

        <p>
          Humidity: {weather.humidity}%
        </p>

        <p>
          Wind Speed: {weather.windSpeed} km/h
        </p>
      </div>
    </div>
  );
}

export default WeatherCard;