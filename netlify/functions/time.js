// netlify/functions/time.js
exports.handler = async function (event, context) {
  const lat = parseFloat(event.queryStringParameters.lat);
  const lon = parseFloat(event.queryStringParameters.lon);
  const timezoneOffset = parseInt(event.queryStringParameters.timezone); // in seconds

  if (isNaN(lat) || isNaN(lon) || isNaN(timezoneOffset)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid lat/lon/timezone" }),
    };
  }

  try {
    // Calculate local time using UTC + timezone offset
    const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(utc + timezoneOffset * 1000);

    const hour24 = localTime.getHours();
    const minute = localTime.getMinutes();
    const ampm = hour24 >= 12 ? "pm" : "am";
    const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;

    const day_of_week = localTime.toLocaleString("en-US", { weekday: "long" });
    const month = localTime.toLocaleString("en-US", { month: "long" });
    const day = localTime.getDate();

    return {
      statusCode: 200,
      body: JSON.stringify({
        hour,
        minute,
        ampm,
        day_of_week,
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
