import React from 'react';
import 'animate.css';


const SignInBanner = () => {
  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/thumb_back/fh260/background/20230519/pngtree-car-showroom-in-the-dark-lit-room-with-boxes-image_2601969.jpg')",
      }}
    >
     
      <div
        className="absolute inset-0 bg-gray bg-opacity-40 bg-pattern-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')]"
      ></div>

     
      <h1 className="z-10 text-white text-4xl md:text-6xl font-bold text-center px-4 animate__animated animate__fadeIn animate__delay-1s">
        Copart Signin Portal
      </h1>
    </div>
  );
};

export default SignInBanner;
