import React from 'react';
import BrandLogo from "../images/brand-logo.png";
import Logo from "../images/Logo.png";
import { FaLinkedinIn, FaTwitter, FaFacebookF } from "react-icons/fa";

function Footer() {
  const socialLinks = [
    { label: "LinkedIn", icon: FaLinkedinIn },
    { label: "Facebook", icon: FaFacebookF },
    { label: "Twitter", icon: FaTwitter },
  ];

  return (
    <footer className="bg-transparent shadow-md py-8 w-full">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="md:flex md:justify-between items-center">
          <div className="mb-8 md:mb-0">
            <a href="/" className="flex items-center text-lg mb-4">
              <img src={BrandLogo} className="h-12 me-3" alt="Webkite Logo" />
              <span className="text-4xl font-semibold whitespace-nowrap text-white">WEB<span className='text-orange-600'>KITES</span></span>
            </a>
            <p className="text-xl mb-2 text-white font-urbanist">+1 (7635) 547-12-97</p>
            <p className="text-base text-white font-urbanist">support@lift.agency</p>
          </div>
          <div className='md:w-2/4 md:pl-10 md:py-4'>
            <h2 className="mb-8 text-lg md:text-xl font-bold text-white uppercase font-urbanist text-left">Quick Links</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-4 sm:grid-cols-2">
              <div>
                <ul className="text-white font-medium">
                  <li className="mb-4">
                    <a href="/" className="hover:underline text-white font-urbanist">Product</a>
                  </li>
                  <li>
                    <a href="/" className="hover:underline text-white font-urbanist">Information</a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="text-white font-medium">
                  <li className="mb-4">
                    <a href="/" className="hover:underline text-white font-urbanist">Company</a>
                  </li>
                  <li>
                    <a href="/" className="hover:underline text-white font-urbanist">Lift Media</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="md:w-1/4 flex flex-col items-center justify-center md:py-4 mt-12 md:mt-0">
            <div className="relative mb-6">
              <h2 className="mb-2 text-lg md:text-xl font-semibold text-white text-left uppercase font-urbanist">Subscribe</h2>
              <div className='flex flex-row'>
                <input type="email" id="email" className="flex-grow rounded-lg bg-white border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 font-urbanist" placeholder="Get product updates" required />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-8 border sm:mx-auto lg:my-8" style={{ borderColor: "#57595F" }} />

        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex mt-6 sm:mt-4 sm:justify-center sm:mt-0">
            <div className="footer-icons flex items-center space-x-3 sm:text-center">
              {socialLinks.map((socialLink, index) => {
                const Icon = socialLink.icon;
                return (
                  <Icon
                    key={`social-${index}`}
                    className="w-10 h-10 p-2 text-white rounded-full border border-gray-300 bg-transparent hover:bg-white hover:text-black cursor-pointer transition-colors duration-300"
                  />
                );
              })}
            </div>
          </div>

          <p className='text-white font-urbanist text-center md:mt-4 sm:mt-8'>
            A product of <img src={Logo} className="inline" alt="Logo" />
          </p>

          <span className="text-sm text-white sm:text-center dark:text-white font-urbanist">© 2024 <a href="/" className="hover:underline font-urbanist">Lift Media</a>. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
