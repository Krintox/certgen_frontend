import React from 'react';
import BrandLogo from "../images/brand-logo.png"
import Logo from "../images/Logo.png";
import { FaLinkedinIn, FaTwitter, FaFacebookF, FaArrowRight } from "react-icons/fa";

function Footer() {
  const socialLinks = [
    { label: "Linkdln", icon: FaLinkedinIn },
    { label: "Facebook", icon: FaFacebookF },
    { label: "Twitter", icon: FaTwitter },
  ];

  return (
    <footer style={{ backgroundColor: 'linear-gradient(to right, #2E3038, #3B4148)', boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)' }}>
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0 flex flex-col">
            <a href="" className="flex items-center text-lg mb-4">
              <img src={BrandLogo} className="h-8 me-3" alt="Webkite Logo" />
              <span className="self-center text-4xl font-semibold whitespace-nowrap dark:text-white">WEB<span className='text-orange-600'>KITES</span></span>
            </a>
            <p className="self-center text-xl mb-2 whitespace-nowrap text-white">+1 (7635) 547-12-97</p>
            <p className="self-center text-lg whitespace-nowrap text-white">support@lift.agency</p>
          </div>
          <div className='flex flex-col'>
            <h2 className="mb-6 text-sm font-semibold text-white uppercase dark:text-white">Quick Links</h2>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
              <div>
                <ul className="text-white dark:text-white font-medium">
                  <li className="mb-4">
                    <a href="" className="hover:underline text-white">Product</a>
                  </li>
                  <li>
                    <a href="" className="hover:underline text-white">Information</a>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="text-white dark:text-white font-medium">
                  <li className="mb-4">
                    <a href="" className="hover:underline text-white">Company</a>
                  </li>
                  <li>
                    <a href="" className="hover:underline text-white">Lift Media</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mb-6 rounded-lg p-6 sm:flex-row sm:mb-0">
            <div className="relative mr-4">
              <h2 className="mb-6 text-sm font-semibold text-white uppercase dark:text-white">Subscribe</h2>
              <div className='flex flex-row'>
                <input type="email" id="email" className="flex-grow rounded-lg bg-white border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" placeholder="Get product updates" required />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <div className="footer-icons flex items-center space-x-3">
              {socialLinks.map((socialLink, index) => {
                const Icon = socialLink.icon;
                return (
                  <Icon
                    key={`social-${index}`}
                    className="w-12 h-12 p-2 text-white rounded-full border border-gray-300 bg-transparent hover:bg-white hover:text-black cursor-pointer transition-colors duration-300"
                    style={{ color: 'white' }}
                  />
                );
              })}
            </div>
          </div>

          <p className='text-white'>
            A product of <img src={Logo} className="inline" alt="Logo" />
          </p>

          <span className="text-sm text-white sm:text-center dark:text-white">© 2020 <a href="" className="hover:underline">Lift Media.</a>. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
