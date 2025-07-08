/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="w-full py-16 px-4 bg-gray-100 overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto text-left">
        <motion.h2
          className="text-4xl font-extrabold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          About CHAUDHRY Cars Auction
        </motion.h2>

        <p className="mt-4 text-lg text-gray-700">
          An industry leader in used and New car auctions handling more than
          400,000 vehicles every year, CHAUDHRY Car Auctions makes it easy for Members to find,
          bid, and win the vehicles they are looking for through an exclusive online
          platform. With over 30 years of experience in the New market, we are
          experts in the industry.
        </p>

        <p className="mt-4 text-lg text-gray-700">
          Our extensive inventory includes cars ranging from graded used to New
          vehicles, including categories such as CAT S cars and damaged repairable
          cars for sale. We ensure that Members benefit from a variety of choices when
          bidding with us — whether you're a body shop, dealer, dismantler, workshop,
          or an individual trader.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src="/cars.jpg"
              alt="New Cars"
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </motion.div>

          <motion.div
            className="text-left"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Expertise in Cars</h3>
            <p className="text-gray-700 text-lg mb-4">
              CHAUDHRY Cars Auction specializes exclusively in cars, offering a wide range of
              vehicles from used to New. Whether you're looking for a repairable
              car, a project vehicle, we provide a user-friendly
              platform to help you buy with confidence.
            </p>
            <Link
                to="/about"
                className="inline-block bg-[#b73439] text-white font-medium px-4 py-2 rounded hover:brightness-110 transition duration-300"
            >
                Learn More →
            </Link>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
