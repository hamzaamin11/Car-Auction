import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SearchAbout = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <div className="w-full bg-[#e1edff] py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

          <div className="md:col-span-6" data-aos="fade-right">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">What is Saved Search?</h2>

            <p className="text-black mb-4 leading-relaxed">
            Search queries can be built using our Vehicle Finder, by applying different filters to a search such as make, model, write-off category and auction location, as well as many more filter options. This search query can then be saved for quick use, meaning that you don’t need to manually enter the search filters every time you want to run the same vehicle search.
            </p>

          </div>

        
          <div className="md:col-span-1 hidden md:block"></div>

         
          <div className="md:col-span-5" data-aos="fade-left">
            <div className="relative w-full h-64 md:h-80 shadow-md rounded-md overflow-hidden">
            <iframe
  src="https://www.youtube.com/embed/3rr9furESNQ"
  title="Test Video"
  className="absolute top-0 left-0 w-full h-full"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
></iframe>


            </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default SearchAbout;
