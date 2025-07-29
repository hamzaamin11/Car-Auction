/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import firstImage from "../../src/assets/c2.jpg";
import secondImage from "../../src/assets/car 1.jpg";
import thirdImage from "../../src/assets/c4.jpg";

const slides = [
  {
    id: 1,
    heading: "400,000+ Vehicles Auctioned Annually",
    subheading:
      "From New to used cars, find your next vehicle easily with CHAUDHRY Cars Auction.",
    description:
      "Join thousands of satisfied members in buying high-quality repairable cars every day.",
    button: "Join Auction Now",
    buttonLink: "/join",
    image: firstImage,
  },
  {
    id: 2,
    heading: "New & Used Cars for Every Buyer",
    subheading:
      "Explore CAT S, CAT N, repairable & graded used cars from top brands.",
    description:
      "Ideal for sellers, businesses, and individual car buyers looking for great value vehicles through online auctions.",
    button: "Browse Cars ",
    buttonLink: "/finder",
    image: secondImage,
  },
  {
    id: 3,
    heading: "Over 30 Years of Trust",
    subheading:
      "Industry experts in New & used car auctions across the Pakistan.",
    description:
      "Secure online platform trusted by thousands to bid, win, and save big.",
    button: "Become a Member",
    buttonLink: "/register",
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
    <div className="relative w-full h-screen overflow-hidden">
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
              <div className="flex flex-col items-center justify-center h-full bg-black/20 text-white text-center px-4 md:px-10">
                <motion.h1
                  initial={{ y: -60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  {slide.heading}
                </motion.h1>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.7, ease: "easeInOut" }}
                  className="text-lg md:text-2xl mb-3"
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

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <Link
                    to={slide.buttonLink}
                    className="inline-flex items-center gap-2 bg-[#b73439]/100 hover:bg-[#ed3237] text-white px-6 py-3 font-semibold rounded transition duration-300"
                  >
                    {slide.button}
                    <FiArrowRight size={20} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ) : null
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarBanner;
