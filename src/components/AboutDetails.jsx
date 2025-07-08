import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutDetails = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-24">
      <div
        className="max-w-8xl mx-auto text-left"
        data-aos="fade-up"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
        An industry leader in used and New cars auctions with over a decade of experience in the Pakistan automotive industry.
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
        CHAUDHRY Cars Auction handles more than 500,000 vehicles every year through an exclusive online auction 
        platform selling vehicles on behalf of the insurance sector, fleet, lease and hire companies, 
        trade sellers, the general public and more...

        From cars, classics and commercial vans to HGV’s, and 
        more, our extensive range of accident damaged inventory ensures that our Members benefit 
        from a variety of choice when bidding with us. We are used car specialists within the New market.
        </p>
      </div>
    </section>
  );
};

export default AboutDetails;
