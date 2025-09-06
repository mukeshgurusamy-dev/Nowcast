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

  try {
    // Get approximate timezone by lat/lon using TimeZone API (WorldTimeAPI fallback)
    // Here, using a fixed GMT fallback since WorldTimeAPI doesn't accept lat/lon directly
    const response = await fetch(
      `http://worldtimeapi.org/api/timezone/Etc/GMT`
    );
    if (!response.ok) throw new Error("Failed to fetch time");

    const data = await response.json();
    const date = new Date(data.datetime);

    let hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12 === 0 ? 12 : hour % 12;

    const day_of_week = date.toLocaleString("en-US", { weekday: "long" });
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();

    // Helper to pad numbers
    const pad = (n) => (n < 10 ? "0" + n : n);

    return {
      statusCode: 200,
      body: JSON.stringify({
        hour,
        minute: pad(minute),
        ampm,
        day_of_week,
        month,
        day: pad(day),
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
