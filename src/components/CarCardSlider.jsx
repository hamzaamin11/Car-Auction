import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";

// ---------------- CarCard -------------------
const CarCard = ({ car }) => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-full h-full flex flex-col">
      <div className="relative w-full">
        <img
          src={car.images[0]}
          alt="car"
          className="w-full h-48 object-cover rounded-t-xl hover:cursor-pointer"
          onClick={() => navigate(`/standardline/${car.id}`)}
        />
      </div>

      <div className="p-4 space-y-2 text-gray-800 flex-grow flex flex-col">
        <h3 className="text-md font-bold gap-1.5">
          {car?.make}-{car?.model}
        </h3>
        <p className="text-lg font-semibold text-gray-900">
          <span className="font-bold">Demand Price:</span> {car?.buyNowPrice}
        </p>
        <p className="text-sm">
          <span className="font-bold">Location:</span> {car.cityName}
        </p>
        <span
          onClick={() => navigate(`/standardline/${car.id}`)}
          className="block bg-[#ed3237] hover:bg-red-700 text-center text-sm font-semibold text-white py-2 rounded transition hover:cursor-pointer mt-auto"
        >
          View Details
        </span>
      </div>
    </div>
  );
};

// ---------------- AuctionCard -------------------
const AuctionCard = ({ auction, onView }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-full h-full flex flex-col">
      <div className="relative w-full">
        <img
          src={auction?.images?.[0]}
          alt={auction?.make}
          className="w-full h-48 object-cover rounded-t-xl hover:cursor-pointer"
          onClick={() => onView(auction)}
        />
      </div>

      <div className="p-4 space-y-2 text-gray-800 flex-grow flex flex-col">
        <h3 className="text-md font-bold gap-1.5">
          {auction?.make}-{auction?.model}
        </h3>
        <p className="text-lg font-semibold text-gray-900">
          <span className="font-bold">Seller Offer:</span> {auction?.sellerOffer}
        </p>
        <p className="text-sm">
          <span className="font-bold">Location:</span> {auction?.cityName}
        </p>
        <span
          onClick={() => onView(auction)}
          className="block bg-[#ed3237] hover:bg-red-700 text-center text-sm font-semibold text-white py-2 rounded transition hover:cursor-pointer mt-auto"
        >
          View Details
        </span>
      </div>
    </div>
  );
};

// ---------------- LiveAuctionCard -------------------
const LiveAuctionCard = ({ liveAuction, onView }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden w-full h-full flex flex-col">
      <div className="relative w-full">
        <img
          src={liveAuction?.images?.[0]}
          alt={liveAuction?.make}
          className="w-full h-48 object-cover rounded-t-xl hover:cursor-pointer"
          onClick={() => onView(liveAuction)}
        />
      </div>

      <div className="p-4 space-y-2 text-gray-800 flex-grow flex flex-col">
        <h3 className="text-md font-bold gap-1.5">
          {liveAuction?.make}-{liveAuction?.model}
        </h3>
        <p className="text-lg font-semibold text-gray-900">
          <span className="font-bold">Current Bid:</span> {liveAuction?.currentBid}
        </p>
        <p className="text-sm">
          <span className="font-bold">Location:</span> {liveAuction?.cityName}
        </p>
        <span
          onClick={() => onView(liveAuction)}
          className="block bg-[#ed3237] hover:bg-red-700 text-center text-sm font-semibold text-white py-2 rounded transition hover:cursor-pointer mt-auto"
        >
          View Details
        </span>
      </div>
    </div>
  );
};

