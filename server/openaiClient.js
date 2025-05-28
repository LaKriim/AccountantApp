require("dotenv").config(); // Load environment variables from .env

const { OpenAI } = require("openai");

// Create the OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key from .env
});

async function getOpenAIResponse(prompt) {
  try {
    const response = await client.responses.create({
      model: "gpt-3.5-turbo",
      input: prompt,
    });

    // Return the raw output text directly
    return response.output_text;
  } catch (error) {
    console.error(" Error with OpenAI API:", error);
    throw error;
  }
}
module.exports = { getOpenAIResponse };
 