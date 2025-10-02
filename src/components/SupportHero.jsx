import React from "react";
import bannerSupport from "../../src/assets/supportBanner.jpg";
const SupportHero = () => {
  return (
    <section className="relative bg-black text-white text-center py-20 px-6 sm:h-[150px] lg:h-[300px] ">
      <div
        className="absolute min-h-full   inset-0 bg-cover bg-center opacity-50"
        style={{ backgroundImage: `url(${bannerSupport})` }}
      ></div>
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Center</h1>
        <p className="text-lg md:text-xl"></p>
      </div>
    </section>
  );
};

export default SupportHero;
