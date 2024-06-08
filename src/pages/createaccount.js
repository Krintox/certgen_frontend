import React, { useState } from "react";
import circleImage from "../images/circle.png";

function CreateAccount() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    organizationName: '',
    profession: '',
    profileImage: null
  });

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleFileChange = (event) => {
    setFormData({
      ...formData,
      profileImage: event.target.files[0]
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataWithImage = new FormData();
    formDataWithImage.append('firstName', formData.firstName);
    formDataWithImage.append('lastName', formData.lastName);
    formDataWithImage.append('organizationName', formData.organizationName);
    formDataWithImage.append('profession', formData.profession);
    formDataWithImage.append('profileImage', formData.profileImage);

    try {
      const response = await fetch('https://certgen-backend.vercel.app/profile/create', {
        method: 'POST',
        body: formDataWithImage,
        credentials: 'include'
      });

      if (response.ok) {
        console.log('Profile created successfully');
      } else {
        console.error('Failed to create profile');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const gradientBgLeft = {
    background: "linear-gradient(to bottom right, #FB360F, #F28A18)",
  };

  const gradientBgRight = {
    background: "linear-gradient(to right, #222029, #3B4148)",
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center text-black">
        <div className="flex bg-opacity-10 p-8 rounded-lg shadow-xl glassmorphism">
          <div className="mr-16 flex items-center md:flex flex-col justify-center">
            <img src={circleImage} alt="Circle" className="w-72 h-72" style={{margin: "auto"}} />
          </div>
          <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col mb-2 items-center">
              <h3 className="text-6xl mb-10 text-center text-orange-500">PROFILE</h3>
            </div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name"
              className="text-black bg-transparent login-input focus:border-orange-400 font-urbanist"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="text-black bg-transparent login-input focus:border-orange-400 font-urbanist"
            />
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleInputChange}
              placeholder="Organization Name"
              className="text-black bg-transparent login-input focus:border-orange-400 font-urbanist"
            />
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              placeholder="Profession"
              className="text-black bg-transparent login-input focus:border-orange-400 font-urbanist"
            />
            {/*<input
              type="file"
              name="profileImage"
              onChange={handleFileChange}
              className="text-black bg-transparent login-input focus:border-orange-400 font-urbanist"
  />*/}
            <button type="submit" className='w-full max-w-xs text-black my-2 rounded-md p-4 text-center flex items-center justify-center cursor-pointer'
                      style={gradientBgLeft}>Create Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
