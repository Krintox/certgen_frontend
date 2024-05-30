import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/projectList.css';


const ProjectList = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('https://certgen-backend.vercel.app/profile/getAll', {
        withCredentials: true
      });

      if (response.status === 200) {
        setProfile(response.data);
      } else {
        console.error('Failed to fetch profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Project List</h1>
      <div className="profile-info row">
        {profile.profileImage && 
          <div className="col-md-4">
            <img src={profile.profileImage} alt="Profile" className="img-fluid rounded-circle" />
          </div>
        }
        <div className="profile-details col-md-8">
          <p><strong>First Name:</strong> {profile.firstName}</p>
          <p><strong>Last Name:</strong> {profile.lastName}</p>
          <p><strong>Organization Name:</strong> {profile.organizationName}</p>
          <p><strong>Profession:</strong> {profile.profession}</p>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Total Files Uploaded:</strong> {profile.totalFiles}</p>
          <p><strong>Total Projects:</strong> {profile.totalProjects}</p>
        </div>
      </div>
      <div className="projects">
        <h2>Projects</h2>
        <ul className="project-list list-unstyled">
          {profile.projectNames && profile.projectNames.map((projectName, index) => (
            <li key={index} className="project-item">
              <Link to={`/projectdet/${index}`} state={{ projectId: projectName }}>{projectName}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectList;
