import React, { useState } from "react";
import CompanyProfile from "../components/onBoarding/companyProfile";  // Import CompanyProfile component
import IndustryDetails from "../components/onBoarding/industryDetails"; // Import IndustryDetails component

const StepTwo = ({ onNext }) => {
  const [subStep, setSubStep] = useState(0);

  // Handle moving to the next substep or completing the step
  const handleNext = () => {
    if (subStep === 0) {
      setSubStep(1); // Move to the next substep (from company profile to industry details)
    } else {
      onNext(); // Complete the onboarding if it's the last substep
    }
  };

  return (
    <div>
      <h2>Step Two</h2>
      {subStep === 0 ? (
        <CompanyProfile
          onNext={handleNext}
          setSubStep={setSubStep}
          businessId="demo-id"  // Stub businessId for now
          subStep={subStep}
        />
      ) : (
        <IndustryDetails
          onComplete={(industryData) => {
            console.log("Selected Industry:", industryData);
            handleNext();  // Proceed once industry details are completed
          }}
        />
      )}
    </div>
  );
};

export default StepTwo;
