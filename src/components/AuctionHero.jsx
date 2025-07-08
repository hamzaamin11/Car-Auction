
import React from 'react';

const AuctionHero = () => {
  return (
    <section className="relative bg-gray-900 text-white">
      <img
        src="https://www.carpro.com/hs-fs/hubfs/2023-Chevrolet-Corvette-Z06-credit-chevrolet.jpeg?width=1020&name=2023-Chevrolet-Corvette-Z06-credit-chevrolet.jpeg"
        alt="Auction Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="relative z-10 text-center py-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Sell Your Car in Our Auction</h1>
        <p className="text-lg md:text-xl">Get the highest bid with a hassle-free process at CHAUDHRY Cars Auction</p>
      </div>
    </section>
  );
};

export default AuctionHero;
