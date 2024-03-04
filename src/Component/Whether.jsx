import React, { useState, useEffect } from "react";
import "./Whether.css";

const apiKey = "8f8135442ebba38fa189c2a7f396a165";

function Whether() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("metric"); // Default to Celsius

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
        );
        if (!response.ok) {
          setError("City not found");
          setWeatherData(null);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setWeatherData(data);
        setError("");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Something went wrong. Please try again later.");
        setWeatherData(null);
        setLoading(false);
      }
    };

    if (city) {
      fetchWeatherData();
    }

    const intervalId = setInterval(fetchWeatherData, 60000); // Fetch data every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [city, unit]);

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <button onClick={toggleUnit}>
        {unit === "metric" ? "Switch to Fahrenheit" : "Switch to Celsius"}
      </button>

      {error && <div className="error">{error}</div>}

      {loading && <div className="loading">Loading...</div>}

      {weatherData && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <p>
            Temperature:{" "}
            {unit === "metric"
              ? `${weatherData.main.temp}°C`
              : `${(weatherData.main.temp * 9) / 5 + 32}°F`}
          </p>
          <p>Description: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <p>
            Last Updated: {new Date(weatherData.dt * 1000).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

export default Whether;
