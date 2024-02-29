import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [excelFile, setExcelFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [arrayOfImages, setArrayOfImages] = useState([]);
  const [arrayOfEmails, setArrayOfEmails] = useState('');

  const handleExcelFileChange = (event) => {
    setExcelFile(event.target.files[0]);
  };

  const handleImageFileChange = (event) => {
    setImageFile(event.target.files[0]);
  };

  const handleArrayOfImagesChange = (event) => {
    setArrayOfImages(Array.from(event.target.files));
  };

  const handleArrayOfEmailsChange = (event) => {
    setArrayOfEmails(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('excelFile', excelFile);
      formData.append('imageFile', imageFile);
      arrayOfImages.forEach(file => {
        formData.append('arrayOfImages', file);
      });
      formData.append('arrayOfEmails', arrayOfEmails);

      const response = await axios.post('http://localhost:4000/processModel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true // Send cookies along with the request
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleExcelFileChange} />
      <input type="file" onChange={handleImageFileChange} />
      <input type="file" multiple onChange={handleArrayOfImagesChange} />
      <input type="text" placeholder="Enter comma-separated email IDs" onChange={handleArrayOfEmailsChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default App;
