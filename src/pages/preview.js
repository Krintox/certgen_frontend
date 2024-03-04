import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import JSZip from 'jszip';

const PreviewPage = () => {
  const location = useLocation();
  const annotations = location.state.annotations || {};
  const resizedImage = location.state.uploadImage || {};
  const uploadedExcelFile = location.state.uploadedExcelFile || {};
  const [resultImages, setResultImages] = useState([]);
  const [resultEmails, setResultEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);

  useEffect(() => {
    if (!isLoading && resultImages.length > 0 && resultEmails.length > 0) {
      setShowProceedButton(true);
    }
  }, [isLoading, resultImages, resultEmails]);

  const handleSendRequest = async () => {
    setIsLoading(true);
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
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Response from server:', apiResponse.data);
        const { result_images, result_emails } = apiResponse.data;
        setResultImages(result_images);
        setResultEmails(result_emails);
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
  
    resultImages.slice(0, 5).forEach((base64String, index) => {
      const fileName = `image_${index + 1}.png`;
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
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `images_${new Date().toISOString()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };
  
    const handleProceed = async () => {
      try {
        const attachments = [];
    
        resultImages.forEach((base64String, index) => {
          const fileName = `image_${index + 1}.png`; // Fix: Use backticks for string interpolation
          const byteCharacters = atob(base64String);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/png' });
    
          const file = new File([blob], fileName, { type: 'image/png' });
    
          attachments.push({
            filename: fileName,
            data: file,
          });
        });
    
        const emailData = {
          subject: "Test Email Subject",
          content: "This is a test email content.",
          recipients: resultEmails,
          attachments: attachments,
        };
    
        const response = await axios.post('http://localhost:4000/sendEmails', emailData);
    
        if (response.status === 200) {
          alert('Emails sent successfully');
          console.log('Emails sent successfully');
        } else {
          console.error('Failed to send emails');
        }
      } catch (error) {
        console.error('Error sending emails:', error);
      }
    };
  
  

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl md:text-5xl font-bold text-white border-b-2 under md:pb-2">CERT GEN - Preview</h1>
      <div className="w-full max-w-2xl bg-transparent rounded-lg shadow-md mt-20 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <span className="text-xl text-gray-600">Loading...</span>
          </div>
        ) : (
          <>
            <div className="flex justify-between">
              <div className="w-full p-4">
                <h2>Result Images</h2>
                <div className="flex flex-wrap justify-center">
                  {resultImages.slice(0, 5).map((base64String, index) => (
                    <div key={index} className="m-2">
                      <img
                        src={`data:image/jpeg;base64,${base64String}`}
                        alt={`Result Image ${index}`}
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-1/2 p-4">
                <h2>Result Emails</h2>
                <ul>
                  {resultEmails.slice(0, 5).map((email, index) => (
                    <li key={index}>{email}</li>
                  ))}
                </ul>
              </div>
            </div>
            {showProceedButton ? (
              <div className="w-full p-4 flex justify-center">
                <button
                  onClick={handleProceed}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Send Emails
                </button>
              </div>
            ) : (
              <div className="w-full p-4 flex justify-center">
                <button
                  onClick={handleSendRequest}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Generate Certificate
                </button>
              </div>
            )}
            {resultImages.length > 0 && (
              <div className="w-full p-4 flex justify-center">
                <button
                  onClick={handleBulkDownload}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download Images
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

