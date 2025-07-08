import React from "react";
import { Link } from "react-router-dom";

const HomeRegister = () => {
  return (
    <section className="w-full py-20 px-4 bg-gradient-to-r from-gray-100 via-gray-200 to-white" id="register">
      <div className="max-w-7xl mx-auto text-center text-gray-800">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Join Us Today!
        </h2>
        <p className="text-lg mb-8">
        Register now to access used & New cars, vans, HGVs & more in 100% online vehicle auctions.
        </p>

       
        <Link
          to="/register" 
          className="inline-block bg-[#518ecb] text-white font-medium py-3 px-6 rounded-lg text-xl hover:bg-[#4682B4] transition duration-300"
        >
          Register Now
        </Link>
      </div>
    </section>
  );
};

export default HomeRegister;
