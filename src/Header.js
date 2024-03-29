
import React, { useState, useEffect } from 'react';
import HeaderDesktop from './HeaderDesktop.js';
import HeaderMobile from './HeaderMobile.js';

const Header = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 10 }}>
      {windowWidth < 768 ? ( <HeaderMobile /> ) : ( <HeaderDesktop /> )}
    </div>
  );
};

export default Header;