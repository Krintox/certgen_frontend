// CreateAccount.jsx
import React from "react";
import circleImage from "../images/circle.png";
import ProfileForm from "./ProfileForm"; // Import the ProfileForm component
import "./createAccount.css";

function CreateAccount() {
  return (
    <div className="create-account-container">
      <div className="create-account-head">
        <div className="left-column">
          <img src={circleImage} alt="Circle" className="circle-image mt-24" />
        </div>
        <div className="right-column">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
