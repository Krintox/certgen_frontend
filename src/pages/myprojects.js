import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:4000/projects', {
          withCredentials: true // Send cookies along with the request
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error.response.data);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h2>My Projects</h2>
      <ul>
        {projects.map(project => (
          <li key={project._id}>
            <Link to={`/myproject/${project._id}`}>{project.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProjects;
