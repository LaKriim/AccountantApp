import AccountPage from "./pages/accountPage";
import BudgetPage from "./pages/budgetPage";
import HomePage from "./pages/homePage";
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/onBoarding";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; // Import your theme
import ChatPage from "./pages/chatPage";
const root = ReactDOM.createRoot(document.getElementById("root"));

const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ClerkProvider publishableKey={publishableKey}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </Router>
      </ClerkProvider>
    </ThemeProvider>
  </React.StrictMode>
);
