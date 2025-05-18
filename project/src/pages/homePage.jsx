import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();
  const fetchAccountData = () => {
    navigate("/account");
  };
  const fetchBudgetData = () => {
    navigate("/budget");
  };
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button type="button" onClick={() => fetchAccountData()}>
        Go To Account Page
      </button>
      <button type="button" onClick={() => fetchBudgetData()}>
        Go To Budget Page
      </button>
    </div>
  );
};
export default HomePage;
