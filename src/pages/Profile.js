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
      const response = await fetch('http://localhost:4000/profile123', {
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

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleInputChange}
        placeholder="First Name"
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleInputChange}
        placeholder="Last Name"
      />
      <input
        type="text"
        name="organizationName"
        value={formData.organizationName}
        onChange={handleInputChange}
        placeholder="Organization Name"
      />
      <input
        type="text"
        name="profession"
        value={formData.profession}
        onChange={handleInputChange}
        placeholder="Profession"
      />
      <input
        type="file"
        name="profileImage"
        onChange={handleFileChange}
      />
      <button type="submit">Create Profile</button>
    </form>
  );
};

export default ProfileForm;
