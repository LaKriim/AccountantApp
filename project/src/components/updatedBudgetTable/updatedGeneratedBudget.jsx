// import React from "react";

// const UpdatedGeneratedBudget = ({ data }) => {
//   const monthLabels = [
//     "June 2025", "July 2025", "August 2025", "September 2025", "October 2025", "November 2025",
//     "December 2025", "January 2026", "February 2026", "March 2026", "April 2026", "May 2026"
//   ];

//   // Helper function to render rows dynamically based on the incoming data
//   const renderTableRows = (categoryData) => {
//     return Object.entries(categoryData).map(([account, values]) => (
//       <tr key={account}>
//         <td>{account}</td>
//         {values.map((value, index) => (
//           <td key={index} style={{ textAlign: "right" }}>
//             {value.toLocaleString("en-US", { style: "currency", currency: "USD" })}
//           </td>
//         ))}
//       </tr>
//     ));
//   };

//   return (
//     <div style={{ marginTop: "20px" }}>
//       <h4>📊 Budget Overview</h4>
//       <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead style={{ backgroundColor: "#f0f0f0" }}>
//           <tr>
//             <th>Account</th>
//             {monthLabels.map((month, idx) => (
//               <th key={idx}>{month}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {/* Render rows for Income category */}
//           <tr style={{ backgroundColor: "#d0d0d0", fontWeight: "bold" }}>
//             <td colSpan={monthLabels.length + 1}>Income</td>
//           </tr>
//           {renderTableRows(data.Income)}

//           {/* Render rows for Cost of Goods Sold category */}
//           <tr style={{ backgroundColor: "#d0d0d0", fontWeight: "bold" }}>
//             <td colSpan={monthLabels.length + 1}>Cost of Goods Sold</td>
//           </tr>
//           {renderTableRows(data["Cost of Goods Sold"])}

//           {/* Render rows for Expenses category */}
//           <tr style={{ backgroundColor: "#d0d0d0", fontWeight: "bold" }}>
//             <td colSpan={monthLabels.length + 1}>Expenses</td>
//           </tr>
//           {renderTableRows(data.Expenses)}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default UpdatedGeneratedBudget;
