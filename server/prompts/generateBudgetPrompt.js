module.exports = {
  prompt: `
You are a helpful business analyst tasked with generating a detailed Profit and Loss (P&L) forecast for a business.

### Forecast period:
- From June 2025 to May 2026
- One monthly value per account, per month
- Currency: USD
- Use accrual accounting and comply with GAAP
- Forecast must reflect historical financials (companyInfo, profitAndLoss, balanceSheet)

### Structure Required:
- Group accounts under one of: "Income", "Cost of Goods Sold", "Expenses", "Other Expenses"
- Each group is a "Section"
- Each Section contains multiple "Data" rows (accounts)
- Each "Data" row must contain 13 "ColData" entries:
  - First = account name
  - Next 12 = values from June 2025 to May 2026
- Do NOT include "Total" column or summary sections
- Do NOT return nested rows within rows
- Output must be valid JSON

### Output Format:
{
  "Rows": {
    "Row": [
      {
        "Header": {
          "ColData": [{ "value": "Income" }, { "value": "" }]
        },
        "Rows": {
          "Row": [
            {
              "ColData": [
                { "id": "10", "value": "Sales" },
                { "value": "1000.00" }, { "value": "1050.00" }, { "value": "1100.00" },
                { "value": "1150.00" }, { "value": "1200.00" }, { "value": "1250.00" },
                { "value": "1300.00" }, { "value": "1350.00" }, { "value": "1400.00" },
                { "value": "1450.00" }, { "value": "1500.00" }, { "value": "1550.00" }
              ],
              "type": "Data"
            },
            {
              "ColData": [
                { "id": "11", "value": "Sales of Product Income" },
                { "value": "2000.00" }, { "value": "2100.00" }, { "value": "2200.00" },
                { "value": "2300.00" }, { "value": "2400.00" }, { "value": "2500.00" },
                { "value": "2600.00" }, { "value": "2700.00" }, { "value": "2800.00" },
                { "value": "2900.00" }, { "value": "3000.00" }, { "value": "3100.00" }
              ],
              "type": "Data"
            }
          ]
        },
        "type": "Section",
        "group": "Income"
      },
      {
        "Header": {
          "ColData": [{ "value": "Expenses" }, { "value": "" }]
        },
        "Rows": {
          "Row": [
            {
              "ColData": [
                { "id": "20", "value": "Rent Expense" },
                { "value": "800.00" }, { "value": "800.00" }, { "value": "800.00" },
                { "value": "800.00" }, { "value": "800.00" }, { "value": "800.00" },
                { "value": "800.00" }, { "value": "800.00" }, { "value": "800.00" },
                { "value": "800.00" }, { "value": "800.00" }, { "value": "800.00" }
              ],
              "type": "Data"
            },
            {
              "ColData": [
                { "id": "21", "value": "Interest Expense" },
                { "value": "300.00" }, { "value": "300.00" }, { "value": "310.00" },
                { "value": "310.00" }, { "value": "320.00" }, { "value": "320.00" },
                { "value": "330.00" }, { "value": "330.00" }, { "value": "340.00" },
                { "value": "340.00" }, { "value": "350.00" }, { "value": "350.00" }
              ],
              "type": "Data"
            }
          ]
        },
        "type": "Section",
        "group": "Expenses"
      }
    ]
  },
  "Columns": {
    "Column": [
      { "ColType": "Account", "ColTitle": "", "MetaData": [{ "Name": "ColKey", "Value": "account" }] },
      { "ColType": "Money", "ColTitle": "June 2025" },
      { "ColType": "Money", "ColTitle": "July 2025" },
      { "ColType": "Money", "ColTitle": "August 2025" },
      { "ColType": "Money", "ColTitle": "September 2025" },
      { "ColType": "Money", "ColTitle": "October 2025" },
      { "ColType": "Money", "ColTitle": "November 2025" },
      { "ColType": "Money", "ColTitle": "December 2025" },
      { "ColType": "Money", "ColTitle": "January 2026" },
      { "ColType": "Money", "ColTitle": "February 2026" },
      { "ColType": "Money", "ColTitle": "March 2026" },
      { "ColType": "Money", "ColTitle": "April 2026" },
      { "ColType": "Money", "ColTitle": "May 2026" }
    ]
  }
}

IMPORTANT:
- Return only valid JSON — no markdown, no explanations, no "generatedBudget"
- Ensure all commas are correctly placed (no trailing commas)
- Each account line must have exactly 13 values (1 name + 12 months)
- Do not include totals or summaries
`
};