// ---------------- CarCardSlider -------------------
const CarCardSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [auctionIndex, setAuctionIndex] = useState(0);
  const [liveAuctionIndex, setLiveAuctionIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const [allCars, setAllCars] = useState([]);
  const [allUpcoming, setAllUpcoming] = useState([]);
  const [allLiveAuctions, setAllLiveAuctions] = useState([]);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [selectedLiveAuction, setSelectedLiveAuction] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch normal cars
  const handleGetVehicles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/customer/getVehicles`);
      setAllCars(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch upcoming auctions
  const handleGetUpcoming = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/upcomingAuctionsForAdmin?entry=8&page=1`
      );
      setAllUpcoming(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Placeholder for fetching live auctions (API to be added later)
  const handleGetLiveAuctions = async () => {
    try {
      // Placeholder: Replace with actual API endpoint when provided
      // const res = await axios.get(`${BASE_URL}/liveAuctions?entry=8&page=1`);
      // setAllLiveAuctions(res.data);
      console.log("Live Auction API will be added later. Waiting for response.");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetVehicles();
    handleGetUpcoming();
    handleGetLiveAuctions();
  }, []);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 768) {
        setVisibleCards(2);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);

    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  // Auto-play for cars
  useEffect(() => {
    if (!isAutoPlaying || allCars.length <= visibleCards) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + visibleCards >= allCars.length) {
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, allCars.length, visibleCards]);

  // Auto-play for upcoming auctions
  useEffect(() => {
    if (!isAutoPlaying || allUpcoming.length <= visibleCards) return;

    const interval = setInterval(() => {
      setAuctionIndex((prev) => {
        if (prev + visibleCards >= allUpcoming.length) {
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, allUpcoming.length, visibleCards]);

  // Auto-play for live auctions
  useEffect(() => {
    if (!isAutoPlaying || allLiveAuctions.length <= visibleCards) return;

    const interval = setInterval(() => {
      setLiveAuctionIndex((prev) => {
        if (prev + visibleCards >= allLiveAuctions.length) {
          return 0;
        }
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, allLiveAuctions.length, visibleCards]);

  const getVisibleCars = () => {
    return allCars.slice(currentIndex, currentIndex + visibleCards);
  };

  const getVisibleAuctions = () => {
    return allUpcoming.slice(auctionIndex, auctionIndex + visibleCards);
  };

  const getVisibleLiveAuctions = () => {
    return allLiveAuctions.slice(liveAuctionIndex, liveAuctionIndex + visibleCards);
  };

  const nextCards = () => {
    setIsAutoPlaying(false);
    if (currentIndex + visibleCards < allCars.length) {
      setCurrentIndex((prev) => prev + 1);
    }
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevCards = () => {
    setIsAutoPlaying(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextAuctions = () => {
    setIsAutoPlaying(false);
    if (auctionIndex + visibleCards < allUpcoming.length) {
      setAuctionIndex((prev) => prev + 1);
    }
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevAuctions = () => {
    setIsAutoPlaying(false);
    if (auctionIndex > 0) {
      setAuctionIndex((prev) => prev - 1);
    }
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const nextLiveAuctions = () => {
    setIsAutoPlaying(false);
    if (liveAuctionIndex + visibleCards < allLiveAuctions.length) {
      setLiveAuctionIndex((prev) => prev + 1);
    }
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const prevLiveAuctions = () => {
    setIsAutoPlaying(false);
    if (liveAuctionIndex > 0) {
      setLiveAuctionIndex((prev) => prev - 1);
    }
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  return (
    <div className="py-12 px-4 md:px-20 bg-gray-100">
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>

      {/* Available Cars */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800 animate-fade-in">
        Available Cars
      </h2>
      <div className="relative flex items-center justify-center">
        {allCars.length > visibleCards && (
          <button
            onClick={prevCards}
            disabled={currentIndex === 0}
            className="absolute left-0 md:-left-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-gray-100 disabled:opacity-50 transition-transform hover:scale-110"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <ChevronLeft size={24} className="md:w-7 md:h-7" />
          </button>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
          {getVisibleCars().map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>

        {allCars.length > visibleCards && (
          <button
            onClick={nextCards}
            disabled={currentIndex + visibleCards >= allCars.length}
            className="absolute right-0 md:-right-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-gray-100 disabled:opacity-50 transition-transform hover:scale-110"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <ChevronRight size={24} className="md:w-7 md:h-7" />
          </button>
        )}
      </div>

      {/* Progress Dots for Cars */}
      {/* {allCars.length > visibleCards && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(allCars.length / visibleCards) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(idx * visibleCards);
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
              className={`h-2 rounded-full transition-all ${
                Math.floor(currentIndex / visibleCards) === idx
                  ? 'bg-[#ed3237] w-8'
                  : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>
      )} */}

      {/* Upcoming Auctions */}
      <div className="mt-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800 animate-fade-in">
          Upcoming Auctions
        </h2>

        {allUpcoming?.length > 0 ? (
          <>
            <div className="relative flex items-center justify-center">
              {allUpcoming.length > visibleCards && (
                <button
                  onClick={prevAuctions}
                  disabled={auctionIndex === 0}
                  className="absolute left-0 md:-left-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-gray-100 disabled:opacity-50 transition-transform hover:scale-110"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronLeft size={24} className="md:w-7 md:h-7" />
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
                {getVisibleAuctions().map((auction) => (
                  <AuctionCard
                    key={auction.id}
                    auction={auction}
                    onView={setSelectedAuction}
                  />
                ))}
              </div>

              {allUpcoming.length > visibleCards && (
                <button
                  onClick={nextAuctions}
                  disabled={auctionIndex + visibleCards >= allUpcoming.length}
                  className="absolute right-0 md:-right-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-gray-100 disabled:opacity-50 transition-transform hover:scale-110"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronRight size={24} className="md:w-7 md:h-7" />
                </button>
              )}
            </div>

            {/* Progress Dots for Auctions */}
            {/* {allUpcoming.length > visibleCards && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.ceil(allUpcoming.length / visibleCards) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setAuctionIndex(idx * visibleCards);
                      setTimeout(() => setIsAutoPlaying(true), 5000);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      Math.floor(auctionIndex / visibleCards) === idx
                        ? 'bg-[#ed3237] w-8'
                        : 'bg-gray-300 w-2'
                    }`}
                  />
                ))}
              </div>
            )} */}
          </>
        ) : (
          <p className="text-center text-gray-600">No upcoming auctions yet!</p>
        )}
      </div>

      {/* Live Auctions */}
      <div className="mt-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800 animate-fade-in">
          Live Auctions
        </h2>

        {allLiveAuctions?.length > 0 ? (
          <>
            <div className="relative flex items-center justify-center">
              {allLiveAuctions.length > visibleCards && (
                <button
                  onClick={prevLiveAuctions}
                  disabled={liveAuctionIndex === 0}
                  className="absolute left-0 md:-left-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-gray-100 disabled:opacity-50 transition-transform hover:scale-110"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronLeft size={24} className="md:w-7 md:h-7" />
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
                {getVisibleLiveAuctions().map((liveAuction) => (
                  <LiveAuctionCard
                    key={liveAuction.id}
                    liveAuction={liveAuction}
                    onView={setSelectedLiveAuction}
                  />
                ))}
              </div>

              {allLiveAuctions.length > visibleCards && (
                <button
                  onClick={nextLiveAuctions}
                  disabled={liveAuctionIndex + visibleCards >= allLiveAuctions.length}
                  className="absolute right-0 md:-right-10 bg-white p-2 rounded-full shadow text-gray-700 z-10 hover:bg-gray-100 disabled:opacity-50 transition-transform hover:scale-110"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  <ChevronRight size={24} className="md:w-7 md:h-7" />
                </button>
              )}
            </div>

            {/* Progress Dots for Live Auctions */}
            {/* {allLiveAuctions.length > visibleCards && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.ceil(allLiveAuctions.length / visibleCards) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsAutoPlaying(false);
                      setLiveAuctionIndex(idx * visibleCards);
                      setTimeout(() => setIsAutoPlaying(true), 5000);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      Math.floor(liveAuctionIndex / visibleCards) === idx
                        ? 'bg-[#ed3237] w-8'
                        : 'bg-gray-300 w-2'
                    }`}
                  />
                ))}
              </div>
            )} */}
          </>
        ) : (
          <p className="text-center text-gray-600">No live auctions yet! API response will populate this section later.</p>
        )}
      </div>

      {/* Modal for Auction Details */}
      {selectedAuction && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative animate-slide-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAuction(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={selectedAuction?.images?.[0]}
              alt={selectedAuction?.make}
              className="w-full h-56 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold mb-2">
              {selectedAuction?.make} {selectedAuction?.model}
            </h2>
            <p><b>Condition:</b> {selectedAuction?.vehicleCondition}</p>
            <p><b>Seller Offer:</b> {selectedAuction?.sellerOffer}</p>
            <p><b>Start Time:</b> {selectedAuction?.startTime}</p>
            <p><b>End Time:</b> {selectedAuction?.endTime}</p>
            <p><b>Location:</b> {selectedAuction?.cityName}</p>
          </div>
        </div>
      )}

      {/* Modal for Live Auction Details */}
      {selectedLiveAuction && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl relative animate-slide-up max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedLiveAuction(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={selectedLiveAuction?.images?.[0]}
              alt={selectedLiveAuction?.make}
              className="w-full h-56 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold mb-2">
              {selectedLiveAuction?.make} {selectedLiveAuction?.model}
            </h2>
            <p><b>Condition:</b> {selectedLiveAuction?.vehicleCondition}</p>
            <p><b>Current Bid:</b> {selectedLiveAuction?.currentBid}</p>
            <p><b>End Time:</b> {selectedLiveAuction?.endTime}</p>
            <p><b>Location:</b> {selectedLiveAuction?.cityName}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarCardSlider;