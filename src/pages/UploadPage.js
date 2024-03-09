import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const navigate = useNavigate();
  const [uploadedImageFile, setUploadedImageFile] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setUploadedImageFile(file);
  };

  const handleDataSubmission = async () => {
    if (!uploadedImageFile) {
      alert("No image uploaded")
      return;
    }

    try {
      // Create FormData object to send the image file
      const formData = new FormData();
      formData.append('imageFile', uploadedImageFile);

      // Make a POST request to the backend endpoint
      const response = await fetch('https://certgen-backend.vercel.app/createProject/image', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Include credentials for cookie authentication
      });

      if (response.ok) {
        // Redirect to the next step if the request is successful
        alert("image uploaded");
        navigate('/drag', { state: { uploadedImageFile } });
      } else {
        // Handle error response
        console.error('Failed to upload project image:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading project image:', error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full mt-10 min-h-screen">
      <h1 className="text-7xl md:text-8xl font-semibold text-white border-b-2 under md:pb-2">CERT GEN</h1>
      <p className="text-white text-center font-urbanist text-md md:text-lg lg:text-xl xl:text-2xl m-12">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis aliquam ut porttitor leo a diam sollicitudin. Est velit egestas dui id ornare arcu odio ut sem.
      </p>
      <div className="w-full max-w-md bg-transparent rounded-lg shadow-md md:mt-20" style={{ minHeight: '500px' }}>
        {!uploadedImageFile && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
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
