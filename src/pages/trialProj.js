import React, { useState, useEffect, useContext } from 'react';
import AWS from 'aws-sdk';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { UserContext } from '../UserContext';
import LoadingComponent from './LoadingPage';
import './styles/modal.css';
import '../App.css'

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
    <div className="flex flex-col items-center justify-center w-12/12">
      <div className="w-11/12 rounded-lg mt-20 overflow-hidden p-4 mb-20 flex flex-col items-center">
        <h2 className="font-bold text-white border-b-2 pb-2">
          My <span>Projects</span>
        </h2>
        {isLoading ? (
          <LoadingComponent />
        ) : selectedProject ? (
          <div>
            <button onClick={() => setSelectedProject(null)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-10">
              Back to Projects
            </button>
            {/* <button onClick={downloadZip} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 mt-10">
              Download Zip
            </button> */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              {imageUrls.map((url, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img src={url} alt={`Project Image ${index + 1}`} className="w-full h-auto" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 w-12/12" style={{width: '100%'}}>
            {projects.map((project, index) => (
              <div
                key={index}
                onClick={() => fetchImages(project.folder)}
                className="cursor-pointer rounded-lg overflow-hidden text-white text-center py-2 px-7 projectNamediv mb-6"
              >
                <h4 className="font-bold text-left p-4 pt-2 pb-2">Name <span className="standardrgbcolor">: </span> {project.title}</h4>
                <p className='text-left px-4'>Description : {project.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrialProj;
