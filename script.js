function getWeatherEmoji(condition) {
  const desc = condition.toLowerCase();
  if (desc.includes("clear")) return "☀️";
  if (desc.includes("cloud")) return "☁️☁️☁️";
  if (desc.includes("rain")) return "🌧️🌧️";
  if (desc.includes("storm")) return "⛈️";
  if (desc.includes("snow")) return "❄️";
  if (desc.includes("fog") || desc.includes("mist")) return "🌫️";
  return "🌍";
}

function convertUnixToTime(unix, timezoneOffset) {
  const date = new Date((unix + timezoneOffset) * 1000);
  return date.toUTCString().match(/\d{2}:\d{2}/)[0];
}

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "63cf752c4fbf03de756a26da7df661b1"; // Replace with your OpenWeatherMap API key

  if (!city) {
    document.getElementById("errorMessage").textContent = "Please enter a city.";
    return;
  }

  try {
    // Current weather
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const weatherData = await weatherRes.json();

    const name = weatherData.name;
    const { description, icon } = weatherData.weather[0];
    const { temp, humidity } = weatherData.main;
    const { speed } = weatherData.wind;
    const { sunrise, sunset } = weatherData.sys;
    const timezone = weatherData.timezone;

    document.getElementById("cityName").textContent = name;
    document.getElementById("description").textContent = description;
    document.getElementById("temperature").textContent = `${Math.round(temp)}°C`;
    document.getElementById("humidity").textContent = humidity;
    document.getElementById("wind").textContent = speed;
    document.getElementById("sunrise").textContent = convertUnixToTime(sunrise, timezone);
    document.getElementById("sunset").textContent = convertUnixToTime(sunset, timezone);
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.getElementById("weatherEmoji").textContent = getWeatherEmoji(description);

    document.getElementById("weatherCard").classList.remove("hidden");
    document.getElementById("errorMessage").textContent = "";

    // 5-day forecast
    const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastRes.json();

    const forecastCards = document.getElementById("forecastCards");
    forecastCards.innerHTML = "";

    const daily = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
    daily.slice(0, 5).forEach(day => {
      const date = new Date(day.dt_txt);
      const icon = day.weather[0].icon;
      const temp = Math.round(day.main.temp);
      const desc = day.weather[0].main;

      forecastCards.innerHTML += `
        <div class="forecast-card">
          <p>${date.toDateString().slice(0, 3)}</p>
          <img src="https://openweathermap.org/img/wn/${icon}.png" />
          <p>${temp}°C</p>
          <p>${desc}</p>
        </div>`;
    });

    document.getElementById("forecast").classList.remove("hidden");
  } catch (err) {
    document.getElementById("errorMessage").textContent = "❌ City not found. Try again.";
    document.getElementById("weatherCard").classList.add("hidden");
    document.getElementById("forecast").classList.add("hidden");
  }
}
