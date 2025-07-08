import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MembershipPromiseSection = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <div className="w-full bg-white py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

         
          <div className="md:col-span-6" data-aos="fade-right">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Promise to Members</h2>

            <p className="text-black mb-4 font-semibold">
              At CHAUDHRY, we are committed to providing our Members with an unbeatable auction experience.
            </p>

            <p className="text-black mb-4 leading-relaxed">
              And we think that our combination of stock variety, online auction convenience and nationwide presence (with locations based all over the Pakistan), means that we can do just that...
            </p>

            <p className="text-black mb-6 leading-relaxed">
              Whether you’re a car dealer, business owner or dismantler, a browse through our extensive variety of vehicles (including the largest selection of New stock in Pakisatn), should assure that CHAUDHRY Cars Auction has something to suit all trade needs and requirements.
            </p>

            <Link to="/register">
              <button className="bg-[#ffbf00] text-white px-6 py-2 rounded hover:opacity-90 transition-all duration-300 cusrsor-pointer">
                Register Now
              </button>
            </Link>
          </div>

        
          <div className="md:col-span-1 hidden md:block"></div>

         
          <div className="md:col-span-5" data-aos="fade-left">
            <Link to="/register">
              <img
                src="https://media.istockphoto.com/id/1371333667/photo/cars-for-sale-stock-lot-row.jpg?s=612x612&w=0&k=20&c=VfEs7VYfCfhcXH7INxn5ciAO5sktUCQwQr5yUbml09s="
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

export default MembershipPromiseSection;
