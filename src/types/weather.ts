export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export interface LocationSuggestion {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}
