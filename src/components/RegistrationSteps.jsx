import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FiUpload, FiSearch, FiCalendar, FiTruck } from 'react-icons/fi'; 
import { FiArrowRight } from "react-icons/fi";
import { Link } from 'react-router-dom';

const RegistrationSteps = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="w-full bg-[#f9fbff] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
        <div className="heading-mobile-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">After You have Registered:</h1>
          <hr className="w-50 mx-auto border-t-3 border-[#c90107]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="step text-center" data-aos="fade-up">
            <FiUpload className="icon w-20 h-20 mx-auto mb-4 text-blue-950" /> 
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Upload Documents</h2>
            <p className="text-gray-700 mb-4">
              Upload photographic ID and any applicable business documents.
            </p>
           
          </div>

          <div className="step text-center" data-aos="fade-up" data-aos-delay="200">
            <FiSearch className="icon w-20 h-20 mx-auto mb-4 text-blue-950" /> 
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Search and Save</h2>
            <p className="text-gray-700 mb-4">
              Browse nearly 14,000 vehicles every day. Sign up for alerts to get notified when a new vehicle is up for grabs.
            </p>
            
          </div>

          <div className="step text-center" data-aos="fade-up" data-aos-delay="400">
            <FiCalendar className="icon w-20 h-20 mx-auto mb-4 text-blue-950" /> 
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Join Auctions</h2>
            <p className="text-gray-700 mb-4">
              Join the fun and use Copart’s patented virtual bidding technology. Need it sooner? Browse our “Buy it Now” inventory.
            </p>
            
          </div>

          <div className="step text-center" data-aos="fade-up" data-aos-delay="600">
            <FiTruck className="icon w-20 h-20 mx-auto mb-4 text-blue-950" /> 
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Get it Delivered</h2>
            <p className="text-gray-700 mb-4">
              Order delivery, or collect using your own preferred transporter, or pick it up yourself via our Transportation App.
            </p>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSteps;
