import React from "react";

const ContactHero = () => {
  return (
    <section className="relative bg-cover bg-center bg-no-repeat h-[300px] md:h-[400px] flex items-center justify-center text-center"
      style={{ backgroundImage: "url('https://images.squarespace-cdn.com/content/v1/637fdbcf886bf14422b9b853/c9607c3d-7781-4bcf-9a54-d690a3f66f50/car+1.jpeg')" }} 
    >
      
      <div className="absolute inset-0 bg-black/60"></div>

    
      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
        CONTACT US
        </h1>
        <p className="text-white mt-4 text-sm md:text-lg max-w-2xl mx-auto">
        We would love to hear from you. Whether you have a question about features, trials, pricing, or anything else.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;
