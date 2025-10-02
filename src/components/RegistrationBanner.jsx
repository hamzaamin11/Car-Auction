import React from "react";
import "animate.css";
import bannerImage from "../../src/assets/copart2.jpg";

const RegistrationBanner = () => {
  return (
    <div
      className="relative hidden w-full h-96 bg-cover bg-center lg:flex items-center justify-center"
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      <div className="absolute inset-0 bg-gray bg-opacity-40 bg-pattern-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')]"></div>

      <h1 className="z-10 text-white text-4xl md:text-6xl font-bold text-start px-4 animate__animated animate__fadeIn animate__delay-1s">
        Registration Portal
      </h1>
    </div>
  );
};

export default RegistrationBanner;
