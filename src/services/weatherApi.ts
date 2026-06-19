import type { LocationSuggestion } from "../types/Weather";

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
}) => {
  const weatherResponse = await fetch(
    `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
  );

  const weatherData = await weatherResponse.json();

  return {
    city: `${name}, ${country}`,
    temperature:
      weatherData.current.temperature_2m,
    humidity:
      weatherData.current.relative_humidity_2m,
    windSpeed:
      weatherData.current.wind_speed_10m,
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
