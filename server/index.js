const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const qs = require("querystring");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
const PORT = 5000;
let ACCESS_TOKEN = "";
let REALM_ID = "";
const minorversion = "75";
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
  "base64"
);

// Callback endpoint after authorization
app.get("/callback", async (req, res) => {
  const { code } = req.query;
  const { realmId } = req.query;

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
    res.redirect("http://localhost:3000/onboarding?step=2&provider=quickbooks");
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
// Fetch Budget Data
app.get("/api/budget", async (req, res) => {
  try {
    const query = "SELECT * FROM Budget";
    //const minorversion = "75"; // Adjust based on the API version you're using

    const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${REALM_ID}/query?query=${encodeURIComponent(
      query
    )}&minorversion=${minorversion}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/text",
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    // res.json(response.data);
    //console.log(response.data.QueryResponse);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(response.data, null, 2)); // 2-space indentation
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Failed to fetch budget data");
  }
});
// Fetch Account Data
// Fetch Revenue/Expense Accounts
app.get("/api/accounts", async (req, res) => {
  try {
    // Properly formatted query for QuickBooks API
    const query =
      "SELECT * FROM Account WHERE Classification IN ('Revenue', 'Expense')";

    const url = `https://sandbox-quickbooks.api.intuit.com/v3/company/${REALM_ID}/query?query=${encodeURIComponent(
      query
    )}&minorversion=${minorversion}`;

    const response = await axios.get(url, {
      headers: {
        "Content-Type": "text/plain",
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    // Return the complete QueryResponse
    res.json(response.data.QueryResponse);
  } catch (error) {
    // Improved error response showing the complete API error
    res.status(500).json({
      error: "QuickBooks API Error",
      details: error.response?.data || error.message,
      query: query, // Shows the exact query that failed
    });
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
