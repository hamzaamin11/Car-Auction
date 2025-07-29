import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative text-white bg-[#666666]">
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-1">
          <img
            src="/images/logo.png"
            alt="Company Logo"
            className="h-12 mb-4"
          />
          <p className="text-gray-200 text-sm">
            CHAUDHRY Cars Auction offers seamless and secure online vehicle
            auctions, connecting buyers with top-quality cars at competitive
            prices. We are committed to innovation, transparency, and customer
            satisfaction.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/work" className="hover:underline">
                How it works
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/today" className="hover:underline">
                Today's Auctions
              </Link>
            </li>
            <li>
              <Link to="/calendar" className="hover:underline">
                Auction Calendar
              </Link>
            </li>
            <li>
              <Link to="/join" className="hover:underline">
                Join Auctions
              </Link>
            </li>
            <li>
              <Link to="/sell" className="hover:underline">
                Sell in Auctions
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Services & Support</h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li>
              <Link to="/center" className="hover:underline">
                Support Center
              </Link>
            </li>
            <li>
              <Link to="/delivery" className="hover:underline">
                Vehicle Delivery
              </Link>
            </li>
            <li>
              <Link to="/news" className="hover:underline">
                Chaudhry Cars Auction News
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">
                Signin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              className="w-12 h-8 flex items-center justify-center bg-white text-black rounded-lg border border-gray-300 hover:text-blue-600"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              className="w-12 h-8 flex items-center justify-center bg-white text-black rounded-lg border border-gray-300 hover:text-pink-500"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              className="w-12 h-8 flex items-center justify-center bg-white text-black rounded-lg border border-gray-300 hover:text-sky-400"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              className="w-12 h-8 flex items-center justify-center bg-white text-black rounded-lg border border-gray-300 hover:text-blue-500"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://youtube.com"
              className="w-12 h-8 flex items-center justify-center bg-white text-black rounded-lg border border-gray-300 hover:text-red-500"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
          <p className="text-sm text-gray-200 mb-4">
            Subscribe to get the latest news and offers.
          </p>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded text-black w-full"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#ffbf00] hover:bg-[#ffbf00] rounded text-white cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="relative z-10  bg-[#434343]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-gray-300 text-center md:text-left">
          <span>
            © {new Date().getFullYear()} CHAUDHRY Cars Auction. All Rights
            Reserved. Developed with <span className="text-red-500">❤</span>by
          </span>
          <Link
            to="https://technicmentors.com/"
            className="text-blue-400 hover:underline ml-1"
          >
            Technic Mentors
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
