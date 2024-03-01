import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const navigate = useNavigate();
  const [uploadedImageFile, setUploadedImageFile] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setUploadedImageFile(file);
  };

  const handleDataSubmission = () => {
    if (!uploadedImageFile) {
      // Handle error if no image is uploaded
      return;
    }

    // Send the uploaded image to the Canvas page for processing
    navigate('/drag', { state: { uploadedImageFile } });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl md:text-5xl font-bold text-white border-b-2 under md:pb-2">CERT GEN</h1>
      <div className="w-full max-w-md  bg-transparent rounded-lg shadow-md md:mt-20">
        {!uploadedImageFile && (
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
            <label htmlFor="fileInput" className="custom-file-upload">
              <input type="file" accept="image/*" id="fileInput" className='inputfile' onChange={handleImageUpload} />
              <div className="upload-icon custom-file-upload">+</div>
            </label>
            <p className="text-lg font-medium text-gray-500 md:mt-10">
              Upload the certificate template
            </p>
          </div>
        )}
        {uploadedImageFile && (
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
            <img
              className="w-full h-full object-cover rounded-lg max-md:p-10"
              src={URL.createObjectURL(uploadedImageFile)}
              alt="Uploaded Image"
            />
            <button onClick={handleDataSubmission} className="mt-4 bg-orange-500 text-white py-2 px-4 rounded cursor-pointer">
              Proceed to Canvas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
