const CLIENT_ID = "ABOUpINa1zRwO4qTDGHj0PN8X06yWSjeKHgdq7N928AwcUJB4G"; // Safe for frontend
const REDIRECT_URI = "http://localhost:5000/callback"; // Your backend callback
const STATE = crypto.randomUUID(); // Optional: can be random or from session
export const getQboAuthUrl = () => {
  const scope = "com.intuit.quickbooks.accounting";

  const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${CLIENT_ID}&response_type=code&scope=${scope}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=${STATE}`;

  return authUrl;
};

export const startQboAuthFlow = () => {
  const url = getQboAuthUrl();
  window.location.href = url;
};
