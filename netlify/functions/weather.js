// netlify/functions/weather.js
exports.handler = async function (event, context) {
  const API_KEY = process.env.OPENWEATHER_API_KEY; // Make sure this is set in Netlify env
  const city = event.queryStringParameters.city || "Chennai";

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "OpenWeather API key is missing" }),
    };
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // City not found or other error
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `City "${city}" not found` }),
      };
    }

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
