import React from "react";
import circleImage from "../images/circle.png"; // Replace with the actual path
import "./createAccount.css";
function CreateAccount() {
  return (
    <div className="create-account-container">
      <div className="create-account-head">
        <div className="left-column">
          <img src={circleImage} alt="Circle" className="circle-image" />
        </div>
        <div className="right-column">
          <form className="account-form">
            <h2>EDIT</h2>
            <input type="text" id="name" name="name" placeholder="Name"/>

            <input type="email" id="email" name="email" placeholder="Email" />

            <input type="text" id="profession" name="profession" placeholder="Proffesion" />

            <button type="submit">Apply</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
