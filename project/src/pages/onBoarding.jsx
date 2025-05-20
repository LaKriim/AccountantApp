import React, { useState } from "react";
import OnboardingHeader from "./onboardingHeader";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      alert("Onboarding complete!"); // Simulate navigation
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const stepFromUrl = parseInt(query.get("step"));
    if (stepFromUrl === 2) {
      setCurrentStep(2);
    }
  }, [location.search]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepOne onNext={handleNext} />;
      case 2:
        return (
          <StepTwo onNext={handleNext} business={{}} businessId="demo-id" />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <OnboardingHeader currentStep={currentStep} />
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {renderStepContent()}
      </div>
    </div>
  );
};

export default Onboarding;
