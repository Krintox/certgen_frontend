import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const UploadPage = () => {
  const [showExcelSheet, setShowExcelSheet] = useState(false);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [uploadedExcelFile, setUploadedExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setUploadedImageFile(file);
    setShowExcelSheet(true);
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    setUploadedExcelFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const [header, ...rows] = jsonData;
      const processedData = rows.map((row, index) => ({
        slNo: index + 1,
        email: row[0],
        name: row[1],
      }));

      setExcelData(processedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDataSubmission = async () => {
    if (!uploadedImageFile || !uploadedExcelFile) {
      setError('Please upload both the certificate template and the Excel data file.');
      return;
    }

    const formData = new FormData();
    formData.append('image', uploadedImageFile);
    formData.append('excel', uploadedExcelFile); // Append entire Excel file

    try {
      const response = await fetch('http://127.0.0.1:5000', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const results = await response.json();
      console.log('API response:', results);

      // Handle successful submission (optional)
      // You can redirect to the preview page at this point if needed:
      // window.location.href = `/preview`;

    } catch (error) {
      console.error('Error sending data:', error);
      setError('An error occurred while submitting the data. Please try again later.');
    }
  };
  
  const gradientBgLeft = {
    background: "linear-gradient(to right, #FFA500, #FF6347)",
  };

  const gradientBgRight = {
    background: "linear-gradient(to right, #333333, #666666)",
  };
  
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl md:text-5xl font-bold text-white border-b-2 under md:pb-2">CERT GEN</h1>
      <div className="w-full max-w-md  bg-transparent rounded-lg shadow-md md:mt-20">
        {uploadedImageFile && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
              <img
                className="w-full h-full object-cover rounded-lg max-md:p-10"
                src={URL.createObjectURL(uploadedImageFile)}
                alt="Uploaded Image"
              />
            </div>
            {uploadedExcelFile && (
              <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
                <p className="text-lg font-medium text-gray-500 mb-4">
                  Excel file uploaded: {uploadedExcelFile.name} ({uploadedExcelFile.size} bytes)
                </p>
              </div>
            )}
            {uploadedImageFile && !uploadedExcelFile && (
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
        {excelData.length > 0 && (
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-white-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" class="px-6 py-3">
                          Product name
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Color
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Category
                      </th>
                      <th scope="col" class="px-6 py-3">
                          Price
                      </th>
                      <th scope="col" class="px-6 py-3">
                          <span class="sr-only">Edit</span>
                      </th>
                  </tr>
              </thead>
                <tbody>
                 {excelData.map((entry) => (
                  <tr key={entry.s1No} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td class="px-6 py-4">
                          {entry.slNo}
                      </td>
                      <td class="px-6 py-4">
                          {entry.email}
                      </td>
                      <td class="px-6 py-4">
                          {entry.name}
                      </td>
                      <td class="px-6 py-4 text-right">
                          <buttton class="hover:text-indigo-900 bg-green-600 p-2">Remove</buttton>
                      </td>
                  </tr>
                 ))}
              </tbody>
            </table>
            </div>
        )}
        {!uploadedImageFile && !uploadedExcelFile && (
          <div className="flex flex-col items-center justify-center p-4  border-2 border-dashed rounded-lg md:p-10">
            <label htmlFor="fileInput" className="custom-file-upload">
              <input type="file" accept="image/*" id="fileInput" className='inputfile' onChange={handleImageUpload} />
              <div className="upload-icon custom-file-upload">+</div>
            </label>
            <p className="text-lg font-medium text-gray-500 md:mt-10">
              Upload the certificate template
            </p>
          </div>
        )}
        {uploadedImageFile && uploadedExcelFile && (
       <button onClick={handleDataSubmission} className="mt-4 bg-orange-500 text-white py-2 px-4 rounded cursor-pointer">
              Proceed
        </button>
        )}
      </div>
    </div>
  );
};

export default UploadPage;




