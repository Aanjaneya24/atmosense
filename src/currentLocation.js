import React from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
import { getBackgroundImage } from "./utils/getBackgroundForWeather";
import WeatherMap from "./WeatherMap";

const dateBuilder = (d) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];

  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const getCountryName = (code) => {
  const countries = {
    IN: "India",
    US: "United States",
    GB: "United Kingdom",
    AU: "Australia",
    CA: "Canada",
    FR: "France",
    DE: "Germany",
    JP: "Japan",
    CN: "China",
    BR: "Brazil",
  };
  return countries[code] || code;
};

class Weather extends React.Component {
  state = {
    lat: undefined,
    lon: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    main: undefined,
    clothingTip: "",
    weeklyForecast: []
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          alert("Location access denied. Showing weather for Delhi.");
          this.getWeather(28.67, 77.22);
        });
    } else {
      alert("Geolocation not available");
    }

    this.timerID = setInterval(() => {
      if (this.state.lat && this.state.lon) {
        this.getWeather(this.state.lat, this.state.lon);
      }
    }, 600000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getPosition = (options) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  getWeather = async (lat, lon) => {
    try {
      const currentRes = await fetch(
        `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
      );
      const data = await currentRes.json();

      const forecastRes = await fetch(
        `${apiKeys.base}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKeys.key}`
      );
      const forecastData = await forecastRes.json();

      const dailyMap = {};
      forecastData.list.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyMap[date]) {
          dailyMap[date] = [];
        }
        dailyMap[date].push(item.main.temp);
      });

      const dailyAverages = Object.entries(dailyMap).slice(1, 8).map(([date, temps]) => {
        const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
        return {
          date,
          avgTemp
        };
      });

      const temp = data.main.temp;
      let icon = "CLEAR_DAY";
      const condition = data.weather[0].main;
      switch (condition) {
        case "Haze": icon = "CLEAR_DAY"; break;
        case "Clouds": icon = "CLOUDY"; break;
        case "Rain": icon = "RAIN"; break;
        case "Snow": icon = "SNOW"; break;
        case "Dust":
        case "Tornado": icon = "WIND"; break;
        case "Drizzle": icon = "SLEET"; break;
        case "Fog":
        case "Smoke": icon = "FOG"; break;
        default: icon = "CLEAR_DAY";
      }

      let tip = "";
      if (temp >= 35) {
        tip = condition === "Clear"
          ? "🔥 Scorching sun! Wear sleeveless shirts, use sunscreen & drink lots of water 💧🕶️"
          : condition === "Clouds"
            ? "🌤️ It's hot and cloudy — wear light cottons and stay hydrated 👕☁️"
            : "🥵 Hot! Light breathable clothes and protection from heat recommended 👕🧢";
      } else if (temp >= 30) {
        tip = condition === "Clouds"
          ? "🌦️ Hot but cloudy — carry an umbrella and wear sandals or waterproof shoes ☔👟"
          : "😎 Sunny day! Cotton clothes and shades are ideal 👕🧢";
      } else if (temp >= 22) {
        tip = condition === "Clouds"
          ? "⛅ Comfortable and cloudy — a t-shirt with jeans or joggers is perfect 👕👖"
          : "🌤️ Pleasant day — t-shirt or polo with jeans will work well 👕👖";
      } else if (temp >= 15) {
        tip = condition === "Rain"
          ? "🌧️ Chilly and rainy — wear a light jacket and carry an umbrella 🧥☔"
          : "🍃 Slightly cool — hoodie or light jacket should do 🧥🧢";
      } else if (temp >= 8) {
        tip = ["Fog", "Haze"].includes(condition)
          ? "🌫️ Foggy cold — wear a warm sweater and cover your neck 🧣🧥"
          : "🥶 Cold! Time for sweaters and scarves 🧣🧥";
      } else if (temp >= 0) {
        tip = condition === "Snow"
          ? "❄️ Snowy weather! Wear insulated jackets, gloves, and boots 🧤🧣🧥"
          : "🥶 Very cold — layer up with thermal wear and a jacket 🧤🧥";
      } else {
        tip = "🧊 Freezing! Heavy winter gear is essential — coat, gloves, scarf, the works 🧥🧤🧣";
      }

      this.setState({
        lat,
        lon,
        city: data.name,
        country: data.sys.country,
        temperatureC: Math.round(temp),
        temperatureF: Math.round(temp * 1.8 + 32),
        humidity: data.main.humidity,
        main: condition,
        icon,
        clothingTip: tip,
        weeklyForecast: dailyAverages
      });
    } catch (error) {
      console.error("Weather fetch failed:", error.message);
    }
  };

  handleBackgroundClick = (e) => {
    if (e.target.classList.contains("city")) {
      console.log("Background clicked. You can trigger background change here.");
      // You can add logic here if needed to change background dynamically
    }
  };

  renderForecastCard = () => {
    return (
      <div className="forecast-card">
        {this.state.weeklyForecast.map((day, index) => {
          const date = new Date(day.date);
          const options = { weekday: "short" };
          return (
            <div key={index} className="forecast-day">
              <span>{date.toLocaleDateString("en-US", options)}</span>
              <span>{Math.round(day.avgTemp)}°C</span>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { temperatureC, main } = this.state;
    const backgroundStyle = main
      ? {
          backgroundImage: `url(${getBackgroundImage(main)})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          transition: "background-image 0.5s ease-in-out"
        }
      : {};

    if (temperatureC !== undefined) {
      return (
        <React.Fragment>
          <div className="city" style={backgroundStyle} onClick={this.handleBackgroundClick}>
            <div className="title">
              <h2>{this.state.city}, {getCountryName(this.state.country)}</h2>
            </div>

            {/* Forecast Card + Map */}
            <div style={{ margin: "0 auto", marginBottom: "20px" }}>
              {this.renderForecastCard()}
              <WeatherMap lat={this.state.lat} lon={this.state.lon} city={this.state.city} />
            </div>

            <div className="mb-icon">
              <ReactAnimatedWeather
                icon={this.state.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{this.state.main}</p>
            </div>

            <div className="date-time">
              <div className="dmy">
                <div className="current-time">
                  <Clock format="HH:mm:ss" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              <div className="temperature">
                <p>{temperatureC}°<span>C</span></p>
              </div>
            </div>

            <div className="clothing-tip">
              <p>{this.state.clothingTip}</p>
            </div>
          </div>

          {/* Forecast Side Panel */}
          <Forcast icon={this.state.icon} weather={this.state.main} />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <img src={loader} alt="loading" style={{ width: "50%", WebkitUserDrag: "none" }} />
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location will be displayed on the App <br />& used for real-time weather.
          </h3>
        </React.Fragment>
      );
    }
  }
}

export default Weather;
