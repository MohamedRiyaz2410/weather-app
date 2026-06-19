import type {
  DailyWeather,
  LocationSuggestion,
  WeatherData,
} from "../types/Weather";

const GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast";

export const getWeather = async (city: string) => {
  // Step 1: Get coordinates from city name
  const geoResponse = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1`
  );

  const geoData = await geoResponse.json();

  if (!geoData.results?.length) {
    throw new Error("City not found");
  }

  const { latitude, longitude, name, country } =
    geoData.results[0];

  return getWeatherByLocation({
    latitude,
    longitude,
    name,
    country,
  });
};

export const getWeatherByLocation = async ({
  latitude,
  longitude,
  name,
  country,
}: {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}): Promise<WeatherData> => {
  const weatherResponse = await fetch(
    `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,surface_pressure,precipitation,cloud_cover,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max&timezone=auto`
  );

  const weatherData = await weatherResponse.json();
  const current = weatherData.current;
  const daily: DailyWeather[] =
    weatherData.daily.time.map((date: string, index: number) => ({
      date,
      weatherCode: weatherData.daily.weather_code[index],
      condition: getWeatherCondition(
        weatherData.daily.weather_code[index]
      ),
      maxTemperature:
        weatherData.daily.temperature_2m_max[index],
      minTemperature:
        weatherData.daily.temperature_2m_min[index],
      precipitationChance:
        weatherData.daily.precipitation_probability_max[index],
      uvIndex: weatherData.daily.uv_index_max[index],
    }));

  return {
    city: `${name}, ${country}`,
    country,
    temperature:
      current.temperature_2m,
    apparentTemperature:
      current.apparent_temperature,
    humidity:
      current.relative_humidity_2m,
    windSpeed:
      current.wind_speed_10m,
    pressure:
      current.surface_pressure,
    precipitation:
      current.precipitation,
    cloudCover:
      current.cloud_cover,
    weatherCode:
      current.weather_code,
    condition: getWeatherCondition(current.weather_code),
    time:
      current.time,
    daily:
      daily.slice(0, 5),
  };
};

export const getLocationSuggestions = async (
  city: string
): Promise<LocationSuggestion[]> => {
  if (city.trim().length < 2) {
    return [];
  }

  const response = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=5`
  );

  const data = await response.json();

  return data.results ?? [];
};

export const getWeatherCondition = (code: number) => {
  if (code === 0) return "Clear sky";
  if ([1, 2].includes(code)) return "Mostly clear";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Calm weather";
};
