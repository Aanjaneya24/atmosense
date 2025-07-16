export function getBackgroundImage(condition) {
  const conditionMap = {
    Clear: "clear.jpg",
    Clouds: "clouds.jpg",
    Rain: "rain.jpg",
    Thunderstorm: "thunderstorm.jpg",
    Snow: "snow.jpg",
    Drizzle: "drizzle.jpg",
    Mist: "mist.jpg",
    Haze: "haze.jpg",
    Fog: "fog.jpg",
    Smoke: "smoke.jpg",
    Dust: "dust.jpg",
    Sand: "sand.jpg",
    Ash: "ash.jpg",
    Squall: "squall.jpg",
    Tornado: "tornado.jpg",
  };

  const filename = conditionMap[condition] || "default.jpg";
  return `/images/weather-bg/${filename}`;
}
