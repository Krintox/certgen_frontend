import React, { useState, useEffect, useContext } from 'react';
import AWS from 'aws-sdk';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { UserContext } from '../UserContext';
import LoadingComponent from './LoadingPage';
import './styles/modal.css';
import '../App.css';
import icon1 from '../images/history_icon_1.png';

const gradientText = {
  backgroundImage: "linear-gradient(to right, #FFA500, #FF6347)",
  WebkitBackgroundClip: "text",
  color: "transparent",
};

const TrialProj = () => {
  const { userInfo } = useContext(UserContext);
  const userId = userInfo?.id; // Assuming userInfo has an `id` field
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.log('User ID is not available yet.');
      return;
    }

    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_REGION,
    });

    const fetchFolders = async () => {
      try {
        const params = {
          Bucket: 'certgenml',
          Prefix: `${userId}/`,
          Delimiter: '/',
        };

        const data = await s3.listObjectsV2(params).promise();
        const folderPrefixes = data.CommonPrefixes.map(prefix => prefix.Prefix);

        const fetchProjectDetails = async (folder) => {
          const projectId = folder.split('/')[1];
          const response = await fetch(`https://certgen-backend.vercel.app/projects/${projectId}`);
          const projectDetails = await response.json();
          return { folder, ...projectDetails };
        };

        const projectDetailsPromises = folderPrefixes.map(fetchProjectDetails);
        const projectsData = await Promise.all(projectDetailsPromises);

        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching folders from S3:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolders();
  }, [userId]);

  const fetchImages = async (folder) => {
    setIsLoading(true);
    setSelectedProject(folder);
    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_REGION,
    });

    try {
      const params = {
        Bucket: 'certgenml',
        Prefix: folder,
      };

      const data = await s3.listObjectsV2(params).promise();
      const imageKeys = data.Contents.filter(item => !item.Key.endsWith('/')).map(item => item.Key);
      const urls = imageKeys.map(key =>
        s3.getSignedUrl('getObject', {
          Bucket: 'certgenml',
          Key: key,
          Expires: 3600, // URL expiration time in seconds
        })
      );

      setImageUrls(urls);
    } catch (error) {
      console.error('Error fetching images from S3:', error);
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
              {projects.map((project, index) => (
                <div
                  key={index}
                  onClick={() => fetchImages(project.folder)}
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialProj;
