  import React from "react";

// const UpdatedGeneratedBudget = ({ data }) => {
//   if (!data) return null;

//   console.log("Received budget data:", data);

//   return (
//     <table border="1">
//       <thead>
//         <tr>
//           <th>Category</th>
//           <th>Account</th>
//           <th>Values</th>
//         </tr>
//       </thead>
//       <tbody>
//         {Object.entries(data).map(([category, accounts]) =>
//           Object.entries(accounts).map(([account, values], idx) => (
//             <tr key={`${category}-${account}-${idx}`}>
//               <td>{category}</td>
//               <td>{account}</td>
//               <td>{Array.isArray(values) ? values.join(", ") : values}</td>
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   );
// };
const UpdatedGeneratedBudget = ({ data }) => {
  const monthLabels = [
    "June 2025", "July 2025", "August 2025", "September 2025", "October 2025", "November 2025",
    "December 2025", "January 2026", "February 2026", "March 2026", "April 2026", "May 2026"
  ];

  return (
    <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead style={{ backgroundColor: "#f0f0f0" }}>
        <tr>
          <th style={{ textAlign: "left" }}>Account</th>
          {monthLabels.map((month, idx) => (
            <th key={idx}>{month}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([category, subcategories]) => (
          <React.Fragment key={category}>
            {/* Category Header Row */}
            <tr>
              <td colSpan={monthLabels.length + 1} style={{
                fontWeight: "bold",
                backgroundColor: "#ddd",
                textAlign: "left"
              }}>
                {category}
              </td>
            </tr>
            {/* Subcategory Rows */}
            {Object.entries(subcategories).map(([subcategory, values]) => (
              <tr key={subcategory}>
                <td style={{ textAlign: "left" }}>{subcategory}</td>
                {values.map((val, idx) => (
                  <td key={idx} style={{ textAlign: "right" }}>${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                ))}
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};
export default UpdatedGeneratedBudget;
// export default UpdatedGeneratedBudget;
