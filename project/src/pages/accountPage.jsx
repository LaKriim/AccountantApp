import React, { useEffect, useState } from "react";
import AccountCard from "../components/accountCard/accountCard";
import axios from "axios";
const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAccountData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/accounts");
      const data = response.data;
      setAccounts(data.Account);
    } catch (error) {
      console.error("Error fetching account data:", error);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    fetchAccountData();
  }, [accounts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {accounts.map((account) => (
        <AccountCard
          name={account.Name}
          classification={account.Classification}
        />
      ))}
    </div>
  );
};
export default AccountPage;
