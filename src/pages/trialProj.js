import React, { useState, useEffect, useContext } from 'react';
import AWS from 'aws-sdk';
import { UserContext } from '../UserContext';
import LoadingComponent from './LoadingPage';
import './styles/modal.css';

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

          // Fetch the number of images in each project
          const imageParams = {
            Bucket: 'certgenml',
            Prefix: folder,
          };

          const imageData = await s3.listObjectsV2(imageParams).promise();
          const imageCount = imageData.Contents.filter(item => !item.Key.endsWith('/')).length;

          return { folder, ...projectDetails, imageCount };
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

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl rounded-lg mt-20 overflow-hidden p-4 mb-20 bg-white shadow-lg">
        <h2 className="font-bold text-black border-b-2 pb-2 text-center">
          Projects
        </h2>
        {isLoading ? (
          <LoadingComponent />
        ) : selectedProject ? (
          <div>
            <button 
              onClick={() => setSelectedProject(null)} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-10"
            >
              Back to Projects
            </button>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              {imageUrls.map((url, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img src={url} alt={`Project Image ${index + 1}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {projects.map((project, index) => (
              <div
                key={index}
                onClick={() => fetchImages(project.folder)}
                className="cursor-pointer rounded-lg overflow-hidden bg-gray-800 text-white text-center p-4 transform transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <h4 className="font-semibold">{project.title}</h4>
                <p>{project.description}</p>
                <p>{project.imageCount} {project.imageCount === 1 ? 'Image' : 'Images'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-2 px-4 rounded mt-4">
        New Project
      </button>
    </div>
  );
};

export default TrialProj;
