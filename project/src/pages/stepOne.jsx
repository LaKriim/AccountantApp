import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Link } from "@mui/material";
import QuickBooksIcon from "../assets/qbo-logo.svg";
import { startQboAuthFlow } from "../utils/qboConnector";

// TEMP: replace with your actual OnboardingCard later
const OnboardingCard = ({ Icon, title, buttonText, onClick, disabled }) => {
  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: 2,
        width: "100%",
        textAlign: "center",
        backgroundColor: disabled ? "#eee" : "#fff",
      }}
    >
      <img src={Icon} alt={title} width={80} style={{ marginBottom: "1rem" }} />
      <Typography variant="h6">{title}</Typography>
      <Button
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        sx={{ marginTop: 2 }}
      >
        {buttonText}
      </Button>
    </Box>
  );
};

const StepOne = ({ onNext }) => {
  const [isQBOConnected, setIsQBOConnected] = useState(false);
  const [qboButtonText, setQBOButtonText] = useState("Connect");

  // Dummy behavior just to test buttons + flow
  const simulateConnect = (setConnected, setText) => {
    const animation = [
      "Connecting",
      "Connecting.",
      "Connecting..",
      "Connecting...",
    ];
    let index = 0;
    const interval = setInterval(() => {
      setText(animation[index]);
      index++;
      if (index === animation.length) {
        clearInterval(interval);
        setText("Connected");
        setTimeout(() => {
          setConnected(true);
          onNext(); // move to StepTwo
        }, 1000);
      }
    }, 400);
  };

  const handleQBO = () => {
    simulateConnect(setIsQBOConnected, setQBOButtonText);
    startQboAuthFlow();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Connect your online account
      </Typography>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ width: "100%" }}
      >
        <Grid item xs={12} md={6} display="flex" justifyContent="center">
          <OnboardingCard
            Icon={QuickBooksIcon}
            title="Connect to your Quickbooks Online account"
            buttonText={qboButtonText}
            onClick={handleQBO}
            disabled={isQBOConnected}
          />
        </Grid>
      </Grid>
      <Typography
        variant="body2"
        sx={{ mt: 4, textAlign: "center", maxWidth: "80%" }}
      >
        You’ll need to be the account administrator or have been given
        permission by the account administrator to be able to connect an
        account.
      </Typography>
      <Typography
        variant="body2"
        sx={{ mt: 2, textAlign: "center", color: "grey" }}
      >
        Worried about data privacy?
        <Link
          href="https://www.getquota.co/privacy"
          sx={{ color: "grey", ml: 1 }}
        >
          Read our policy
        </Link>
      </Typography>
    </Box>
  );
};

export default StepOne;
