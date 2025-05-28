import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BudgetTable from "../components/budgetTable/budgetTable";
import axios from "axios";

const BudgetPage = () => {
  const navigate = useNavigate();
  const navigateHome = () => navigate("/");
  const navigateAccount = () => navigate("/account");

  const [tableData, setTableData] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(true);

  const generateBudget = async () => {
    try {
      setLoading(true); // 🔥 Show loading when regenerating
      const response = await axios.get("http://localhost:5000/ask");
      const data = response.data;

      const forecast = data.ProfitAndLossForecast;
      const reshapedData = [];

      for (let category in forecast) {
        for (let account in forecast[category]) {
          const amounts = forecast[category][account]; // Array of 12 amounts
          reshapedData.push({ category, account, amounts });
        }
      }

      setTableData(reshapedData);
      setExplanation(data.Explanation);
    } catch (error) {
      console.error("Error generating budget data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateBudget();
  }, []);

  return (
    <div>
      <button onClick={navigateHome}>Go Home</button>
      <button onClick={navigateAccount}>Go to Account</button>
      <h3>Budget Page</h3>

      {/* 🔄 Button to regenerate budget */}
      <button onClick={generateBudget} style={{ margin: "10px 0", padding: "8px 16px" }}>
        Regenerate Budget with Roy
      </button>

      {loading ? (
        <div>Loading budget data...</div>
      ) : (
        <BudgetTable data={tableData} explanation={explanation} />
      )}
    </div>
  );
};

export default BudgetPage;
