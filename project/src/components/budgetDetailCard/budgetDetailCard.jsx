import React, { useState } from "react";
import Pagination from "@mui/material/Pagination";

const ITEMS_PER_PAGE = 5;

const BudgetDetailCard = ({ details, name }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(details.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = details.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  if (!details || details.length === 0) {
    return <p>No budget details available.</p>;
  }

  return (
    <div>
      <h3>{name} Details : </h3>
      {/* {details.map((detail, index) => ( */}
      {currentItems.map((detail, index) => (
      <div
        key={index + startIndex}
        className={`budget-card-detail ${
          hoveredIndex === index + startIndex ? "hovered" : ""
        }`}
        onMouseEnter={() => setHoveredIndex(index + startIndex)}
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
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined"
        sx={{ marginTop: "1rem" }}
      />
    </div>
  );
};

export default BudgetDetailCard;
