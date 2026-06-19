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
      conditionEmoji: getWeatherEmoji(
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
    conditionEmoji: getWeatherEmoji(current.weather_code),
    time:
      current.time,
    daily:
      daily.slice(0, 5),
  };
};

export const getLocationSuggestions = async (
  city: string,
  signal?: AbortSignal
): Promise<LocationSuggestion[]> => {
  if (city.trim().length < 2) {
    return [];
  }

  const response = await fetch(
    `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=5`,
    { signal }
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

export const getWeatherEmoji = (code: number): string => {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌧️";
  if ([61, 63, 65, 66, 67].includes(code)) return "🌧️";
  if ([71, 73, 75, 77].includes(code)) return "❄️";
  if ([80, 81, 82].includes(code)) return "🌦️";
  if ([95, 96, 99].includes(code)) return "⛈️";

  return "🌡️";
};

export interface BackgroundTheme {
  containerClass: string;
  overlayClass: string;
}

export const getCityNameFromCoords = async (
  latitude: number,
  longitude: number
): Promise<{ name: string; country: string }> => {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );
  const data = await response.json();
  const name = data.city || data.locality || "Your Location";
  const country = data.countryName || "";
  return { name, country };
};

export const getWeatherBackground = (
  code: number | null,
  isDark: boolean
): BackgroundTheme => {
  if (code === null) {
    return {
      containerClass: isDark ? "bg-slate-950 text-slate-100" : "bg-[#eef7fb] text-slate-950",
      overlayClass: isDark
        ? "bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.28),_transparent_34%),radial-gradient(circle_at_75%_15%,_rgba(244,114,182,0.18),_transparent_28%)]"
        : "bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.28),_transparent_34%),radial-gradient(circle_at_82%_18%,_rgba(251,191,36,0.18),_transparent_30%)]",
    };
  }

  // Clear sky
  if (code === 0) {
    return {
      containerClass: isDark ? "bg-[#050b14] text-slate-100" : "bg-[#f5fbfd] text-slate-950",
      overlayClass: isDark
        ? "bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.18),_transparent_35%)]"
        : "bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.3),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.3),_transparent_35%)]",
    };
  }

  // Mostly clear / partly cloudy
  if ([1, 2].includes(code)) {
    return {
      containerClass: isDark ? "bg-[#090d16] text-slate-100" : "bg-[#f1f6f9] text-slate-950",
      overlayClass: isDark
        ? "bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.15),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(251,191,36,0.06),_transparent_30%)]"
        : "bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.25),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(251,191,36,0.2),_transparent_30%)]",
    };
  }

  // Overcast / Cloudy / Foggy
  if ([3, 45, 48].includes(code)) {
    return {
      containerClass: isDark ? "bg-[#0b101a] text-slate-100" : "bg-[#edf2f6] text-slate-950",
      overlayClass: isDark
        ? "bg-[radial-gradient(circle_at_top_left,_rgba(100,116,139,0.15),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(30,41,59,0.4),_transparent_40%)]"
        : "bg-[radial-gradient(circle_at_top_left,_rgba(203,213,225,0.4),_transparent_45%),radial-gradient(circle_at_80%_20%,_rgba(186,230,253,0.3),_transparent_35%)]",
    };
  }

  // Rain / Drizzle / Showers
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {
      containerClass: isDark ? "bg-[#070b14] text-slate-100" : "bg-[#eaf1f5] text-slate-950",
      overlayClass: isDark
        ? "bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.15),_transparent_40%),radial-gradient(circle_at_70%_20%,_rgba(71,85,105,0.15),_transparent_35%)]"
        : "bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.3),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(148,163,184,0.25),_transparent_35%)]",
    };
  }

  // Snow
  if ([71, 73, 75, 77].includes(code)) {
    return {
      containerClass: isDark ? "bg-[#091526] text-slate-100" : "bg-[#f4fafc] text-slate-950",
      overlayClass: isDark
        ? "bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(56,189,248,0.15),_transparent_35%)]"
        : "bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.8),_transparent_50%),radial-gradient(circle_at_80%_20%,_rgba(186,230,253,0.35),_transparent_45%)]",
    };
  }

  // Thunderstorm
  if ([95, 96, 99].includes(code)) {
    return {
      containerClass: isDark ? "bg-[#090614] text-slate-100" : "bg-[#eaeaee] text-slate-950",
      overlayClass: isDark
        ? "bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.15),_transparent_35%)]"
        : "bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.25),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(100,116,139,0.3),_transparent_40%)]",
    };
  }

  // Default fallback
  return {
    containerClass: isDark ? "bg-slate-950 text-slate-100" : "bg-[#eef7fb] text-slate-950",
    overlayClass: isDark
      ? "bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.2),_transparent_35%),radial-gradient(circle_at_75%_15%,_rgba(244,114,182,0.12),_transparent_30%)]"
      : "bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_35%),radial-gradient(circle_at_82%_18%,_rgba(251,191,36,0.12),_transparent_30%)]",
  };
};
