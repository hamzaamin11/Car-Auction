import React from "react";
import Logo from "../../src/assets/wheellogo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const { currentUser } = useSelector((state) => state.auth);
  return (
    <footer className="relative text-white bg-[#1a1a1a]">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 lg:py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {/* Logo & About */}
        <div className="sm:col-span-2 md:col-span-1">
          <img
            src={Logo}
            alt="Company Logo"
            className="w-36 mb-4 bg-white p-2 rounded shadow-md"
          />
          <p className="text-gray-300 text-sm leading-relaxed">
            WheelBidz offers secure online vehicle auctions, connecting buyers
            with top-quality cars at competitive prices.
          </p>
        </div>
        

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/" className="hover:text-[#b73439]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#b73439]">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/today" className="hover:text-[#b73439]">
                Today's Auctions
              </Link>
            </li>
            <li>
              <Link to="/calendar" className="hover:text-[#b73439]">
                Auction Calendar
              </Link>
            </li>
            <li>
              <Link to="/join" className="hover:text-[#b73439]">
                Join Auctions
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Services & Support</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/center" className="hover:text-[#b73439]">
                Support Center
              </Link>
            </li>
            
            <li>
              <Link to="/delivery" className="hover:text-[#b73439]">
                Vehicle Delivery
              </Link>
            </li>
            {currentUser ? null : (
              <div>
                <li>
                  <Link to="/register" className="hover:text-[#b73439]">
                    Register
                  </Link>
                </li>
                
                <li>
                  <Link to="/login" className="hover:text-[#b73439] ">
                    Sign In
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-3">
            {[
              {
                Icon: FaFacebookF,
                link: "https://facebook.com",
                color: "hover:text-blue-500",
              },
              {
                Icon: FaInstagram,
                link: "https://instagram.com",
                color: "hover:text-pink-500",
              },
              {
                Icon: FaTwitter,
                link: "https://twitter.com",
                color: "hover:text-sky-400",
              },
              {
                Icon: FaLinkedinIn,
                link: "https://linkedin.com",
                color: "hover:text-blue-600",
              },
              {
                Icon: FaYoutube,
                link: "https://youtube.com",
                color: "hover:text-red-500",
              },
            ].map(({ Icon, link, color }, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-9 h-9 flex items-center justify-center bg-white text-black rounded-md shadow-md transition ${color}`}
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Newsletter</h3>
          <p className="text-sm text-gray-300 mb-3">
            WheelBidz First Online Cars Auction Platform in Pakistan
          </p>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="bg-[#111] border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-center text-sm text-gray-400 text-center md:text-left">
          <span>
            © {new Date().getFullYear()} WheelBidz. All Rights Reserved.
          </span>
          <span className="mt-2 md:mt-0">
            Developed with <span className="text-red-500">❤</span> by
            <a
              href="https://technicmentors.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 mx-1"
            >
              Technic Mentors
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
