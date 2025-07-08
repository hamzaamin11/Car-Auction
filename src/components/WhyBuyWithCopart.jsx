import React, { useEffect } from 'react';
import { FaVideo, FaCar, FaFileAlt, FaSearch, FaTag } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Link } from 'react-router-dom';

const WhyBuyWithCopart = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="why-copart">
    
    <div className="video-section mb-12">
  <a
    data-target="#howitworks_video1"
    data-thevideo="https://www.youtube.com/embed/hDO10o-Md-4" 
    data-toggle="modal"
    href="https://www.youtube.com/embed/hDO10o-Md-4"
  >
    <img
      alt="How it Works Video"
      className="glow-button"
      src="https://www.copart.co.Pakistan/content/why-buy-at-copart.png"
      style={{ width: '100%', height: 'auto' }}
    />
  </a>

  <div
    aria-hidden="true"
    aria-labelledby="howitworks_video1"
    className="modal fade"
    id="howitworks_video1"
    role="dialog"
    style={{ display: 'none' }}
    tabIndex="-1"
  >
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-body">
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              className="embed-responsive-item"
              frameBorder="0"
              src="https://www.youtube.com/embed/hDO10o-Md-4"  
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


    
      <div className="content-section px-4 py-16 bg-white">
        <div className="heading-mobile-center mb-12 text-center">
          <h1 className="text-3xl font-semibold">Why Buy with Copart?</h1>
          <hr className="w-16 mx-auto border-t-2 border-[#c90107]" />
        </div>

        <div className="benefits-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            className="card text-center p-6 border border-gray-200 rounded-lg shadow-md"
            data-aos="fade-up"
          >
            <FaFileAlt className="text-4xl mb-4 mx-auto text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Download a Free Vehicle Report</h3>
            <p>
              Copart offers FREE{' '}
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ffbf00] hover:text-yellow-600"
              >
                Vehicle Reports
              </Link>{' '}
              in exclusive partnership with Automotive Software Solutions.
            </p>
          </div>

          <div
            className="card text-center p-6 border border-gray-200 rounded-lg shadow-md"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <FaSearch className="text-4xl mb-4 mx-auto text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">View Before You Bid</h3>
            <p>
              Want to see a vehicle in more detail? Arrange a{' '}
              <Link
                to="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ffbf00] hover:text-yellow-600"
              >
                Virtual Vehicle Viewing
              </Link>{' '}
              to inspect a vehicle before you bid.
            </p>
          </div>

          <div
            className="card text-center p-6 border border-gray-200 rounded-lg shadow-md"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <FaCar className="text-4xl mb-4 mx-auto text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Expansive Inventory</h3>
            <p>
              With nearly 14,000 vehicles on sale every day, you’re bound to find something that fits.
            </p>
          </div>

          <div
            className="card text-center p-6 border border-gray-200 rounded-lg shadow-md"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <FaTag className="text-4xl mb-4 mx-auto text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Great Deals</h3>
            <p>
              Find something you love at a great price, from luxury brands to classics and more.
            </p>
          </div>

          <div
            className="card text-center p-6 border border-gray-200 rounded-lg shadow-md"
            data-aos="fade-up"
            data-aos-delay="800"
          >
            <FaVideo className="text-4xl mb-4 mx-auto text-blue-600" />
            <h3 className="text-xl font-semibold mb-2">Daily Auctions</h3>
            <p>
              Join Daily Auctions Monday-Friday from 09:00 AM to 12:30 PM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBuyWithCopart;
