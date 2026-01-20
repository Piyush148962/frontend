// src/utils/ai/weatherService.js

const API_KEY = "YOUR_API_KEY"; // 🔥 Replace this

export async function getWeather(city = "Mumbai") {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();
    return {
      temp: data.main.temp,
      condition: data.weather[0].main,
    };
  } catch (e) {
    return {
      temp: 30,
      condition: "Sunny",
    };
  }
}
