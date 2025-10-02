import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const InventorySection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <section
      className="px-4 py-12 md:px-16 hidden lg:block bg-white"
      data-aos="fade-up"
    >
      <div className=" mx-auto text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 relative inline-block after:content-[''] after:block after:w-80 after:h-1 after:bg-[#c90107] after:mt-2">
          Browse Used Cars
        </h2>
        <p className="mt-6 text-gray-600 text-base md:text-lg">
          It can help you save time by viewing the industry’s most popular New
          vehicle makes and models with one easy click. Take note of your
          bidding competition for these popular used, wrecked, and New vehicles
          and where and when they’ll be up for auction. Stay ahead in the market
          by exploring our comprehensive, ever-expanding inventory of damaged
          and repairable vehicles.
        </p>
      </div>
    </section>
  );
};

export default InventorySection;
