import React from "react";
import { Link } from "react-scroll";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:px-32 p-5">
        <div className="flex flex-col md:flex-row gap-5 font-medium p-1 text-lg text-white">
          <Link
            to="home"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-[#539165] transition-all cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="about"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-[#539165] transition-all cursor-pointer"
          >
            About
          </Link>
          <Link
            to="courses"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-[#539165] transition-all cursor-pointer"
          >
            Courses
          </Link>
          <Link
            to="reviews"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-[#539165] transition-all cursor-pointer"
          >
            Reviews
          </Link>
          <Link
            to="contact"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-[#539165] transition-all cursor-pointer"
          >
            Contact
          </Link>
        </div>

        <div className="mt-4 md:mt-0">
          <Link to="/" className="font-semibold text-2xl p-1 cursor-pointer text-white">
                WEB<span className="text-orange-600">KITES</span>
          </Link>
        </div>
      </div>

      <div className="text-center mt-4 text-white">
        <p>
          @copyright developed by{" "}
          <span className="text-brightGreen px-2">champion programmers</span>|
          All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
