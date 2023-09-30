import React from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-213555 text-white py-8 sticky">
      <div className="container mx-auto flex justify-center items-center">
        <div className="mr-6">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-white hover:text-gray-500"
          >
            <FaFacebook />
          </a>
        </div>
        <div className="mr-6">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-white hover:text-gray-500"
          >
            <FaTwitter />
          </a>
        </div>
        <div>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-white hover:text-gray-500"
          >
            <FaInstagram />
          </a>
        </div>
      </div>
      <div className="text-center mt-4">
        &copy; {new Date().getFullYear()} ManahSeva. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
