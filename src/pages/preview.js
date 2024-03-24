import React, { useState, useEffect } from 'react';
<<<<<<< Updated upstream
import { useLocation } from 'react-router-dom';
=======
import { useLocation, useNavigate } from 'react-router-dom';
>>>>>>> Stashed changes
import axios from 'axios';
import JSZip from 'jszip';
import Modal from 'react-modal';
import LoadingComponent from './LoadingPage';
import './styles/modal.css';
import { IoMdClose } from "react-icons/io";

Modal.setAppElement('#root');

const PreviewPage = () => {
  const location = useLocation();
  const annotations = location.state.annotations || {};
  const resizedImage = location.state.uploadImage || {};
  const uploadedExcelFile = location.state.uploadedExcelFile || {};
  const [resultImages, setResultImages] = useState([]);
  const [resultEmails, setResultEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [subLoad, setSubLoad] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!isLoading && resultImages.length > 0 && resultEmails.length > 0) {
      setShowProceedButton(true);
    }
  }, [isLoading, resultImages, resultEmails]);

<<<<<<< Updated upstream
  const openEmailModal = () => {
    setIsEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
  };


=======
>>>>>>> Stashed changes
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
    resultImages.forEach((base64String, index) => {
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
      setSubLoad(true);
  
      resultImages.forEach((base64String, index) => {
        attachments.push({
          filename: `image_${index + 1}.png`,
          content: base64String,
        });
      });
  
      const emailData = {
        subject: emailSubject,
        content: emailContent,
        recipients: resultEmails,
        attachments: attachments,
      };
  
      console.log('Email data:', emailData); // Log email data before sending request
  
      const response = await axios.post('https://certgen-backend.vercel.app/sendEmails', emailData);
  
      if (response.status === 200) {
        setSubLoad(false);
        alert('Emails sent successfully');
        console.log('Emails sent successfully');
      } else {
        console.error('Failed to send emails');
      }
    } catch (error) {
      console.error('Error sending emails:', error);
    }
  };

  const handleImageClick = (base64String) => {
    setSelectedImage(base64String);
  };

  const handleClosePopup = () => {
    setSelectedImage(null);
  };

  const gradientBtn = {
    background: "linear-gradient(to bottom right, #FB360F, #F28A18)",
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-transparent rounded-lg shadow-md mt-20 overflow-hidden p-4">
        <div className="flex justify-between">
          <div className="w-1/2 pr-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white border-b-2 md:pb-2">CERT GEN</h1>
          </div>
          <div className="w-1/2">
          <p className="text-white font-urbanist">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
        {isLoading ? (
          <LoadingComponent /> // Display the loading component here
          ) : (
            <>
              {selectedImage && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="relative bg-white rounded-lg shadow-lg w-800px h-600px">
                    <button
                      className="absolute top-0 right-0 m-2 text-gray-600 hover:text-gray-800"
                      onClick={handleClosePopup}
                    >
                      <IoMdClose size={24} />
                    </button>
                    <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Selected Image" className="w-full h-full" /> {/* Adjust width and height here */}
                  </div>
                </div>
<<<<<<< Updated upstream
              </div>
              <div className="w-1/2 p-4 text-white">
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
                  onClick={openEmailModal}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Send Emails
                </button>
              </div>
            ) : (
              <div className="w-full p-4 flex justify-center">

                <button onClick={handleSendRequest} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Generate
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
      <Modal
        isOpen={isEmailModalOpen}
        onRequestClose={closeEmailModal}
        contentLabel="Email Modal"
        className="Modal"
        overlayClassName="Overlay"
      >
        <h2>Send Emails</h2>
        <label className='ModalLabel'>Email Subject:</label>
        <input
          type="text"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          className="ModalInput"
        />
        <label className='ModalLabel'>Email Content:</label>
        <textarea
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          className="ModalInput"
        />
        {
          subLoad
          ?
          <button className="ModalButton">Loading...</button>          
          :
          <button onClick={handleProceed} className="ModalButton">Send</button>
        }
        <button onClick={closeEmailModal} className="ModalCloseButton"><IoMdClose /></button>
      </Modal>
    </div>
  );
};

export default PreviewPage;

=======
              )}
              {showProceedButton ? (
                <>
                  <table className="w-full mt-14 mb-10">
                  <thead>
                    <tr>
                      <th className="border-b-2 px-4 text-white font-urbanist py-2">Sl no</th>
                      <th className="border-b-2 px-4 text-white font-urbanist py-2">Emails</th>
                      <th className="border-b-2 px-4 text-white font-urbanist py-2">Click to preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultEmails.map((email, index) => (
                      <tr key={index}>
                        <td className="px-4 text-center text-white font-urbanist py-2">{index + 1}</td>
                        <td className="px-4 text-center text-white font-urbanist py-2">{email}</td>
                        <td className="px-4 text-center text-white font-urbanist py-2 flex justify-center">
                          <button
                            onClick={() => handleImageClick(resultImages[index])}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
  
                  <div className="w-full p-4 flex justify-center">
                    <button
                      onClick={handleProceed}
                      className="text-white font-bold py-2 px-4 rounded"
                      style={gradientBtn}
                    >
                      Start Mailing
                    </button>
                    <button
                      onClick={handleBulkDownload}
                      className="ml-4 text-white font-bold py-2 px-4 rounded"
                      style={gradientBtn}
                    >
                      Download as ZIP format
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full p-4 flex justify-center">
                  <button onClick={handleSendRequest} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
  
>>>>>>> Stashed changes
