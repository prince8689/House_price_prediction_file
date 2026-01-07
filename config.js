const fetch = require("node-fetch");

async function getAccessToken() {
  const apiKey = process.env.IBM_API_KEY;

  const res = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`
  });

  const data = await res.json();
  return data.access_token;
}

module.exports = { getAccessToken };
