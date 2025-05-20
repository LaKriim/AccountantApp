import React from "react";

const StepTwo = ({ onNext }) => {
  return (
    <div>
      <h2>Step Two</h2>
      <button onClick={onNext}>Finish</button>
    </div>
  );
};

export default StepTwo;
