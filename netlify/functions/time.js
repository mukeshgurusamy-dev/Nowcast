// netlify/functions/time.js
const tzlookup = require("tz-lookup"); // npm install tz-lookup

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
    const timezone = tzlookup(lat, lon); // get timezone string
    const response = await fetch(
      `http://worldtimeapi.org/api/timezone/${timezone}`
    );
    const data = await response.json();

    const date = new Date(data.datetime);

    const hour24 = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour24 >= 12 ? "pm" : "am";
    const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;

    const day_of_week = date.toLocaleString("en-US", { weekday: "long" });
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();

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
