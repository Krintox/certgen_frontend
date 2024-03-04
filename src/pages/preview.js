import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PreviewPage = () => {
  const location = useLocation();
  const annotations = location.state.annotations || {};
  const resizedImage = location.state.uploadImage || {};
  const uploadedExcelFile = location.state.uploadedExcelFile || {}
  const [resultImages, setResultImages] = useState([]);
  const [resultEmails, setResultEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State for loading status

  const handleSendRequest = async () => {
    setIsLoading(true); // Set loading status to true
    if (annotations && resizedImage && uploadedExcelFile) {
      try {
        // Fetch the resizedImage as a Blob
        const response = await fetch(resizedImage);
        const blob = await response.blob();

        // Create a new File object from the Blob
        const file = new File([blob], 'image.jpg', { type: blob.type });

        const formData = new FormData();
        formData.append('coordinates', JSON.stringify(annotations));
        formData.append('image', file); // Append the converted File object
        formData.append('excel', uploadedExcelFile);

        // Send the POST request with the FormData
        const apiResponse = await axios.post('https://aliws.pythonanywhere.com/api', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Response from server:', apiResponse.data);
        const { resultImages, resultEmails } = apiResponse.data;
        setResultImages(resultImages);
        setResultEmails(resultEmails);
      } catch (error) {
        console.error('Error fetching preview:', error);
      } finally {
        setIsLoading(false); // Set loading status back to false
      }
    } else {
      console.log('Missing Values');
      setIsLoading(false); // Set loading status back to false
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl md:text-5xl font-bold text-white border-b-2 under md:pb-2">CERT GEN - Preview</h1>
      <div className="w-full max-w-2xl bg-transparent rounded-lg shadow-md mt-20">
        {isLoading ? ( // Display loading screen if isLoading is true
          <div className="flex items-center justify-center h-40">
            <span className="text-xl text-gray-600">Loading...</span>
          </div>
        ) : (
          <>
            <div className="w-full p-4">
              <h2>Result Images</h2>
              <div className="flex flex-wrap">
                {resultImages.map((url, index) => (
                  <div key={index} className="m-2">
                    <img src={url} alt={`Result Image ${index}`} />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full p-4">
              <h2>Result Emails</h2>
              <ul>
                {resultEmails.map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
            </div>
            <div className="w-full p-4">
              <button onClick={handleSendRequest} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Send Request
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewPage;
