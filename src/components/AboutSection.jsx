import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const transition = { duration: 1 };

const AboutSection = () => {
  return (
  <section
  id="about"
  className="w-full py-2 px-4 bg-gray-100 overflow-hidden hidden md:block "
>

      <div className="max-w-[90rem] mx-auto text-left  ">
        {/* Heading */}
        <motion.h2
          className="lg:text-3xl text-xl font-extrabold text-gray-900 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={transition}
        >
          About WheelBidz Pakistan
        </motion.h2>

        {/* Grid Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center ">
          {/* Left Image */}
          <motion.div
            className="w-full "
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={transition}
          >
            <img
              src="/cars.jpg"
              alt="New Cars"
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="text-left"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={transition}
          >
            <div className="text-gray-700 text-base sm:text-lg lg:text-[17px]  space-y-4 ">
              <p>
                Welcome to
                <span className="font-semibold">WheelBidz Pakistan</span> – the
                future of vehicle bidding in Pakistan! We are a dynamic and
                innovative startup dedicated to transforming the way people buy
                and sell vehicles.
              </p>
              <p>
                Each vehicle listed on WheelBidz goes through a thorough
                certification process, ensuring that you receive only the best
                options that meet the right quality standards for their price.
                Our professional team carefully verifies and approves vehicles
                so that our customers can bid with confidence and peace of mind.
              </p>
              <p>
                At WheelBidz Pakistan, we are not just a bidding platform — we
                are your trusted partner in driving quality, trust, and value
                across Pakistan.
              </p>
            </div>

            {/* Button */}
            <Link
              to="/about"
              className="mt-3 inline-block bg-red-600 text-white font-medium px-5 py-2.5 rounded hover:brightness-110 transition duration-300"
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
