// netlify/functions/time.js
exports.handler = async function (event, context) {
  const lat = event.queryStringParameters.lat;
  const lon = event.queryStringParameters.lon;

  if (!lat || !lon) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing latitude or longitude" }),
    };
  }

  const API_KEY = process.env.WORLD_TIME_API_KEY; // Set in Netlify env

  const url = `https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url, {
      headers: { "X-Api-Key": API_KEY },
    });
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
