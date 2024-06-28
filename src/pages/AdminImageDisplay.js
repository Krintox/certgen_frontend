import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminImageDisplay = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [imageId, setImageId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const AUTH_KEY = 'admin_auth_key';

  useEffect(() => {
    const authKey = localStorage.getItem(AUTH_KEY);
    if (authKey) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (username === 'certqwerty89053' && password === 'touiop37873') {
      const randomString = Math.random().toString(36).substr(2);
      localStorage.setItem(AUTH_KEY, randomString);
      setIsAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Unauthorized: Incorrect username or password');
    }
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`https://certgen-backend.vercel.app/projects/image/${imageId}`);
      setImageUrl(response.data.imageUrl);
      setErrorMessage('');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Image not found');
      } else {
        setErrorMessage('Error fetching image URL');
      }
      setImageUrl('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setImageId('');
    setImageUrl('');
    setErrorMessage('');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        <form onSubmit={handleLoginSubmit} className="bg-white p-6 rounded shadow-md max-w-md w-full">
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
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <form onSubmit={handleImageSubmit} className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <div className='flex justify-between items-start mb-4'>
            <h2 className="text-2xl font-bold text-center">Image ID Input</h2>
            <button
                onClick={handleLogout}
                className="self-end bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Logout
            </button>
        </div>
        {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}
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
        <div className='flex justify-center'>
            <button
            type="submit"
            className="self-end bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 focus:outline-none focus:shadow-outline"
            >
            Display Image
            </button>
        </div>
      </form>
      {imageUrl && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Certificate Image:</h3>
          <img src={imageUrl} alt="Certificate" />
          <p className="text-blue-500 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
};

export default AdminImageDisplay;
