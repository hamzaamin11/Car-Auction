/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import firstImage from "../../src/assets/copart1.jpg";
import secondImage from "../../src/assets/copart2.jpg";
import thirdImage from "../../src/assets/copart3.jpg";

const slides = [
  {
    id: 1,
    heading: "Bid with Confidence, Drive with Trust",
    subheading:
      "Experience Pakistan’s most transparent and fair vehicle bidding platform. Get the best deals with complete peace of mind.",
    image: firstImage,
  },
  {
    id: 2,
    heading: "Only Certified Vehicles, No Compromise",
    subheading:
      "Every vehicle on WheelBidz is carefully inspected and approved to ensure quality that matches the price",
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
    <div className="relative w-full h-[180px] lg:h-[400px] overflow-hidden">
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
              <div className="flex flex-col items-start justify-center h-full bg-black/20 text-white text-center px-4 md:px-10">
                <motion.h1
                  initial={{ y: -60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                  className="text-xl md:text-5xl font-semibold mb-4"
                >
                  {slide.heading}
                </motion.h1>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.7, ease: "easeInOut" }}
                  className="text-lg md:text-lg mb-3 w-1/2 hidden lg:block"
                >
                  {slide.subheading}
                </motion.p>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.7, ease: "easeInOut" }}
                  className="text-sm md:text-lg mb-6 max-w-2xl"
                >
                  {slide.description}
                </motion.p>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarBanner;
