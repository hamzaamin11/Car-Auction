import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AboutLocation = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <div className="w-full bg-[#e7f1fd] py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
       
          <div className="md:col-span-5" data-aos="fade-right">
            <Link to="/about">
              <img
                src="https://i.pinimg.com/originals/8a/cf/52/8acf52a4b755b302b2179d8cf5a8fa9b.jpg"
                alt="Copart History"
                className="w-full h-auto shadow-md"
              />
            </Link>
          </div>

       
          <div className="md:col-span-1 hidden md:block"></div>

       
          <div className="md:col-span-6 text-left" data-aos="fade-left">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
             
            Where to Find Us
            </h2>
            <p className="text-black mb-4 leading-relaxed">
            CHAUDHRY Cars Auction Limited holds many physical locations across the Pakistan where vehicles are collected, processed and prepared for auction by our specialist teams.
            </p>
            <p className="text-black mb-4 leading-relaxed">
            Covering over 700 acres, these Operation Centres have been strategically located to cater for several regions of the Pakistan and ensure that all national buyers have a Copart Operations Centre within driving distance.
            </p>
            <p className="text-black mb-6 leading-relaxed">
              <strong>To find your nearest Operations Centres, visit our locations page.</strong> 
            </p>
            <Link to="/about">
              <button className="bg-[#ffbf00] text-white px-6 py-2 rounded hover:opacity-90 transition-all cursor-pointer duration-300">
                View Locations
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutLocation;
