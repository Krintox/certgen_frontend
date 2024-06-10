import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JSZip from 'jszip';
import Modal from 'react-modal';
import LoadingComponent from './LoadingPage';
import './styles/modal.css';
import { IoMdClose } from "react-icons/io";
import * as XLSX from 'xlsx';
import AWS from 'aws-sdk';
import { useProject } from '../ProjectContext';

Modal.setAppElement('#root');

const PreviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const annotations = location.state.annotations || {};
  const resizedImage = location.state.uploadImage || {};
  const uploadedExcelFile = location.state.uploadedExcelFile || {};
  const [resultImages, setResultImages] = useState([]);
  const [resultEmails, setResultEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const [showMins, setShowMins] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [subLoad, setSubLoad] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { projectId, userId } = useProject();

  // AWS S3 Configuration
  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  useEffect(() => {
    if (!isLoading && resultImages.length > 0 && resultEmails.length > 0) {
      setShowProceedButton(true);
    }
  }, [isLoading, resultImages, resultEmails]);

  const uploadToS3 = async (file, fileName) => {
    const params = {
      Bucket: 'certgenml',
      Key: `${userId}/${projectId}/${fileName}`,
      Body: file,
      ContentType: file.type,
    };
    console.log(userId);

    return s3.upload(params).promise();
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setShowMins(true);
    if (annotations && resizedImage && uploadedExcelFile) {
      try {
        const response = await fetch(resizedImage);
        const blob = await response.blob();
  
        const file = new File([blob], 'image.jpg', { type: blob.type });
  
        const formData = new FormData();
        formData.append('coordinates', JSON.stringify(annotations));
        formData.append('image', file);
        formData.append('excel', uploadedExcelFile);
  
        const apiResponse = await axios.post('https://aliws.pythonanywhere.com/api', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        console.log('Response from server:', apiResponse.data);
        const { result_images, result_emails } = apiResponse.data;
        setResultImages(result_images);
        setResultEmails(result_emails);
        setShowMins(false);
  
        // Upload images to S3 and get URLs
        const s3ImageUrls = await Promise.all(result_images.map(async (base64String, index) => {
          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/png' });
          const file = new File([blob], `image_${index + 1}.png`, { type: 'image/png' });

          const s3Response = await uploadToS3(file, `image_${index + 1}.png`);
          return s3Response.Location;
        }));

        // Send S3 image URLs to the endpoint
        const s3ImageResponse = await axios.post('https://aliws.pythonanywhere.com/post-data', {
          s3ImageUrls: s3ImageUrls,
          images: result_images,
          coordinates: annotations,
          emails: result_emails,
        });

        const { qr_images, final_emails } = s3ImageResponse.data;
        setResultImages(qr_images);
        setResultEmails(final_emails);

        console.log('S3 image URLs sent:', s3ImageResponse.data);

      } catch (error) {
        console.error('Error fetching preview:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('Missing Values');
      setIsLoading(false);
    }
  };

  const handleBulkDownload = () => {
    const zip = new JSZip();
    const imagesFolder = zip.folder('images');

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const firstColumnValues = [];

      XLSX.utils.sheet_to_json(sheet, { header: 1 }).forEach((row) => {
        firstColumnValues.push(row[0]);
      });

      resultImages.forEach((base64String, index) => {
        const name = firstColumnValues[index + 1] || `name`;
        const fileName = `${name}_${index + 1}.png`;
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        imagesFolder.file(fileName, blob);
      });

      zip.generateAsync({ type: 'blob' }).then((content) => {
        const blobUrl = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `images_${new Date().toISOString()}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      });
    };
    reader.readAsArrayBuffer(uploadedExcelFile);
  };

  const handleProceed = async () => {
    try {
      navigate('/email', {
        state: {
          uploadedExcelFile,
          annotations,
          resultImages,
          resultEmails,
        },
      });
    } catch (error) {
      console.error('Error navigating to email page:', error);
    }
  };

  const handleImageClick = (base64String) => {
    setSelectedImage(base64String);
  };

  const handleClosePopup = () => {
    setSelectedImage(null);
  };

  const gradientBtn = {
    background: 'linear-gradient(to bottom right, #FB360F, #F28A18)',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-transparent rounded-lg shadow-md mt-20 overflow-hidden p-4 mb-20 flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-bold text-black border-b-2 pb-2 text-center border-orange-500 bebas">
          CERTTO
        </h1>
        {showMins 
        ?
        (
          <p className="text-black mt-8 mb-6 text-center urbanist">
            Please wait... This may take 5-6 mins
          </p>
        )
        :
        <p></p>
        }
        {isLoading ? (
          <LoadingComponent /> // Display the loading component here
        ) : (
          <>
            {selectedImage && (
              <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                <div className="relative bg-black rounded-lg shadow-lg w-800px h-600px">
                  <button
                    className="absolute top-0 right-0 m-2 text-gray-600 hover:text-gray-800"
                    onClick={handleClosePopup}
                  >
                    <IoMdClose size={24} />
                  </button>
                  <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Selected Image" className="w-full h-full" /> {/* Adjust width and height here */}
                </div>
              </div>
            )}
            {showProceedButton ? (
              <>
                <div className="py-10 flex"> {/* Add padding top here */}
                  <div className="table-container max-h-96 overflow-y-auto ">
                    <table className="w-full mt-14 mb-10">
                      <thead>
                        <tr>
                          <th className="border-b-2 border-orange-500 px-4 text-black font-urbanist py-2">Email</th>
                          <th className="border-b-2 px-4 border-orange-500 text-black font-urbanist py-2">Click to preview</th>
                        </tr>
                      </thead>
                      <tbody>
                          <tr>
                            <td className="px-4 text-center text-black font-urbanist py-2">{resultEmails[0]}</td>
                            <td className="px-4 text-center text-black font-urbanist py-2"> 
                                <button
                                  onClick={() => handleImageClick(resultImages[0])}
                                  className="bg-green-500 hover:bg-green-700 text-black font-bold py-1 px-2 rounded">
                                  View
                                </button>
                            </td>
                          </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
  
                <div className="w-full p-4 flex justify-center">
                  <button
                    onClick={handleProceed}
                    className="text-black font-bold py-2 px-4 rounded"
                    style={gradientBtn}
                  >
                    Start Mailing
                  </button>
                  <button
                    onClick={handleBulkDownload}
                    className="ml-4 text-black font-bold py-2 px-4 rounded"
                    style={gradientBtn}
                  >
                    Download as ZIP format
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full p-4 flex justify-center">
                <button onClick={handleSendRequest} className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded">
                  Generate
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
