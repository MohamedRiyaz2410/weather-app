export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  precipitation: number;
  cloudCover: number;
  weatherCode: number;
  condition: string;
  time: string;
  daily: DailyWeather[];
}

export interface DailyWeather {
  date: string;
  condition: string;
  weatherCode: number;
  maxTemperature: number;
  minTemperature: number;
  precipitationChance: number;
  uvIndex: number;
}

export interface LocationSuggestion {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
