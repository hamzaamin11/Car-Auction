/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCarSide } from "react-icons/fa";

import firstImage from "../../src/assets/copart1.jpg";
import secondImage from "../../src/assets/copart2.jpg";
import thirdImage from "../../src/assets/copart3.jpg";

const slides = [
  {
    id: 1,
    linkText: "Start Bidding",
    linkTo: "/today",
    heading: "Bid with Confidence, Drive with Trust",
    subheading:
      "Experience Pakistan’s most transparent and fair vehicle bidding platform. Get the best deals with complete peace of mind.",
    image: firstImage,
  },
  {
    id: 2,
    linkText: "View Inventory",
    linkTo: "/finder",
    heading: "Only Certified Vehicles, No Compromise",
    subheading:
      "Every vehicle on WheelBidz is carefully inspected and approved to ensure quality that matches the price.",
    image: secondImage,
  },
  {
    id: 3,
    heading: "Your Satisfaction, Our Commitment",
    subheading:
      "From browsing to bidding, we deliver seamless services with reliability, trust, and customer-first support across Pakistan.",
    image: thirdImage,
  },
];

const CarBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px] overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map((slide, index) =>
          index === currentSlide ? (
            <motion.div
              key={slide.id}
              className="absolute w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              {/* Overlay + Content */}
              <div className="flex flex-col items-start justify-center h-full bg-black/40 text-white px-4 sm:px-8 md:px-12">
                {/* Link Button (only if exists) */}

                {/* Heading */}
                <motion.h1
                  initial={{ y: -60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
                  className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-semibold mb-2"
                >
                  {slide.heading}
                </motion.h1>

                {/* Subheading */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.7, ease: "easeInOut" }}
                  className="text-xs sm:text-sm md:text-lg max-w-2xl"
                >
                  {slide.subheading}
                </motion.p>
                {slide.linkText && slide.linkTo && (
                  <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.6,
                      ease: "easeInOut",
                    }}
                    className="mb-3"
                  >
                    <Link
                      to={slide.linkTo}
                      className="inline-flex items-center gap-2 bg-red-600
                      text-white text-xs sm:text-sm md:text-base font-semibold px-4 py-2 mt-4
                      rounded-full transition-all shadow-md"
                    >
                      <FaCarSide className="text-white text-lg animate-ping" />
                      {slide.linkText}
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarBanner;
