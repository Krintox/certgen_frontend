import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projectDetails, setProjectDetails] = useState(null);
  const { state } = location;
  const projectId = state && state.projectId;

  // Function to fetch project details
  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`https://certgen-backend.vercel.app/project/${projectId}`, {
        method: 'GET',
        credentials: 'include' // Include credentials for cookie authentication
      });

      if (response.ok) {
        const project = await response.json();
        setProjectDetails(project);
      } else {
        console.error('Failed to fetch project details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  // Fetch project details when component mounts
  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  return (
    <div className="flex flex-col items-center justify-center w-full mt-10 min-h-screen">
      <h3 className="text-7xl md:text-8xl font-semibold text-white border-b-2 under md:pb-2">Project Details</h3>
      {projectDetails ? (
        <div className="max-w-md bg-transparent rounded-lg shadow-md mt-8 p-8">
          <h2 className="text-xl font-semibold text-gray-800">{projectDetails.title}</h2>
          <p className="text-sm text-gray-600 mt-2">{projectDetails.description}</p>
          <img src={`https://certgen-backend.vercel.app/uploads/images/${projectDetails.imageFile}`} alt="Project Image" className="w-full mt-4" />
          <p className="text-sm text-gray-600 mt-2">Excel File: {projectDetails.excelFile}</p>
          <div className="flex flex-wrap mt-4">
            {projectDetails.arrayOfImages.map((image, index) => (
              <img key={index} src={`https://certgen-backend.vercel.app/uploads/arrayImages/${image}`} alt={`Image ${index + 1}`} className="w-32 h-32 object-cover mr-2 mb-2" />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-white mt-8">Loading project details...</p>
      )}
    </div>
  );
};

export default ProjectDetails;
