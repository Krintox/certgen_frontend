import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProjectDetails = () => {
  const { id } = useParams(); // Get the project ID from the URL params
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/projects/${id}`, {
          withCredentials: true // Send cookies along with the request
        });
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project details:', error.response.data);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleDownloadExcel = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/uploads/excel/${project.excelFile}`, {
        responseType: 'blob', // Set the response type to blob
        withCredentials: true // Send cookies along with the request
      });

      // Create a blob URL from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      const excelReal = `${project.excelFile}.xlsx`
      link.setAttribute('download', excelReal);
      
      // Simulate a click on the link to trigger the download
      document.body.appendChild(link);
      link.click();

      // Cleanup: remove the temporary link
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading Excel file:', error.response.data);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{project.title}</h2>
      <p className="mb-4">Excel File: <button onClick={handleDownloadExcel} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Download</button></p>
      <div className="mb-4">
        <h1 className="text-lg font-bold">Image File:</h1>
        <img src={`http://localhost:4000/uploads/images/${project.imageFile}`} alt="Image" className="mt-2 w-1/5 p-2" />
      </div>
      <div className="mb-4">
        <h1 className="text-lg font-bold">Array of Images:</h1>
        <div className="flex flex-wrap">
          {project.arrayOfImages.map((image, index) => (
            <img key={index} src={`http://localhost:4000/uploads/arrayImages/${image}`} alt={`Image ${index}`} className="w-1/5 p-2" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
