exports.handler = async function (event, context) {
  const lat = event.queryStringParameters.lat;
  const lon = event.queryStringParameters.lon;
  const url = `https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url, {
      headers: { "X-Api-Key": process.env.WORLD_TIME_API_KEY },
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
