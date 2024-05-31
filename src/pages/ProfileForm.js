// ProfileForm.jsx
import React, { useState } from 'react';

const ProfileForm = () => {
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
    background: "linear-gradient(to right, #222029, #3B4148)",
  };

  const inputStyle = {
    color: 'white',
    backgroundColor: 'transparent',
    borderBottom: '1px solid #FF6347',
    fontFamily: 'Urbanist',
    marginBottom: '1rem',
    outline: 'none',
    borderColor: '#FF6347',
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ color: 'white', fontFamily: 'Urbanist' }}>Profile</h2>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        placeholder="First Name"
        style={inputStyle}
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        placeholder="Last Name"
        style={inputStyle}
      />
      <input
        type="text"
        name="organizationName"
        value={formData.organizationName}
        onChange={handleInputChange}
        placeholder="Organization Name"
        style={inputStyle}
      />
      <input
        type="text"
        name="profession"
        value={formData.profession}
        onChange={handleInputChange}
        placeholder="Profession"
        style={inputStyle}
      />
      <input
        type="file"
        name="profileImage"
        onChange={handleFileChange}
      />
      <button type="submit" style={{ ...gradientBgLeft, fontFamily: 'Urbanist' }}>Create Profile</button>
    </form>
  );
};

export default ProfileForm;
