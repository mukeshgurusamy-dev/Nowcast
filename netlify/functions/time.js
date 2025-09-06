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
    // TimeAPI.io — no API key required
    const response = await fetch(
      `https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`
    );
    if (!response.ok) throw new Error("Failed to fetch time");

    const data = await response.json();

    // 12-hour format
    const hour12 = data.hour % 12 === 0 ? 12 : data.hour % 12;
    const ampm = data.hour >= 12 ? "pm" : "am";

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
    const monthName = monthNames[data.month - 1] || "Unknown";

    // Pad minutes and day
    const pad = (n) => (n < 10 ? "0" + n : n);

    return {
      statusCode: 200,
      body: JSON.stringify({
        hour: hour12, // e.g. 1, 2, 12
        minute: pad(data.minute), // e.g. 02, 09
        ampm, // am / pm
        day_of_week: data.dayOfWeek,
        month: monthName,
        day: pad(data.day), // e.g. 06
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
