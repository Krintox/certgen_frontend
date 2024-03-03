import { upload } from '@testing-library/user-event/dist/upload';
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

  const handleDataSubmission = () => {
    if (!uploadedExcelFile) {
      // Handle error if no email is uploaded
      return;
    }
    
    // Send the uploaded email to the Preview page for processing
    navigate('/preview', { state: {uploadedExcelFile,annotations,canvasImage,uploadImage } });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl md:text-5xl font-bold text-white border-b-2 under md:pb-2">CERT GEN</h1>
      <div className="w-full max-w-md  bg-transparent rounded-lg shadow-md md:mt-20">
        {!uploadedExcelFile && (
          <div className="flex flex-col items-center justify-center p-4 pt-4 border-2 border-dashed rounded-lg">
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
