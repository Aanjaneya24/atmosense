# 🌦️ Atmosense – Smart Weather App

**Atmosense** is a sleek, real-time weather app built with **React.js**.  
It shows live weather data, 7-day forecasts, animated icons, and provides clothing tips based on temperature and conditions.

🔗 **Live Demo:** [Click here to try Atmosense](https://aanjaneya24.github.io/atmosense)

---

## 🚀 Features

- 📍 Auto location-based weather
- 🧥 Clothing tips based on weather
- 📅 7-day forecast
- 🌄 Dynamic background images (click to change)
- 🗺️ Weather map integration

---

## 📦 Setup

```bash
git clone https://github.com/Aanjaneya24/atmosense.git
cd atmosense
npm install
```

---

## 🔑 Add Your API Key

You can add your [OpenWeatherMap](https://openweathermap.org/api) API key in one of the two ways:

### Option 1: Using `.env` file

1. Rename the provided `weath.env` file to `.env`
2. Add your API key like this:

```env
REACT_APP_WEATHER_API_KEY=your_api_key_here
```

### Option 2: Directly in `src/apiKeys.js`

```js
module.exports = {
  key: "your_api_key_here",
  base: "https://api.openweathermap.org/data/2.5/"
};
```

---

## ▶️ Run the App Locally

```bash
npm start
```

---

## 🚀 Deploy (GitHub Pages)

Make sure the `homepage` field is set correctly in your `package.json`:

```json
"homepage": "https://aanjaneya24.github.io/atmosense"
```

Then run the following to deploy:

```bash
npm run deploy
```

---

## 👤 Author

**Aanjaneya Pandey**  
🌐 [GitHub](https://github.com/Aanjaneya24)

---

⭐️ Don’t forget to star this repo if you like it!
