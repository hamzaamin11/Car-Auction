

import React from 'react';
import { Search, Save, ChevronDown, Filter, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function SearchPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      {/* Hero Section */}
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-98 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/alert.jpg')" }}
    >
      {/* Dark overlay – only this layer is semi-transparent */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content – full opacity, white text */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-2 text-center text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
        >
          How to Save Vehicle Searches on WheelBidz
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center text-base sm:text-lg md:text-xl max-w-3xl"
        >
          Easily Keep Track of Your WheelBidz Auto Auction Searches
        </motion.p>
      </div>
    </motion.div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* Section 1: How to Set Up Saved Search */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mb-16 lg:mb-20"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-800 mb-8"
          >
            How do I set up WheelBidz's Saved Search feature?
          </motion.h2>

          <motion.ul
            variants={stagger}
            className="space-y-4 text-gray-700 text-base sm:text-lg mb-10"
          >
            {[
              "Click on the buttons shown below and then name your search",
              'Name your search by typing a descriptive name in the "Save search result as" text box',
              'Click "Save Search" and your search will be saved',
              'To view your Saved Searches, log in, click the "Find a Vehicle" drop down and then select "Saved Searches."'
            ].map((item, i) => (
              <motion.li
                key={i}
                variants={fadeInUp}
                className="flex items-start"
              >
                <span className="text-blue-900 font-bold mr-2 mt-1">•</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 p-5 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <p className="text-gray-700 text-sm sm:text-base">
              If you have a popular search with vehicles that are not currently in stock, sign up for{' '}
              <strong>Vehicle Alerts</strong>. When the vehicle you want becomes available, you will receive an email
              from us with auction details.
            </p>
          </motion.div>
        </motion.section>

        {/* Section 2: Why Use Saved Searches */}
        <motion.section
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-800 mb-8"
          >
            Why should you use saved searches for WheelBidz vehicles?
          </motion.h2>

          <motion.ul
            variants={stagger}
            className="space-y-3 text-gray-700 text-base sm:text-lg mb-8"
          >
            {[
              "If you are looking for specific vehicle makes, models, and years",
              "You have a specific search that you run multiple times",
              "You are looking to save time finding the vehicle you want"
            ].map((item, i) => (
              <motion.li
                key={i}
                variants={fadeInUp}
                className="flex items-start"
              >
                <span className="text-green-600 font-bold mr-2 mt-1">•</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.p
            variants={fadeInUp}
            className="text-gray-700 mb-8 leading-relaxed text-sm sm:text-base"
          >
            Once you're logged in as a <strong>Basic</strong> or <strong>Premier Member</strong>, you can save up to{' '}
            <strong>20 searches</strong> at a time. Be sure to save your searches on WheelBidz Mobile as well. The only
            time you can't save your search is if you're not a Member.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
         <Link
            to="/register"
            className="inline-block bg-blue-950 hover:bg-blue-900 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 focus:outline-none "
          >
            Register to Start Saving Searches
          </Link>
           
          </motion.div>
        </motion.section>
      </div>
    </>
  );
}