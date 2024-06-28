import React, { useState, useEffect, useContext } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { UserContext } from '../UserContext';
import LoadingComponent from './LoadingPage';
import './styles/modal.css';
import '../App.css';
import icon1 from '../images/history_icon_1.png';
import { useProject } from '../ProjectContext';

const gradientText = {
  backgroundImage: "linear-gradient(to right, #FFA500, #FF6347)",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

const TrialProj = () => {
  const { userInfo } = useContext(UserContext);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userId = userInfo?.id; // Assuming userInfo has an `id` field
  console.log(userId);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://certgen-backend.vercel.app/projects/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Include credentials
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const projectsData = await response.json();
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        console.log(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]); // Ensure projects is an array in case of error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const fetchImages = async (projectId) => {
    setIsLoading(true);
    setSelectedProject(projectId);
    console.log(projectId);

    try {
      const response = await fetch(`https://certgen-backend.vercel.app/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include credentials
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project images');
      }

      const projectData = await response.json();
      const urls = projectData.photos.map(photo => photo.imageUrl);
      setImageUrls(urls);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadZip = async () => {
    const zip = new JSZip();

    try {
      const fetchImageBlob = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return blob;
      };

      const imageBlobs = await Promise.all(imageUrls.map(url => fetchImageBlob(url)));

      imageBlobs.forEach((blob, index) => {
        zip.file(`image${index + 1}.jpg`, blob);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'project-images.zip');
    } catch (error) {
      console.error('Error downloading zip:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {isLoading && (
        <div className="loading-popup">
          <LoadingComponent />
        </div>
      )}
      <div className="w-11/12 rounded-lg mt-20 overflow-hidden p-4 mb-20 flex flex-col items-start">
        <h2 className="font-bold text-black border-b-2 pb-2 text-4xl md:text-6xl mb-4 bebas-neue-regular">
          My Projects
        </h2>
        {selectedProject ? (
          <div className="w-full">
            <button onClick={() => setSelectedProject(null)} className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded mb-4 mt-10">
              Back to Projects
            </button>
            <div className="flex justify-between items-center mb-4">
              <button onClick={downloadZip} className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded">
                Download as Zip
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
              {imageUrls.map((url, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img src={url} alt={`Project Image ${index + 1}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <div
                    key={index}
                    onClick={() => fetchImages(project._id)}
                    className="relative bg-white bg-opacity-10 p-4 w-full h-40 mx-auto my-4 rounded-lg text-black shadow-md glassmorphism font-urbanist md:w-72 cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-xl"
                  >
                    <p className="absolute top-3 left-3 text-xl font-urbanist font-semibold">{project.title}</p>
                    <img src={icon1} alt="Project Icon" className="absolute top-3 right-3" style={{ width: '24px', height: '24px' }} />
                    <p className="absolute bottom-0 left-3 text-sm font-urbanist" style={{ maxWidth: 'calc(100% - 3rem)' }}>
                      {project.description}
                    </p>
                    <div className="absolute bottom-4 right-3 flex items-center">
                      <span className="text-sm mr-2 bottom-0">Certificates generated</span>
                      <span className="text-2xl font-semibold" style={gradientText}>{project.certificatesGenerated}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-xl">No projects found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialProj;
