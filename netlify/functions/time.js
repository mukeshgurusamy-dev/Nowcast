// netlify/functions/time.js
exports.handler = async function (event, context) {
  const lat = parseFloat(event.queryStringParameters.lat);
  const lon = parseFloat(event.queryStringParameters.lon);

  if (isNaN(lat) || isNaN(lon)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid lat/lon" }),
    };
  }

  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!OPENWEATHER_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OpenWeather API key is missing" }),
    };
  }

  try {
    // Fetch weather data to get timezone and dt
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch OpenWeather data");

    const data = await response.json();

    // Calculate local time
    const dt = data.dt; // UTC timestamp in seconds
    const timezoneOffset = data.timezone; // offset in seconds
    const localTimestamp = dt + timezoneOffset;
    const localDate = new Date(localTimestamp * 1000);

    // Format hour & minute
    let hour = localDate.getUTCHours();
    const minute = localDate.getUTCMinutes();
    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12 === 0 ? 12 : hour % 12;

    // Format day & month
    const pad = (n) => (n < 10 ? "0" + n : n);
    const dayOfWeek = localDate.toLocaleString("en-US", { weekday: "long" });
    const month = localDate.toLocaleString("en-US", { month: "long" });
    const day = pad(localDate.getUTCDate());

    return {
      statusCode: 200,
      body: JSON.stringify({
        hour,
        minute: pad(minute),
        ampm,
        day_of_week: dayOfWeek,
        month,
        day,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
