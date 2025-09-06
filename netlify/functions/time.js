exports.handler = async function (event, context) {
  const city = event.queryStringParameters.city || "Asia/Kolkata";
  const url = `https://worldtimeapi.org/api/timezone/${city}`;

  try {
    const response = await fetch(url); // built-in fetch
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
