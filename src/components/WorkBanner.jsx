import React from "react";

const WorkBanner = () => {
  return (
    <section className="relative bg-cover bg-center bg-no-repeat h-[300px] md:h-[400px] flex items-center justify-center text-center"
      style={{ backgroundImage: "url('https://cka-dash.s3.amazonaws.com/025-0219-BS126/mainimage.jpg')" }} 
    >
      
      <div className="absolute inset-0 bg-black/60"></div>

    
      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
        How Work CHAUDHRY Cars Auction Limited
        </h1>
        <p className="text-white mt-4 text-sm md:text-lg max-w-2xl mx-auto">
        Over 500,000 Cars, Vans, HGVs and More for Sale.
        </p>
      </div>
    </section>
  );
};

export default WorkBanner;
