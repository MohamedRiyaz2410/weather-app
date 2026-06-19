export const getWeather = async (city: string) => {
  // Step 1: Get coordinates from city name
  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
  );

  const geoData = await geoResponse.json();

  if (!geoData.results?.length) {
    throw new Error("City not found");
  }

  const { latitude, longitude, name, country } =
    geoData.results[0];

  // Step 2: Get weather
  const weatherResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
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