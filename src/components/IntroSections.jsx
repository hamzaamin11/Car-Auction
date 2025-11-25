import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

const IntroSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="w-full bg-[#f9fbff] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2" data-aos="fade-right">
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-8 leading-tight">
            How it Works
          </h1>

          <div className="space-y-8 text-gray-700 text-base sm:text-md">
            <div>
              <h4 className="text-xl font-semibold mb-1">
                Over 500,000 Cars, Vans, HGVs and More for Sale
              </h4>
              <p>
                WheelBidz have something for everyone — used car
                buyers, dismantlers, dealers, body shops, New buyers and
                individuals.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-1">
                A Better Way to Buy
              </h4>
              <p>
                Buy your next car from the comfort of your own home. Win your
                car at an online auction, or let our proprietary software do the
                bidding for you.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-semibold  mb-1">Global Leader</h4>
              <p>
                WheelBidz is a global leader in 100% online car auctions
                featuring used and New vehicles.
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/"
                className="inline-block bg-blue-950 hover:bg-blue-900 text-white font-semibold py-2.5 px-6 rounded-lg  transition duration-300 shadow"
              >
                Search Stock
              </Link>
            </div>
          </div>
        </div>

        <div className="md:w-1/2" data-aos="fade-left">
          <img
            src="/images/work.avif"
            alt="Copart How it Works"
            className="w-full max-w-md mx-auto md:max-w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
