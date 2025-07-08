import React from "react";
import { FaAngleRight } from "react-icons/fa";

const SearchesBanner = () => {
  return (
    <section className="relative h-[350px] md:h-[450px] flex items-center justify-center text-center overflow-hidden">
    
      <img
        src="/images/saved.avif"
        alt="Saved Searches Background"
        className="absolute inset-0 w-full h-full object-contain z-0"
      />

    
      <div className="absolute inset-0 bg-black/50 z-0"></div>

    
      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
          Saved Searches
        </h1>
        <p className="text-white mt-4 text-sm md:text-lg max-w-2xl mx-auto block text-center hover:text-[#FFDAB9] transition-colors duration-300">
          Save time with Saved Searches <FaAngleRight className="inline-block ml-1" />
        </p>
      </div>
    </section>
  );
};

export default SearchesBanner;
