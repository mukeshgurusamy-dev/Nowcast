// netlify/functions/time.js
// This function calculates local time from OpenWeather dt + timezone
exports.handler = async function (event, context) {
  try {
    const dt = parseInt(event.queryStringParameters.dt);
    const timezone = parseInt(event.queryStringParameters.timezone);

    if (isNaN(dt) || isNaN(timezone)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing or invalid dt/timezone" }),
      };
    }

    // Calculate local time
    const localTime = new Date((dt + timezone) * 1000); // UTC + offset
    let hour = localTime.getUTCHours();
    const ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12 === 0 ? 12 : hour % 12;
    const minute = localTime.getUTCMinutes().toString().padStart(2, "0");
    const day_of_week = localTime.toLocaleString("en-US", { weekday: "long" });
    const month = localTime.toLocaleString("en-US", { month: "long" });
    const day = localTime.getUTCDate().toString().padStart(2, "0");

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
