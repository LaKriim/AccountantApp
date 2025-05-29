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
    if (parsedData.ProfitAndLossForecast) {
      chatContext.budget = parsedData.ProfitAndLossForecast;
      chatContext.history = []; // 🔥 Clear old history for the new budget
    } else {
      console.warn("ProfitAndLossForecast not found in parsed data");
      chatContext.budget = {};
      chatContext.history = []; // 🔥 Clear old history anyway
    }

    res.json(parsedData);

    console.log("Parsed OpenAI response:", parsedData);
    console.log("first budget", chatContext.budget);
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
    history.push({ user: message, ai: "" });

    //Use the original full prompt (which asks the AI to modify or provide insight)
    // const prompt = `
    //       You are a financial assistant helping the user with their budget. Here is the current budget:
    //       ${JSON.stringify(budget, null, 2)}
    //       Previous conversation:
    // ${history
    //   .slice(-5) // Get last 5 messages
    //   .map((item) => `User: ${item.user}\nAI: ${item.ai}`)
    //   .join("\n")}
    //       The user is asking: "${message}"
    //       Please determine if the user is asking for a modification to the budget or just inquiring about it.
    //       If it's a modification request, update the budget accordingly and return the WHOLE new budget.Ensure that the budget remains balanced after the adjustment, reflecting proportional relationships between categories.
    //       If it's an inquiry, respond with helpful insights based on the current budget.
    //     `;
    const prompt = `
You are a financial assistant helping the user with their budget. Here is the current budget that you created:
${JSON.stringify(budget, null, 2)}

Previous conversation:
${history
  .slice(-5)
  .map((item) => `User: ${item.user}\nAI: ${item.ai}`)
  .join("\n")}

The user is asking: "${message}"

Instructions:
1. Determine if the user is asking for a real budget modification or just an inquiry or hypothetical analysis.
   - A **real modification** request contains explicit instructions like "change", "update", "set", "increase by", "decrease to".
   - A **hypothetical** or **inquiry** request contains phrases like "if", "how would", "what would happen", "how does", "explain".
2. If it is a **real modification request**:
   - Apply the requested change to the specified category.
   - Rebalance all other categories proportionally to maintain financial consistency.
   - Return the updated budget as a complete JSON object with full explicit numeric arrays.
3. If it is an **inquiry/hypothetical request**:
   - Do not modify the actual budget.
   - Provide helpful insights, explanations, or projections based on the current budget.
   - Do not return a JSON budget—just provide plain text analysis.

Important:
- Only modify the budget if the user **explicitly requests a real change**.
- Otherwise, provide text-based insights without any budget modifications.
- When providing an updated budget, return a valid JSON object with full arrays (no [...]).
- When providing insights, avoid JSON and return plain text explanations.
`;

    // Get OpenAI response
    const aiResponse = await getOpenAIResponse(prompt);
    //here begins the Algorithm
    //look for json object in the AI response
    const jsonStart = aiResponse.indexOf("{");
    const jsonEnd = aiResponse.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      //parse it if found then extract
      const jsonString = aiResponse.slice(jsonStart, jsonEnd + 1);
      try {
        const parsedBudget = JSON.parse(jsonString);
        chatContext.budget = parsedBudget; // 🔥 Update the budget
        console.log("Updated budget:", parsedBudget);
        //update the history with the new budget
        //remove the json from airesponse
        const aiWithoutJson = (
          aiResponse.slice(0, jsonStart).trim() +
          " " +
          aiResponse.slice(jsonEnd + 1).trim()
        )
          .replace(/```json/g, "") // Remove ```json
          .replace(/```/g, "") // Remove ```
          .trim();

        history[history.length - 1].ai = aiWithoutJson; // fallback if text is empty
        chatContext.history = history;
        //send the response
        res.json({
          response: aiWithoutJson,
          budget: chatContext.budget,
          history: chatContext.history,
        });
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        history[history.length - 1].ai = aiResponse;
        chatContext.history = history;
        res.json({
          response: aiResponse,
          budget: chatContext.budget, // Keep old budget
          history: chatContext.history,
        });
      }
      //no json found , basic implmentation
    } else {
      history[history.length - 1].ai = aiResponse;
      chatContext.history = history;
      res.json({
        response: aiResponse,
        budget: chatContext.budget, // No budget change
        history: chatContext.history,
      });
    }
  } catch (error) {
    console.error("Error in /chat route:", error);
    res.status(500).send("Failed to process chat");
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
