
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function getWeather(city) {
  if (!API_KEY) {
    throw new Error("API key is missing. Check your .env file.");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Weather API error: ${response.status}`
    );
  }

  return data;
}

export async function getPastWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,relative_humidity_2m_mean&past_days=6&forecast_days=1&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load past weather data");
  }

  const data = await response.json();

  // Exclude today and keep the previous five days
  const pastDates = data.daily.time.slice(0, -1).slice(-5);

  return pastDates.map((date) => {
    const index = data.daily.time.indexOf(date);

    return {
      date: date,
      maxTemp: data.daily.temperature_2m_max[index],
      minTemp: data.daily.temperature_2m_min[index],
      avgTemp: data.daily.temperature_2m_mean[index],
      humidity: data.daily.relative_humidity_2m_mean[index],
      code: data.daily.weather_code[index]
    };
  });
}
