import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast() {
  const [query, setQuery] = useState("Delhi");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [icon, setIcon] = useState("CLEAR_DAY");

  const search = (cityName = query) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${cityName}&units=metric&APPID=${apiKeys.key}`
      )
      .then((response) => {
        const data = response.data;
        setWeather(data);
        setQuery("");

        const condition = data.weather[0].main;
        let updatedIcon = "CLEAR_DAY";

        switch (condition) {
          case "Clouds":
            updatedIcon = "CLOUDY";
            break;
          case "Rain":
            updatedIcon = "RAIN";
            break;
          case "Snow":
            updatedIcon = "SNOW";
            break;
          case "Haze":
            updatedIcon = "CLEAR_DAY";
            break;
          case "Drizzle":
            updatedIcon = "SLEET";
            break;
          case "Fog":
          case "Smoke":
            updatedIcon = "FOG";
            break;
          case "Dust":
          case "Tornado":
            updatedIcon = "WIND";
            break;
          default:
            updatedIcon = "CLEAR_DAY";
        }

        setIcon(updatedIcon);
        setError("");
      })
      .catch(() => {
        setError({ message: "Not Found", query: query });
        setWeather({});
      });
  };

  useEffect(() => {
    search("Delhi");
  }, []);

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>

      <div className="today-weather">
        <h3>{weather.weather ? weather.weather[0].main : "Weather Info"}</h3>

        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyPress={(e) => e.key === "Enter" && search()}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              onClick={() => search()}
              alt="search"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        <ul>
          {typeof weather.main !== "undefined" ? (
            <>
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="weather icon"
                  style={{ width: "40px", height: "40px" }}
                />
              </li>
              <li>
                Temperature
                <span className="temp">
                  {Math.round(weather.main.temp)}°C 
                </span>
              </li>
              <li>
                Humidity
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Visibility
                <span className="temp">
                  {Math.round(weather.visibility / 1000)} km
                </span>
              </li>
              <li>
                Wind Speed
                <span className="temp">
                  {Math.round(weather.wind.speed)} km/h
                </span>
              </li>
            </>
          ) : (
            <li className="cityHead" style={{ color: "crimson" }}>
              {error.query} - {error.message}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Forecast;
