import React from 'react';
import 'animate.css';


const RegistrationBanner = () => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://c4.wallpaperflare.com/wallpaper/66/25/239/machine-grey-background-volvo-wallpaper-preview.jpg')",
      }}
    >
     
      <div
        className="absolute inset-0 bg-gray bg-opacity-40 bg-pattern-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')]"
      ></div>

     
      <h1 className="z-10 text-black text-4xl md:text-6xl font-bold text-center px-4 animate__animated animate__fadeIn animate__delay-1s">
      Registration Portal
      </h1>
    </div>
  );
};

export default RegistrationBanner;
