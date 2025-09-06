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

  const API_KEY = process.env.WORLD_TIME_API_KEY; // Ninja API key

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}`,
      { headers: { "X-Api-Key": API_KEY } }
    );

    if (!response.ok) throw new Error("Failed to fetch time");

    const data = await response.json();

    // Convert 24h to 12h format
    let hour = data.hour % 12 === 0 ? 12 : data.hour % 12;
    let minute = data.minute < 10 ? "0" + data.minute : data.minute;
    let ampm = data.hour >= 12 ? "pm" : "am";

    // Month names
    const monthNames = [
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
    const month = monthNames[data.month - 1] || "Unknown";

    // Day with leading zero
    const day = data.day < 10 ? "0" + data.day : data.day;

    return {
      statusCode: 200,
      body: JSON.stringify({
        hour,
        minute,
        ampm,
        day_of_week: data.day_of_week,
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
