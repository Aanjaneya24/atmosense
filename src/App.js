import React, { useState, useEffect } from "react";
import CurrentLocation from "./currentLocation";
import "./App.css";

function App() {
  const [bgIndex, setBgIndex] = useState(1);

  // On page load, choose a random background between 1–10
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 10) + 1;
    setBgIndex(randomIndex);
  }, []);

  // Function to change background on click
  const handleBackgroundClick = () => {
    setBgIndex((prevIndex) => (prevIndex % 10) + 1); // Cycles from 1 to 10
  };

  return (
    <div onClick={handleBackgroundClick}>
      {/* Background layer */}
      <div
        className="background-wrapper"
        style={{
          backgroundImage: `url(./images/weather-bg/background${bgIndex}.jpg)`
        }}
      />

      {/* Main content */}
      <div className="container">
        <CurrentLocation />
      </div>

      {/* Footer */}
      <footer className="footer-info">
        <span className="quote">"Weather your day smartly – with Atmosense ⛅"</span>
        <span className="divider">|</span>
        <span className="author">
          Designed by{" "}
          <a
            href="https://github.com/Aanjaneya24"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aanjaneya Pandey
          </a>{" "}
          | Powered by{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenWeather
          </a>
        </span>
      </footer>
    </div>
  );
}

export default App;
