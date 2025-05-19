
// export default SignInPage;
import React from "react";
import { SignIn } from "@clerk/clerk-react";
import "./signIn.css";

const SignInPage = () => {
  return (
    <div className="signin-layout">
      {/* LEFT PANEL with Clerk SignIn */}
      <div className="left-panel">
        <div className="signin-form-wrapper">
          <SignIn path="/signIn" routing="path" />
        </div>
      </div>

      {/* RIGHT PANEL with background image */}
      <div className="right-panel">
        <div className="halo-container">
          <div className="halo large-halo" />
          <div className="halo small-halo" />
        </div>
        <img
          src="/auth-bg.png"
          alt="Login visual"
          className="background-image"
        />
      </div>
    </div>
  );
};

export default SignInPage;
