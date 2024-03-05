// LoadingPage.js
import React from 'react';
import loadingGif from '../images/loading.GIF'; // Import your loading GIF

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center bg-transparent">
      <img src={loadingGif} alt="Loading..." />
    </div>
  );
};

export default LoadingPage;
