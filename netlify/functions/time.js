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

  const API_KEY = process.env.WORLD_TIME_API_KEY;

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}`,
      {
        headers: { "X-Api-Key": API_KEY },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch time");

    const data = await response.json();

    // Helper function to pad numbers
    const pad = (n) => (n < 10 ? "0" + n : n);

    const hour12 = data.hour % 12 === 0 ? 12 : data.hour % 12;

    return {
      statusCode: 200,
      body: JSON.stringify({
        hour: pad(hour12),
        minute: pad(data.minute),
        ampm: data.hour >= 12 ? "pm" : "am",
        day_of_week: data.day_of_week,
        month: data.month,
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
