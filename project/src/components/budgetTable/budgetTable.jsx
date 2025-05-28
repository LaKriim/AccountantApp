import React from "react";
const BudgetTable = ({ data, explanation }) => {
  const monthLabels = [
    "June 2025", "July 2025", "August 2025", "September 2025", "October 2025", "November 2025",
    "December 2025", "January 2026", "February 2026", "March 2026", "April 2026", "May 2026"
  ];

  // Group data by category
  const groupedData = data.reduce((acc, row) => {
    if (!acc[row.category]) acc[row.category] = [];
    acc[row.category].push(row);
    return acc;
  }, {});

  const renderExplanation = (explanationPart) => {
    if (typeof explanationPart === "string") {
      return <p>{explanationPart}</p>;
    } else if (typeof explanationPart === "object" && explanationPart !== null) {
      return (
        <ul>
          {Object.entries(explanationPart).map(([key, value], idx) => (
            <li key={idx}>
              <strong>{key}:</strong>{" "}
              {typeof value === "object" && value !== null
                ? renderExplanation(value)
                : value}
            </li>
          ))}
        </ul>
      );
    } else {
      return <p>No explanation provided.</p>;
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>📊 Profit & Loss Forecast</h4>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Account</th>
            {monthLabels.map((month, idx) => (
              <th key={idx}>{month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedData).map(([category, rows]) => (
            <React.Fragment key={category}>
              {/* 🔥 Category header row spanning all columns */}
              <tr style={{ backgroundColor: "#d0d0d0", fontWeight: "bold" }}>
                <td colSpan={monthLabels.length + 1}>{category}</td>
              </tr>
              {/* Account rows under this category */}
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.account}</td>
                  {row.amounts.map((amt, i) => (
                    <td key={i} style={{ textAlign: "right" }}>{amt.toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <h4>📝 Explanation</h4>
      {renderExplanation(explanation)}
    </div>
  );
};

 


export default BudgetTable; 