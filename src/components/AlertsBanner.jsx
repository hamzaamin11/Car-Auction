import React from "react";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";

const AlertsBanner = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-[300px] md:h-[400px] flex items-center justify-center text-center"
      style={{ backgroundImage: "url('/alert.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
          Vehicles Alerts
        </h1>
      
      </div>
    </section>
  );
};

export default AlertsBanner;
