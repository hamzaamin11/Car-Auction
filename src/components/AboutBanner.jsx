import React from "react";

const AboutBanner = () => {
  return (
    <section className="relative bg-cover bg-center bg-no-repeat h-[300px] md:h-[400px] flex items-center justify-center text-center"
      style={{ backgroundImage: "url('https://imagescdn.dealercarsearch.com/DealerImages/ImageLibrary/1920x800/dcc53574.jpg')" }} 
    >
      
      <div className="absolute inset-0 bg-black/60"></div>

    
      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
        About CHAUDHRY Cars Auction Limited
        </h1>
        <p className="text-white mt-4 text-sm md:text-lg max-w-2xl mx-auto">
        The Used and New Cars Auction Specialists
        </p>
      </div>
    </section>
  );
};

export default AboutBanner;
