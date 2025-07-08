import React from 'react';

const HeadingSection = () => {
  return (
    <section className="relative text-white h-96 flex items-center justify-center">
   
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://blog.remove-bg.ai/wp-content/uploads/2024/03/city-background-for-car-photo.jpg')",
        }}
      />

  
      <div className="absolute inset-0 bg-black opacity-40"></div>

     
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          We Will Buy Your Vehicle
        </h1>
        <p className="text-lg md:text-xl">
          Sell your car fast and easy — Get the best offer from Chuhdary Cars Auction
        </p>
      </div>
    </section>
  );
};

export default HeadingSection;
