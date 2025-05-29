require("dotenv").config(); // Load environment variables from .env

const { OpenAI } = require("openai");

// Create the OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key from .env
});

// async function getOpenAIResponse(prompt) {
//   try {
//     const response = await client.responses.create({
//       model: "gpt-4",
//       input: prompt,
//     });

//     // Return the raw output text directly
//     return response.output_text;
//   } catch (error) {
//     console.error(" Error with OpenAI API:", error);
//     throw error;
//   }
// }
async function getOpenAIResponse(prompt) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4-turbo", // Use GPT-4-turbo with extended context window
      messages: [
        { role: "system", content: "You are a helpful financial assistant that generates a Profit & Loss forecast based on provided financial data." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7, // Optional: adjust creativity level
      //max_tokens: 8000  // Optional: adjust response length (tune as needed)
    });

    // Extract and return the response text (from the assistant message)
    const outputText = response.choices[0].message.content;
    return outputText;

  } catch (error) {
    console.error(" Error with OpenAI API:", error);
    throw error;
  }
}

module.exports = { getOpenAIResponse };
 