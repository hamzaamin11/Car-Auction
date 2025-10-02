import React from "react";
import toyotaImg from "../../src/assets/contact.png";

export const PartnerHero = () => {
  return (
    <div
      className="min-h-screen w-[100rem] bg-cover bg-center flex items-start px-4 py-8"
      style={{
        backgroundImage: `url(${toyotaImg})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 px-4">
        <h1 className="text-xl md:text-3xl font-bold text-white animate-fade-in">
          Become a Partner with WheelBidz
        </h1>
      </div>
    </div>
  );
};
