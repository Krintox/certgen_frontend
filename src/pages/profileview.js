import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfileView() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch profile details
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/profile123', { withCredentials: true });
        setProfile(response.data);
      } catch (error) {
        setError(error.response.data.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      {error ? (
        <p>Error: {error}</p>
      ) : profile ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile Details</h2>
          <div className="">
            <img src={`http://localhost:4000/${profile.profileImage}`} alt="Profile" className="rounded-full h-20 w-20 object-cover shadow-md" />
          </div>
          <p className="text-lg">First Name: {profile.firstName}</p>
          <p className="text-lg">Last Name: {profile.lastName}</p>
          <p className="text-lg">Organization: {profile.organizationName}</p>
          <p className="text-lg">Profession: {profile.profession}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ProfileView;
