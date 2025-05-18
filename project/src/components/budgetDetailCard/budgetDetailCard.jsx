
import React, { useState } from "react";
const BudgetDetailCard = ({ details, name }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!details || details.length === 0) {
    return <p>No budget details available.</p>;
  }

  return (
    <div>
      <h3>{name} Details : </h3>
      {details.map((detail, index) => (
        <div
          key={index}
          className={`budget-card-detail ${
            hoveredIndex === index ? "hovered" : ""
          }`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <p>
            <strong>Date:</strong> {detail.BudgetDate}
          </p>
          <p>
            <strong>Amount:</strong> ${detail.Amount.toLocaleString()}
          </p>
          <p>
            <strong>Account:</strong> {detail.AccountRef?.name} (ID:{" "}
            {detail.AccountRef?.value})
          </p>
        </div>
      ))}
    </div>
  );
};

export default BudgetDetailCard;
