
// module.exports = {
//   prompt: `You are provided with historical financial data from QuickBooks in JSON format, including:
// - Company Info (\`companyInfo\`)
// - Chart of Accounts (\`accountListDetail\`)
// - Current Profit & Loss (\`profitAndLoss\`)
// - Balance Sheet (\`balanceSheet\`)

// Task:
// Generate a detailed, realistic Profit & Loss forecast for the next year (monthly), starting from the month after the last date in the data.

// Instructions:
// - Analyze historical data for seasonality (e.g., holiday peaks, summer slowdowns) and apply it to forecast income, COGS, and expenses.
// - Incorporate market drivers (e.g., promotions, industry trends, material costs) and business factors (e.g., insurance renewals, maintenance spikes).
// - Avoid linear trends. Use realistic, business-driven variations based on historical patterns and logical assumptions.
// - All values must be numeric. No placeholders or constant values unless justified by historical data.
// - Include detailed monthly data for every account, fully populated.

// Output:
// - Return a fully parseable JSON object with two fields:
//   1. \`ProfitAndLossForecast\`: An object with \`Income\`, \`Cost of Goods Sold\`, and \`Expenses\`, each containing arrays of accounts with monthly numeric values.
//   2. \`Explanation\`:A detailed summary that:
// - Highlights key seasonality patterns with examples (e.g., "December sales increase by X% due to holiday promotions").
// - Describes market and industry factors influencing the forecast (e.g., "Increased material costs in Q2 expected due to supplier pricing trends").
// - Lists specific business drivers affecting forecasts (e.g., "Rent expense increases in March due to lease renewal").
// - Explains how forecast values were calculated, with numeric references to historical data and logical assumptions.


// Requirements:
// - Fully realistic, varied amounts for each month and account.
// - No placeholders or arbitrary zero values.
// - Output must be complete, valid JSON ready for direct use in the frontend.
//  `
// };

module.exports = {
  prompt: `
You are provided with historical financial data from QuickBooks in JSON format, including:
- Company Info (\`companyInfo\`)
- Chart of Accounts (\`accountListDetail\`)
- Current Profit & Loss (\`profitAndLoss\`)
- Balance Sheet (\`balanceSheet\`)

Task:
Generate a detailed, realistic Profit & Loss forecast for the next year (monthly), starting from June 2025.The generated report should strictly reflect the provided values without suggesting values outside a reasonable range. For example, salaries, rent, and expenses should stay within typical business ranges and not exceed provided amounts.

Instructions:
- Analyze historical data for seasonality (e.g., holiday peaks, summer slowdowns) and apply it to forecast income, COGS, and expenses.
- Incorporate market drivers (e.g., promotions, industry trends, material costs) and business factors (e.g., insurance renewals, maintenance spikes).
- Avoid linear trends. Use realistic, business-driven variations based on historical patterns and logical assumptions.
- All values must be numeric. No placeholders or constant values unless justified by historical data.
- Include detailed monthly data for every account, fully populated.

 **STRICT OUTPUT FORMAT**:
- Return a fully parseable JSON object with two fields:
  1. \`ProfitAndLossForecast\`:
     - An object with exactly **three categories**: \`Income\`, \`Cost of Goods Sold\`, \`Expenses\`.
     - Each category contains **accounts** as keys.
     - Each account must map to an **array of exactly 12 numeric values**, corresponding to months June 2025 to May 2026.
     -  Do not use month names or objects keyed by month.
     -  Example:
       \`\`\`json
       {
         "Income": {
           "Sales": [1000, 1100, 1200, ...],
           "Services": [800, 850, 900, ...]
         },
         "Cost of Goods Sold": {
           "COGS": [500, 550, 600, ...]
         },
         "Expenses": {
           "Rent": [200, 200, 250, ...]
         }
       }
       \`\`\`
  2. \`Explanation\`:
   - A single string (not an object) that describes:  
     - Key seasonality patterns (e.g., "December sales increase by 25% due to holiday promotions").
     - Market and industry factors (e.g., "Material costs rise 10% in Q2").
     - Business drivers (e.g., "Rent expense increases by $500 in March").
     - Calculation approach (e.g., "Sales were forecasted using historical data with X% increase for promotions").
   - Ensure 'Explanation' is fully parseable as a **single string** with complete sentences, not an object or array.


Requirements:
- All accounts must contain exactly 12 numeric values (for June 2025 to May 2026).
- Avoid mixed formats or missing months.
- Output must be fully parseable JSON, no additional text or placeholders.
- Format must strictly follow the array of values per account approach.

`
};
