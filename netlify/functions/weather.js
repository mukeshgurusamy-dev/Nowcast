exports.handler = async function (event, context) {
  const API_KEY = "YOUR_OPENWEATHER_API_KEY";
  const city = event.queryStringParameters.city || "Chennai";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url); // built-in fetch, no node-fetch
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
