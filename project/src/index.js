import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import AccountPage from "./pages/accountPage";
import BudgetPage from "./pages/budgetPage";
import HomePage from "./pages/homePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/budget" element={<BudgetPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
