import React from "react";
import bannerSupport from "../assets/supportBanner.jpg"; // fixed import path

const DeliveryHero = () => {
  return (
    <section className="relative bg-black text-white text-center min-h-[200px] md:min-h-[350px] flex items-center justify-center px-6">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerSupport})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-xl md:text-5xl font-bold">
          Reliable Vehicle Delivery
        </h1>
      </div>
    </section>
  );
};

export default DeliveryHero;
