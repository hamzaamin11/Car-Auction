import React, { useEffect } from 'react';
import AOS from 'aos';
import { IoIosArrowForward } from 'react-icons/io';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

const PaymentMethods = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="payment-methods bg-white text-gray-800 px-4 md:px-16 py-10" data-aos="fade-up">
      
   
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        
        <div className="w-full md:w-1/2">
          <div className="heading mb-4">
            <h1 className="text-3xl font-bold text-gray-800">A Number of Payment Methods</h1>
            <hr className="w-20 border-b-2 border-red-600" />
          </div>

          <p className="mb-4">
            CHAUDHRY Cars Auction makes it easy for you to pay for your vehicles in-person or online with ease, with a number of different payment methods.
          </p>
          
          <Link
            to="/"
            className="text-[#ffbf00] flex items-center gap-1 hover:underline"
          >
            Payment Methods
            <IoIosArrowForward className="w-4 h-4" />
          </Link>
        </div>

        
        <div className="w-full md:w-1/2">
          <img
            src="/images/payment.svg"
            alt="Payment Methods"
            className="w-auto h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
