import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutNews = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <div className="w-full bg-white py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

         
          <div className="md:col-span-6" data-aos="fade-right">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">What's Going on at CHAUDHRY Cars Auction</h2>

            <p className="text-black mb-4">
            <strong>At CHAUDHRY Cars Auction, we’re always on the move</strong>. That’s why we’ve created a dedicated Member News 
            section which features vehicle highlights, helpful hints and tips, exciting announcements and more.
            </p>

           

            <p className="text-black mb-6 leading-relaxed">
            Through this section, we not only aim to match buyers to their desired vehicles but also to 
            improve their knowledge of our auction platform and its offering so that they can become expert buyers.
            </p>

            <Link to="/news">
              <button className="bg-[#ffbf00] text-white px-6 py-2 rounded hover:opacity-90 transition-all duration-300 cusrsor-pointer">
               Read the Latest News
              </button>
            </Link>
          </div>

        
          <div className="md:col-span-1 hidden md:block"></div>

         
          <div className="md:col-span-5" data-aos="fade-left">
            <Link to="/register">
              <img
                src="/news.jpg"
                alt="Membership Values"
                className="w-full h-auto shadow-md"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutNews;
