const API_KEY = "fcd594da9f5ee8279921c5f23f657105";

const API_URL_WEATHER =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const API_URL_TIME = "https://api.api-ninjas.com/v1/worldtime?&lat=";

const searchBox = document.querySelector(".group input");
const searchButton = document.querySelector(".group button");
const weatherIcon = document.querySelector(".weather_icon");

// Pressing "Enter" in input triggers search
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const city = searchBox.value.trim();
    if (city) getCurrentWhether(city);
  }
});

// Clicking the button triggers search
searchButton.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city) getCurrentWhether(city);
});

const Time = document.querySelector(".time");
const Time_Sub_Text = document.querySelector(".time-sub-text");
const Day_Time_Text = document.querySelector(".day-text");

// Initial load
getCurrentWhether("Chennai");

async function getCurrentWhether(city) {
  try {
    const response = await fetch(API_URL_WEATHER + city + `&appid=${API_KEY}`);
    if (!response.ok) {
      document.querySelector(".Error_Occur").style.display = "block";
      return;
    }

    const data = await response.json();

    // Weather Info
    document.querySelector(".city").textContent = data.name;
    document.querySelector(".temp").textContent =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").textContent = data.main.humidity + "%";
    document.querySelector(".wind").textContent = data.wind.speed + " Km/h";
    document.querySelector(".weather_Info").textContent = data.weather[0].main;

    // Feels Like and Min
    document.querySelector(".max").textContent =
      Math.round(data.main.feels_like) + "°C";
    document.querySelector(".min").textContent =
      Math.round(data.main.temp_min) + "°C";

    // Time Info
    getCurrentTime(data.coord.lat, data.coord.lon);

    // Weather Icons
    setWeatherIcon(data.weather[0].icon);

    document.querySelector(".Error_Occur").style.display = "none";
  } catch (err) {
    console.error("Error fetching weather:", err);
    document.querySelector(".Error_Occur").style.display = "block";
  }
}

function setWeatherIcon(icon) {
  const icons = {
    "01d": "sunny_icon.gif",
    "01n": "clear_moon.gif",
    "02d": "few_clouds.gif",
    "02n": "moon_fewclouds.gif",
    "03d": "scatter_cloud.gif",
    "03n": "scatter_cloudnight.gif",
    "04d": "broken_cloudsday.gif",
    "04n": "moon_fewclouds.gif",
    "09d": "shower_rain.gif",
    "09n": "shower_rain.gif",
    "10d": "Rain_day.gif",
    "10n": "Rain_night.gif",
    "11d": "heavy_rain.gif",
    "11n": "heavy_rain.gif",
    "13d": "snow.gif",
    "13n": "snow.gif",
    "50d": "misty_icon.gif",
    "50n": "misty_icon.gif",
  };

  weatherIcon.src = "Assets/Giff/" + (icons[icon] || "drizzle_icon.gif");
}

async function getCurrentTime(latitude, longitude) {
  $.ajax({
    method: "GET",
    url: API_URL_TIME + latitude + "&lon=" + longitude,
    headers: { "X-Api-Key": "ThZKOtGSBet1mEcoQqM7yA==jsQ0Yx2VZl6R0jKc" },
    contentType: "application/json",
    success: function (result) {
      let hour, minute, ampm;

      if (result.hour > 12) {
        hour = result.hour - 12;
        minute = result.minute;
        ampm = "pm";
        if (hour === 0) hour = 12;
      } else {
        hour = result.hour;
        minute = result.minute;
        ampm = "am";
      }

      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const month = months[result.month - 1] || "";
      const day_of_week = result.day_of_week;
      const day = result.day;

      document.querySelector(".time").textContent = hour + ":" + minute;
      document.querySelector(".time-sub-text").textContent = ampm;
      document.querySelector(".day-text").textContent =
        day_of_week + ", " + month + " | " + day + "th";
    },
    error: function ajaxError(jqXHR) {
      console.error("Error fetching time: ", jqXHR.responseText);
    },
  });
}
