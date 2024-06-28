import React, { useState } from 'react';
import axios from 'axios';

const AdminImageDisplay = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [imageId, setImageId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const credentials = `${username}:${password}`;
      const base64Credentials = btoa(credentials);

      const response = await axios.get(`https://certgen-backend.vercel.app/projects/image/${imageId}`, {
        headers: {
          Authorization: `Basic ${base64Credentials}`,
        },
      });

      setImageUrl(response.data.imageUrl);
      setErrorMessage('');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMessage('Unauthorized: Incorrect username or password');
      } else if (error.response && error.response.status === 404) {
        setErrorMessage('Image not found');
      } else {
        setErrorMessage('Error fetching image URL');
      }
      setImageUrl('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}
        <label className="block mb-2">
          <span className="text-gray-700">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            required
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            required
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Image ID</span>
          <input
            type="text"
            value={imageId}
            onChange={(e) => setImageId(e.target.value)}
            className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
            required
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Display Image
        </button>
      </form>
      {imageUrl && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Certificate Image:</h3>
          <img src={imageUrl} alt={imageUrl}></img>
          <p className="text-blue-500 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
};

export default AdminImageDisplay;
