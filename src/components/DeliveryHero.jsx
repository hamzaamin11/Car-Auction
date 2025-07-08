
import React from 'react';

const DeliveryHero = () => {
  return (
    <section className="relative bg-black text-white text-center py-20 px-6">
      <div className="absolute inset-0 bg-cover bg-center opacity-50 w-full h-full" style={{ backgroundImage: "url('/images/delivery.webp')" }}></div>
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Reliable Vehicle Delivery</h1>
        <p className="text-lg md:text-xl">  Experience seamless and secure vehicle delivery services tailored to your needs. </p>
      </div>
    </section>
  );
};

export default DeliveryHero;
