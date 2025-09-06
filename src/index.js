const searchBox = document.querySelector(".group input");
const searchButton = document.querySelector(".group button");
const weatherIcon = document.querySelector(".weather_icon");

// Detect if running on Netlify
const isNetlify = window.location.hostname.includes("netlify.app");

// Pressing "Enter" triggers search
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const city = searchBox.value.trim();
    if (city) getCurrentWeather(city);
  }
});

// Clicking the button triggers search
searchButton.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city) getCurrentWeather(city);
});

// Initial load
getCurrentWeather("Chennai");

async function getCurrentWeather(city) {
  try {
    let response, data;

    if (isNetlify) {
      response = await fetch(`/.netlify/functions/weather?city=${city}`);
      if (!response.ok) throw new Error("Failed to fetch weather");
      data = await response.json();
    } else {
      const API_KEY = "YOUR_LOCAL_OPENWEATHER_API_KEY";
      const proxy = "https://api.allorigins.win/get?url=";
      const url = encodeURIComponent(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${API_KEY}`
      );
      response = await fetch(proxy + url);
      const json = await response.json();
      data = JSON.parse(json.contents);
    }

    // Weather Info
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " Km/h";
    document.querySelector(".weather_Info").textContent = data.weather[0].main;
    document.querySelector(".max").textContent =
      Math.round(data.main.feels_like) + "°C";
    document.querySelector(".min").textContent =
      Math.round(data.main.temp_min) + "°C";

    setWeatherIcon(data.weather[0].icon);

    // Time Info (calculate from OpenWeather response)
    setCurrentTime(data.dt, data.timezone);

    document.querySelector(".Error_Occur").style.display = "none";
  } catch (err) {
    console.error("Error fetching weather:", err);
    document.querySelector(".Error_Occur").style.display = "block";
  }
}

function setWeatherIcon(icon) {
  const icons = {
    "01d": "Assets/Giff/sunny_icon.gif",
    "01n": "Assets/Giff/clear_moon.gif",
    "02d": "Assets/Giff/few_clouds.gif",
    "02n": "Assets/Giff/moon_fewclouds.gif",
    "03d": "Assets/Giff/scatter_cloud.gif",
    "03n": "Assets/Giff/scatter_cloudnight.gif",
    "04d": "Assets/Giff/broken_cloudsday.gif",
    "04n": "Assets/Giff/moon_fewclouds.gif",
    "09d": "Assets/Giff/shower_rain.gif",
    "09n": "Assets/Giff/shower_rain.gif",
    "10d": "Assets/Giff/Rain_day.gif",
    "10n": "Assets/Giff/Rain_night.gif",
    "11d": "Assets/Giff/heavy_rain.gif",
    "11n": "Assets/Giff/heavy_rain.gif",
    "13d": "Assets/Giff/snow.gif",
    "13n": "Assets/Giff/snow.gif",
    "50d": "Assets/Giff/misty_icon.gif",
    "50n": "Assets/Giff/misty_icon.gif",
  };

  weatherIcon.src = icons[icon] || "Assets/Giff/drizzle_icon.gif";
}

// Calculate and display time from OpenWeather API dt and timezone
function setCurrentTime(dt, timezoneOffset) {
  const pad = (n) => (n < 10 ? "0" + n : n);

  // local timestamp in seconds
  const localTimestamp = dt + timezoneOffset;
  const localDate = new Date(localTimestamp * 1000);

  // hours & minutes
  let hours = localDate.getUTCHours();
  const minutes = localDate.getUTCMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 === 0 ? 12 : hours % 12;

  // day & month
  const dayOfWeek = localDate.toLocaleString("en-US", { weekday: "long" });
  const month = localDate.toLocaleString("en-US", { month: "long" });
  const day = pad(localDate.getUTCDate());

  // Set HTML
  document.querySelector(".time").textContent = `${hours}:${pad(
    minutes
  )}${ampm}`;
  document.querySelector(
    ".day-text"
  ).textContent = `${dayOfWeek}, ${month} | ${day}th`;
}
