import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BudgetCard from "../components/budgetCard/budgetCard";
import axios from "axios";
import BudgetDetailCard from "../components/budgetDetailCard/budgetDetailCard";
const BudgetPage = () => {
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate("/");
  };
  const navigateAccount = () => {
    navigate("/account");
  };
  const [budgets, setbudgets] = useState();
  const [loading, setLoading] = useState(true);
  const fetchBudgetData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/budget");
      const data = response.data;
      setbudgets(data.QueryResponse.Budget);
    } catch (error) {
      console.error("Error fetching budget data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBudgetData();
  }, [budgets]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button type="button" onClick={() => navigateHome()}>
        Go To Home Page
      </button>
      <button type="button" onClick={() => navigateAccount()}>
        Go To Account Page
      </button>
      <h3 style={{ textDecoration: "underline" }}>Budget Page</h3>

      {budgets.map((budget) => (
        <div>
          <BudgetCard
            name={budget.Name}
            startDate={budget.StartDate}
            endDate={budget.EndDate}
          />
          <BudgetDetailCard details={budget.BudgetDetail} name={budget.Name} />
        </div>
      ))}
    </div>
  );
};
export default BudgetPage;
