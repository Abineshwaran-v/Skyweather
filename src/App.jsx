
import { useState } from "react";
import "./App.css";
import { getWeather, getPastWeather } from "./weather";

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌤️";
}

function App() {
  const [city, setCity] = useState("Chennai");
  const [weather, setWeather] = useState(null);
  const [pastWeather, setPastWeather] = useState([]);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchWeather() {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setHistoryError("");
    setWeather(null);
    setPastWeather([]);

    try {
      const data = await getWeather(city.trim());
      setWeather(data);

      try {
        const history = await getPastWeather(
          data.coord.lat,
          data.coord.lon
        );

        setPastWeather(history);
      } catch (err) {
        setHistoryError("Unable to load past weather history.");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">

      <nav className="navbar">
        <h2>🌤️ SkyWeather</h2>
      </nav>

      <main className="weather-container">

        <div className="search-box">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchWeather();
            }}
          />

          <button onClick={searchWeather} disabled={loading}>
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {weather && (
          <>
            <section className="weather-card">

              <p className="city">
                {weather.name}, {weather.sys.country}
              </p>

              <h1>{Math.round(weather.main.temp)}°C</h1>

              <h3>
                {weather.weather[0].description}
              </h3>

              <p>
                Feels like {Math.round(weather.main.feels_like)}°C
              </p>

              <div className="weather-details">

                <div>
                  <h3>{weather.main.humidity}%</h3>
                  <p>Humidity</p>
                </div>

                <div>
                  <h3>{weather.wind.speed} m/s</h3>
                  <p>Wind Speed</p>
                </div>

                <div>
                  <h3>{weather.main.pressure} hPa</h3>
                  <p>Pressure</p>
                </div>

              </div>
            </section>

            <section className="history-section">

              <div className="history-heading">
                <h2>Past 5 Days</h2>
                <p>Weather History</p>
              </div>

              {historyError && (
                <p className="error">{historyError}</p>
              )}

              <div className="history-grid">

                {pastWeather.map((day) => (
                 
<div className="history-card" key={day.date}>

  <h4>
    {new Date(day.date + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric"
    })}
  </h4>

  <div className="history-icon">
    {getWeatherIcon(day.code)}
  </div>

  <h3>{Math.round(day.maxTemp)}°</h3>

  <div className="history-info">
    <p>Minimum: {Math.round(day.minTemp)}°C</p>
    <p>Average: {Math.round(day.avgTemp)}°C</p>
    <p>Humidity: {Math.round(day.humidity)}%</p>
  </div>

  <p className="hover-hint">touch me for DETAILS</p>

</div>

                ))}

              </div>

              {pastWeather.length === 0 &&
                !historyError && (
                  <p className="history-loading">
                    Loading weather history...
                  </p>
                )}

            </section>
          </>
        )}

        <footer>
          <p>Weather information made simple.</p>
        </footer>

      </main>
    </div>
  );
}

export default App;
