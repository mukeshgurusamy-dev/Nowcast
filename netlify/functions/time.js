// netlify/functions/time.js
exports.handler = async function (event) {
  const lat = parseFloat(event.queryStringParameters.lat);
  const lon = parseFloat(event.queryStringParameters.lon);

  if (isNaN(lat) || isNaN(lon)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid lat/lon" }),
    };
  }

  const API_KEY = process.env.WORLD_TIME_API_KEY;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "WORLD_TIME_API_KEY is missing" }),
    };
  }

  try {
    // Fetch Ninja API
    const response = await fetch(
      `https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}`,
      { headers: { "X-Api-Key": API_KEY } }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Ninja API failed: ${text}`);
    }

    const data = await response.json();

    // Format output
    const hour12 = data.hour % 12 === 0 ? 12 : data.hour % 12;
    const ampm = data.hour >= 12 ? "pm" : "am";
    const pad = (n) => (n < 10 ? "0" + n : n);

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
    const monthName = months[data.month - 1] || "Unknown";

    return {
      statusCode: 200,
      body: JSON.stringify({
        hour: hour12,
        minute: pad(data.minute),
        ampm,
        day_of_week: data.day_of_week,
        month: monthName,
        day: pad(data.day),
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
