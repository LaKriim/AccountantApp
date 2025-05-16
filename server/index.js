const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const qs = require("querystring");

dotenv.config();

const app = express();
const PORT = 5000;
let stateSent = "123456";

let ACCESS_TOKEN = "";
let REALM_ID = "";

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
  "base64"
);

// Entry point
app.get("/", (req, res) => {
  const scope = "com.intuit.quickbooks.accounting";
  // com.intuit.quickbooks.accounting, openid, profile, email, phone, address
  const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${CLIENT_ID}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=${stateSent}`;

  res.send(`<a href="${authUrl}">Connect to QuickBooks</a>`);
});

// Callback endpoint after authorization
app.get("/callback", async (req, res) => {
  const { code } = req.query;
  const { state } = req.query;
  const { realmId } = req.query;
  let stateReceived = state || "";
  if (stateSent.localeCompare(stateReceived))
    return res.send("Unauthorized access");

  if (!code) return res.send("No code received");
  REALM_ID = realmId;
  try {
    const response = await axios.post(
      "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
      qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          Authorization: `Basic ${authHeader}`,
        },
      }
    );
    const { access_token } = response.data;
    ACCESS_TOKEN = access_token;
    //res.json(response.data);
    res.send(`<a href="localhost:5000/api/company-info"> See info </a>`);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("Token exchange failed");
  }
});

app.get("/api/company-info", async (req, res) => {
  try {
    const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${REALM_ID}/companyinfo/${REALM_ID}`;

    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Failed to fetch company info");
  }
});
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
