import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const UploadExcel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [uploadedExcelFile, setUploadedExcelFile] = useState(null);
  const { state } = location;
  const { annotations, canvasImage } = state || {};
  const uploadImage = location.state ? location.state.resizedImage : null;

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    setUploadedExcelFile(file);
  };

  const handleDataSubmission = async () => {
    if (!uploadedExcelFile) {
      // Handle error if no email is uploaded
      return;
    }

    try {
      // Create FormData object to send the Excel file
      const formData = new FormData();
      formData.append('excelFile', uploadedExcelFile);

      // Make a POST request to the backend endpoint
      const response = await fetch('https://certgen-backend.vercel.app/createProject/excel', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Include credentials for cookie authentication
      });

      if (response.ok) {
        // Proceed to the Preview page if the request is successful
        navigate('/preview', { state: { uploadedExcelFile, annotations, canvasImage, uploadImage } });
      } else {
        // Handle error response
        navigate('/preview', { state: { uploadedExcelFile, annotations, canvasImage, uploadImage } });
        console.error('Failed to upload Excel file:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading Excel file:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full md:mt-10 min-h-screen">
      <h1 className="text-7xl md:text-8xl font-semibold text-white border-b-2 under md:pb-2 bebas">CERT GEN</h1>
      <p className="text-white text-left font-urbanist text-md md:text-lg lg:text-xl xl:text-2xl m-12 ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis aliquam ut porttitor leo a diam sollicitudin. Est velit egestas dui id ornare arcu odio ut sem.
      </p>
      <div className="w-3/4 max-w-md  bg-transparent rounded-lg shadow-md md:mt-20">
        {!uploadedExcelFile && (
          <div className="flex flex-col items-center justify-center p-4 pt-4 border-2 border-dashed rounded-lg max-md:py-12">
            <label htmlFor="excelInput" className="custom-file-upload">
              <input type="file" accept=".xlsx, .xlsm, .xls" id="excelInput" className='inputfile' onChange={handleExcelUpload} />
              <div className="upload-icon custom-file-upload">+</div>
            </label>
            <p className="text-lg font-medium text-gray-500 md:mt-10">
              Upload the excel sheet
            </p>
          </div>
        )}
        {uploadedExcelFile && (
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
            {/* Display email content or other details if needed */}
            <img src={uploadImage} alt="Canvas" className="w-full max-w-md mb-4" />
            <h2 className="text-lg font-medium text-gray-500">Annotations:</h2>
            <ul className="text-sm text-gray-500">
              {annotations && annotations.map((annotation, index) => (
                <li key={index}>{annotation.word}</li>
              ))}
            </ul>
            <button onClick={handleDataSubmission} className="mt-4 bg-orange-500 text-white py-2 px-4 rounded cursor-pointer">
              Proceed to Preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadExcel;
