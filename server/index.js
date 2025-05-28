const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const qs = require("querystring");
const cors = require("cors");
const { getOpenAIResponse } = require("./openaiClient"); // Import the OpenAI client

const prompt1 = require("./prompts/generateCostSuggestionsPrompt"); // Import predefined prompt 1
const prompt2 = require("./prompts/generateBudgetPrompt");
const prompt3 = require("./prompts/generateProfitAndLoss"); // Import predefined prompt 3
let openAIResponse = "";
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
app.use(express.json()); // This will allow Express to parse the JSON body in POST requests

let allData = {};
let generatedBudget;
let chatContext = {
  budget: {}, // Store the initial budget here (parsedData)
  history: [], // Store the conversation history here
};

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

app.get("/api/combined-data", async (req, res) => {
  try {
    // Initialize an object to hold the combined data
    const combinedData = {};

    // Fetch Company Info
    const companyInfoResponse = await axios.get(
      `https://sandbox-quickbooks.api.intuit.com/v3/company/${REALM_ID}/companyinfo/${REALM_ID}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    combinedData.companyInfo = companyInfoResponse.data;

    // // Fetch Budget Data
    // const query = "SELECT * FROM Budget";
    // const budgetResponse = await axios.get(
    //   `https://sandbox-quickbooks.api.intuit.com/v3/company/${REALM_ID}/query?query=${encodeURIComponent(
    //     query
    //   )}&minorversion=${minorversion}`,
    //   {
    //     headers: {
    //       "Content-Type": "application/text",
    //       Accept: "application/json",
    //       Authorization: `Bearer ${ACCESS_TOKEN}`,
    //     },
    //   }
    // );
    //combinedData.budget = budgetResponse.data;

    // Fetch Account Data
    const accountQuery = "SELECT * FROM Account"; // You can modify this query based on your requirements
    const accountsResponse = await axios.get(
      `https://sandbox-quickbooks.api.intuit.com/v3/company/${REALM_ID}/query?query=${encodeURIComponent(
        accountQuery
      )}&minorversion=${minorversion}`,
      {
        headers: {
          "Content-Type": "text/plain",
          Accept: "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    const rawAccounts = accountsResponse.data.QueryResponse.Account || [];

    const cleanedAccounts = rawAccounts.map(({ MetaData, ...rest }) => rest);

    //combinedData.accounts = { Account: cleanedAccounts };

    // combinedData.accounts = accountsResponse.data.QueryResponse;

    // Fetch Account List Detail Data (with query parameters from client)
    const {
      account_type = "",
      start_date = "",
      end_date = "",
      sort_by = "",
      sort_order = "",
      account_status = "",
      columns = "",
    } = req.query;

    const accountListDetailUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${REALM_ID}/reports/AccountList?account_type=${account_type}&start_date=${start_date}&end_date=${end_date}&sort_by=${sort_by}&sort_order=${sort_order}&account_status=${account_status}&columns=${columns}&minorversion=${minorversion}`;

    const accountListDetailResponse = await axios.get(accountListDetailUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    combinedData.accountListDetail = accountListDetailResponse.data;

    // Fetch Balance Sheet Data
    const balanceSheetUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${REALM_ID}/reports/BalanceSheet?minorversion=${minorversion}`;
    const balanceSheetResponse = await axios.get(balanceSheetUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    combinedData.balanceSheet = balanceSheetResponse.data;

    // ✅ Fetch Profit and Loss Data — moved inside try
    const profitAndLossUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${REALM_ID}/reports/ProfitAndLoss?minorversion=${minorversion}`;
    const profitAndLossResponse = await axios.get(profitAndLossUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    combinedData.profitAndLoss = profitAndLossResponse.data;

    // ✅ Finalize and respond
    allData = combinedData;
    //console.log(combinedData);
    res.json(combinedData);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send("Failed to fetch combined data");
  }
});

// app.get("/ask", async (req, res) => {
//   try {
//     const { companyInfo, accountListDetail, profitAndLoss, balanceSheet } = allData;

//     const promptWithData = `
// ${prompt3.prompt}

// Here is the QuickBooks financial data:

// Company Info:
// ${JSON.stringify(companyInfo, null, 2)}

// Account List:
// ${JSON.stringify(accountListDetail, null, 2)}

// Profit and Loss (Current):
// ${JSON.stringify(profitAndLoss, null, 2)}

// Balance Sheet:
// ${JSON.stringify(balanceSheet, null, 2)}
// `;

//     // Get raw OpenAI response
//     const rawResponse = await getOpenAIResponse(promptWithData);

//     // Return the raw response as-is, no parsing or extraction
//     res.send(rawResponse);

//   } catch (error) {
//     console.error("Error in /ask route:", error);
//     res.status(500).send("Failed to fetch OpenAI response");
//   }});

app.get("/ask", async (req, res) => {
  try {
    const { companyInfo, accountListDetail, profitAndLoss, balanceSheet } =
      allData;

    const promptWithData = `
${prompt3.prompt}

Here is the QuickBooks financial data:

Company Info:
${JSON.stringify(companyInfo, null, 2)}

Account List:
${JSON.stringify(accountListDetail, null, 2)}

Profit and Loss (Current):
${JSON.stringify(profitAndLoss, null, 2)}

Balance Sheet:
${JSON.stringify(balanceSheet, null, 2)}
`;

    const rawResponse = await getOpenAIResponse(promptWithData);

    console.log("----- OpenAI Raw Response -----");
    console.log(rawResponse);
    console.log("----- End of OpenAI Raw Response -----");

    // Find JSON start and end
    let jsonStart = rawResponse.indexOf("{");
    let jsonEnd = rawResponse.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      return res
        .status(500)
        .send({ error: "No JSON found in response", rawResponse });
    }

    // Extract and robustly clean the JSON text
    let jsonText = rawResponse
      .slice(jsonStart, jsonEnd + 1)
      .replace(/\\\s*\n\s*/g, " ") // Remove escaped newlines
      .replace(/\r?\n|\r/g, " ") // Remove actual newlines
      .replace(/\t/g, " ") // Replace tabs with spaces
      .replace(/\s\s+/g, " "); // Collapse multiple spaces

    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      return res.status(500).send({
        error: "JSON parsing failed",
        rawResponse,
        parseError: parseError.message,
      });
    }

    res.json(parsedData);
    generatedBudget = parsedData;
    console.log("Parsed OpenAI response:", parsedData);
  } catch (error) {
    console.error("Error in /ask route:", error);
    res.status(500).send("Failed to fetch or process OpenAI response");
  }
});

app.post("/chat", async (req, res) => {
  const { message } = req.body; // User's message/question

  try {
    let { budget, history } = chatContext; // Retrieve current budget and conversation history

    // Log the user message to the conversation history
    history.push({ user: message, ai: "" }); // AI response will be generated next

    // Construct the prompt with the current budget and conversation history
    const prompt = `
      You are a financial assistant helping the user with their budget. Here is the current budget:
      ${JSON.stringify(budget, null, 2)}
      Previous conversation:
      ${history.map((item) => `User: ${item.user}\nAI: ${item.ai}`).join("\n")}
      The user is asking: "${message}"
      Please determine if the user is asking for a modification to the budget or just inquiring about it. 
      If it's a modification request, update the budget accordingly and return the WHOLE new budget.
      If it's an inquiry, respond with helpful insights based on the current budget.
    `;

    // Get OpenAI response
    const aiResponse = await getOpenAIResponse(prompt);

    // Add AI response to conversation history
    history[history.length - 1].ai = aiResponse;

    // Parse the AI response as JSON (assuming the AI returns a structured JSON response)
    let parsedResponse = { response: aiResponse }; // Default to raw AI response

    try {
      // Check if the AI response contains the updated budget (in JSON format)
      const jsonStart = aiResponse.indexOf("{");
      const jsonEnd = aiResponse.lastIndexOf("}");

      // If the response contains JSON (look for "ProfitAndLossForecast" key)
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const budgetString = aiResponse.slice(jsonStart, jsonEnd + 1); // Extract JSON part
        parsedResponse = JSON.parse(budgetString); // Parse the JSON object

        // Log the extracted JSON (updated budget)
        console.log(
          "Extracted Updated Budget:",
          JSON.stringify(parsedResponse.ProfitAndLossForecast, null, 2)
        );
        console.log("nouveau budget extracted");

        // If an updated budget is found, update the chatContext's budget
        if (parsedResponse && parsedResponse.ProfitAndLossForecast) {
          chatContext.budget = parsedResponse.ProfitAndLossForecast;
        }
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
      // If JSON parsing fails, keep the response as is (this is the default case)
    }

    // Store updated conversation history and budget
    chatContext.history = history;

    // Send the AI response along with the updated budget and history
    res.json({
      response: parsedResponse.response || "The budget has been updated.", // Response from AI or fallback message
      budget: chatContext.budget, // The updated budget
      history: chatContext.history, // Updated conversation history
    });
  } catch (error) {
    console.error("Error in /chat route:", error);
    res.status(500).send("Failed to process AI response");
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
