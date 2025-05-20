import React from "react";
import { Box, Button, Typography } from "@mui/material";
import SmartBudgetLogo from "../assets/smartbudget.svg"; // regular SVG import

const OnboardingHeader = ({ currentStep }) => {
  const steps = ["Step 1 of 2", "Step 2 of 2"];

  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img src={SmartBudgetLogo} alt="Quota Smart Budget" width={35} />
        <Typography variant="h4" sx={{ marginLeft: 2 }}>
          {steps[currentStep - 1]}
        </Typography>
      </Box>
      <Button variant="outlined" href="https://docs.getquota.co/" target="_blank">
        Support
      </Button>
    </Box>
  );
};

export default OnboardingHeader;
