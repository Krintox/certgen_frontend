import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../ProjectContext'; // Updated import
import AWS from 'aws-sdk';
import Footer from './Footer';

const UploadPage = () => {
  const navigate = useNavigate();
  const { projectId, userId } = useProject(); // Use the custom hook
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);

  // AWS S3 Configuration
  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  useEffect(() => {
    if (uploadedImageFile) {
      setShowProceedButton(true);
    }
  }, [uploadedImageFile]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setUploadedImageFile(file);
  };

  const uploadToS3 = async (file, fileName) => {
    const params = {
      Bucket: 'certgen-qr',
      Key: fileName,
      Body: file,
      ContentType: file.type,
    };

    return s3.upload(params).promise();
  };

  const handleDataSubmission = async () => {
    if (!uploadedImageFile) {
      alert("No image uploaded");
      return;
    }

    setIsLoading(true);

    try {
      const fileName = `${userId}/${projectId}/${uploadedImageFile.name}`;
      const result = await uploadToS3(uploadedImageFile, fileName);

      if (result) {
        alert("Image uploaded successfully");
        navigate('/drag', { state: { uploadedImageFile } });
      }
    } catch (error) {
      console.error('Error uploading project image:', error);
      alert('Failed to upload project image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mt-10">
      <h1 className="text-7xl md:text-8xl font-semibold text-white border-b-2 under md:pb-2 max-md:text-7xl bebas">CERTGEN</h1>
      <p className="text-white text-left font-urbanist text-sm md:text-lg lg:text-xl xl:text-2xl max-md:m-8 md:m-12">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis aliquam ut porttitor leo a diam sollicitudin. Est velit egestas dui id ornare arcu odio ut sem.
      </p>
      <div className="w-3/4 max-w-md bg-transparent rounded-lg md:mt-20" style={{ minHeight: '300px' }}>
        {!uploadedImageFile && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg max-md:mx-5">
            <label htmlFor="fileInput" className="custom-file-upload">
              <input type="file" accept="image/*" id="fileInput" className='inputfile' onChange={handleImageUpload} />
              <div className="upload-icon custom-file-upload">+</div>
            </label>
            <p className="md:text-lg text-center font-medium text-gray-500 md:mt-10 max-md:m-2">
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
