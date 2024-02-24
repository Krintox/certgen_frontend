import React, { useState } from 'react';

const UploadPage = () => {
  const [showExcelSheet, setShowExcelSheet] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState(null); // Store the uploaded image file object instead of URL
  const [uploadedExcelFile, setUploadedExcelFile] = useState(null); // Store the uploaded Excel file object instead of URL

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setUploadedImageFile(file); // Store the actual image file object
    setShowExcelSheet(true); // Show Excel upload button after image upload
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    setUploadedExcelFile(file); // Store the actual Excel file object
    setShowExcelSheet(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-black">
      <h1 className="text-3xl md:text-5xl font-bold text-white border-b-2 under md:pb-2">CERT GEN</h1>
      <div className="w-full max-w-md pt-14 bg-transparent rounded-lg shadow-md md:mt-20">
        {uploadedImageFile && ( // Check if there's an image file object
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
              <img
                className="w-full h-full object-cover rounded-lg max-md:p-10"
                src={URL.createObjectURL(uploadedImageFile)} // Use the uploaded image file object for image preview
                alt="Uploaded Image"
              />
            </div>
            {uploadedExcelFile && ( // Render Excel file information only if Excel file has been uploaded
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
                <p className="text-lg font-medium text-gray-500 mb-4">
                  Excel file uploaded: {uploadedExcelFile.name} ({uploadedExcelFile.size} bytes)
                </p>
                {/* Display additional information about the Excel file */}
              </div>
            )}
            {uploadedImageFile && !uploadedExcelFile && ( // Render Excel upload button only if image has been uploaded
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
                <label htmlFor="excelInput" className="custom-file-upload">
                  <input type="file" accept=".xlsx, .xlsm, .xls" id="excelInput" className='inputfile' onChange={handleExcelUpload} />
                  <div className="upload-icon">+</div>
                </label>
                <p className="text-lg font-medium text-gray-500">
                  Upload the excel sheet
                </p>
              </div>
            )}
          </div>
        )}
        {!uploadedImageFile && !uploadedExcelFile && ( // Display only the upload boxes initially
          <div className="flex flex-col items-center justify-center p-4  border-2 border-dashed rounded-lg max-md:p-10">
            {/* Modified file upload input for image */}
            <label htmlFor="fileInput" className="custom-file-upload">
              <input type="file" accept="image/*" id="fileInput" className='inputfile' onChange={handleImageUpload} />
              <div className="upload-icon">+</div>
            </label>
            <p className="text-lg font-medium text-gray-500 md:mt-10">
              Upload the certificate template
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
