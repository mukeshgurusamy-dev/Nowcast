// netlify/functions/time.js
exports.handler = async function (event, context) {
  const timezoneOffset = parseInt(event.queryStringParameters.timezone); // seconds from UTC

  if (isNaN(timezoneOffset)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing or invalid timezone" }),
    };
  }

  try {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000; // current UTC in ms
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
