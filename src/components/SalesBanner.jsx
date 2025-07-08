import React from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from 'react-icons/fa';

const SalesBanner = () => {
  return (
    <section className="relative bg-cover bg-center bg-no-repeat h-[350px] md:h-[450px] flex items-center justify-center text-center"
      style={{ backgroundImage: "url('https://www.wsupercars.com/wp-content/uploads/2025-Aston-Martin-DB12-Goldfinger-Edition-001.jpg')" }} 
    >
      
      <div className="absolute inset-0 bg-black/50"></div>

    
      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
        Pricelist of All Cars
        </h1>
        <Link
            to="#"
            className="text-white mt-4 text-sm md:text-lg max-w-2xl mx-auto block text-center hover:text-[#FFDAB9] transition-colors duration-300"
            >
                 View Prices of All New Cars  <FaAngleRight className="inline-block ml-1" />
        </Link>
      </div>
    </section>
  );
};

export default SalesBanner;
