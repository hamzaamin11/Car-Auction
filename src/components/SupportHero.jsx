
import React from 'react';

const SupportHero = () => {
  return (
    <section className="relative bg-black text-white text-center py-20 px-6">
      <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: "url('/images/support.jpg')" }}></div>
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Center</h1>
        <p className="text-lg md:text-xl">We're here to help you with anything related to Chuhdary Cars Auction</p>
      </div>
    </section>
  );
};

export default SupportHero;
