import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CopartHistorySection = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <div className="w-full bg-[#e7f1fd] py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
       
          <div className="md:col-span-5" data-aos="fade-right">
            <Link to="/about">
              <img
                src="https://cdn.i-scmp.com/sites/default/files/styles/1020x680/public/d8/images/canvas/2024/08/14/c4730c67-66ec-4b99-a4b8-79759b5f907b_48cecb97.jpg?itok=GpmlloCd&v=1723623981"
                alt="Copart History"
                className="w-full h-auto shadow-md"
              />
            </Link>
          </div>

       
          <div className="md:col-span-1 hidden md:block"></div>

       
          <div className="md:col-span-6 text-left" data-aos="fade-left">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              The Making of CHAUDHRY Cars Auction
            </h2>
            <p className="text-black mb-4 leading-relaxed">
              CHAUDHRY Cars Auction was founded in 1982 when Willis J. Johnson launched a single New yard in Vallejo, California. Fast forward 37 years, Copart Inc is now a global leader in online vehicle auctions and a primary source for vehicle remarketing.
            </p>
            <p className="text-black mb-6 leading-relaxed">
              <strong>2007 was a landmark year for CHAUDHRY Cars Auction</strong> After celebrating 25 years in business, they expanded into the United Kingdom to form CHAUDHRY Cars Auction Limited. Since its launch, CHAUDHRY Cars Auction has gone on to sell 1000’s of New and non-New vehicles each day to Buyers in 120 countries.
            </p>
            <Link to="/about">
              <button className="bg-[#ffbf00] text-white px-6 py-2 rounded hover:opacity-90 transition-all cursor-pointer duration-300">
                Discover Our History
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopartHistorySection;
