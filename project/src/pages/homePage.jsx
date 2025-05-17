import { useNavigate } from "react-router-dom";
const HomePage = () => {
    const navigate = useNavigate();
    const changeURL = () => {
        navigate("/account");
    }
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button type="button" onClick={()=>changeURL()}>Go To Account Page</button>
    </div>
  );
};
export default HomePage;