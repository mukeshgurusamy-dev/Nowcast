// netlify/functions/time.js

const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const lat = event.queryStringParameters.lat;
  const lon = event.queryStringParameters.lon;
  const API_KEY = "ThZKOtGSBet1mEcoQqM7yA==jsQ0Yx2VZl6R0jKc";

  if (!lat || !lon) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Latitude and longitude are required" }),
    };
  }

  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/worldtime?&lat=${lat}&lon=${lon}`,
      { headers: { "X-Api-Key": API_KEY } }
    );
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch time data" }),
    };
  }
};
