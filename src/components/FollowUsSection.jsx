import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const FollowUsSection = () => {
  return (
    <section className="w-full py-16 px-4 bg-white relative overflow-hidden" id="follow-us">
    
      <div className="absolute top-4 left-4 grid grid-cols-6 gap-5">
        {Array.from({ length: 30 }).map((_, index) => (
          <span
            key={index}
            className="w-2 h-2 bg-gray-300 rounded-full"
          ></span>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Follow Us
        </h2>
        <p className="text-gray-600 mb-8 text-2xl">
          Stay connected with us through our social media platforms.
        </p>

        <div className="flex justify-center space-x-6">
          <a
            href="https://www.facebook.com/TechnicMentors"
            className="text-gray-600 hover:text-white bg-gray-200 hover:bg-blue-600 p-3 rounded-full transition duration-300"
            aria-label="Facebook"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://www.instagram.com/technicmentorsofficial"
            className="text-gray-600 hover:text-white bg-gray-200 hover:bg-pink-500 p-3 rounded-full transition duration-300"
            aria-label="Instagram"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://x.com/TechnicMentors"
            className="text-gray-600 hover:text-white bg-gray-200 hover:bg-blue-400 p-3 rounded-full transition duration-300"
            aria-label="Twitter"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://www.tiktok.com/@technicmentors"
            className="text-gray-600 hover:text-white bg-gray-200 hover:bg-black p-3 rounded-full transition duration-300"
            aria-label="TikTok"
          >
            <FaTiktok size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/TechnicMentors/"
            className="text-gray-600 hover:text-white bg-gray-200 hover:bg-blue-700 p-3 rounded-full transition duration-300"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={20} />
          </a>
          <a
            href="https://www.youtube.com/c/TechnicMentors"
            className="text-gray-600 hover:text-white bg-gray-200 hover:bg-red-600 p-3 rounded-full transition duration-300"
            aria-label="YouTube"
          >
            <FaYoutube size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FollowUsSection;
