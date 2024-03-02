import React, { useState } from 'react';
import axios from 'axios';

const NewProj = () => {
  const [title, setTitle] = useState('');
  const [excelFile, setExcelFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [arrayOfImages, setArrayOfImages] = useState([]);
  const [message, setMessage] = useState('');

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleExcelFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleArrayOfImagesChange = (e) => {
    setArrayOfImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('excelFile', excelFile);
      formData.append('imageFile', imageFile);
      arrayOfImages.forEach(file => {
        formData.append('arrayOfImages', file);
      });

      const response = await axios.post('http://localhost:4000/createProject', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true // Send cookies along with the request
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error('Error:', error.response.data);
      setMessage('Failed to create project');
    }
  };

  return (
    <div>
      <h2>Create New Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={handleTitleChange} required />
        </div>
        <div>
          <label>Excel File:</label>
          <input type="file" onChange={handleExcelFileChange} required />
        </div>
        <div>
          <label>Image File:</label>
          <input type="file" onChange={handleImageFileChange} required />
        </div>
        <div>
          <label>Array of Images:</label>
          <input type="file" multiple onChange={handleArrayOfImagesChange} required />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default NewProj;
