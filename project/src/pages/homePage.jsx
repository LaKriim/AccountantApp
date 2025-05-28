import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();
  const navigateAccount = () => {
    navigate("/account");
  };
  const navigateBudget = () => {
    navigate("/budget");
  };
  const navigateSignIn = () => {
    navigate("/signIn");
  };
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button type="button" onClick={() => navigateAccount()}>
        Go To Account Page
      </button>
      <button type="button" onClick={() => navigateBudget()}>
        Generate a Budget with ROY{" "}
      </button>
      <button type="button" onClick={() => navigateSignIn()}>
        Go To Sign In Page
      </button>
    </div>
  );
};
export default HomePage;
