// netlify/functions/time.js
exports.handler = async function (event, context) {
  const lat = parseFloat(event.queryStringParameters.lat);
  const lon = parseFloat(event.queryStringParameters.lon);
  const dt = parseInt(event.queryStringParameters.dt); // Pass OpenWeather dt
  const timezone = parseInt(event.queryStringParameters.timezone); // Pass OpenWeather timezone offset in seconds

  if (isNaN(lat) || isNaN(lon) || isNaN(dt) || isNaN(timezone)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid parameters" }),
    };
  }

  try {
    // Calculate local time using dt and timezone offset
    const localTime = new Date((dt + timezone) * 1000);

    let hours = localTime.getUTCHours();
    const minutes = localTime.getUTCMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 === 0 ? 12 : hours % 12;

    const pad = (n) => (n < 10 ? "0" + n : n);

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
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

    const dayOfWeek = dayNames[localTime.getUTCDay()];
    const month = monthNames[localTime.getUTCMonth()];
    const day = pad(localTime.getUTCDate());

    return {
      statusCode: 200,
      body: JSON.stringify({
        hour: hours,
        minute: pad(minutes),
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
