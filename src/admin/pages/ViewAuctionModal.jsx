import React from "react";
import AuctionsContext from "../../context/AuctionsContext";
import { useContext, useEffect } from "react";

const ViewAuctionModal = ({ auctionId, onClose }) => {
  const { auctionById, AuctionById } = useContext(AuctionsContext);

  useEffect(() => {
  console.log("Fetching auction ID:", auctionId);
  if (auctionId) {
    AuctionById(auctionId).then(() => {
      console.log("Fetched auction data:", auctionById); 
    });
  }
}, [auctionId]);
  console.log("fetched by id:", auctionId)

  if (!auctionById || !auctionId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0  bg-opacity-50 transition-opacity"></div>

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          {/* Header */}
          <div className="bg-[#191970] px-4 py-3 sm:px-6 sm:flex sm:items-center sm:justify-between">
            <h3 className="text-xl font-semibold leading-6 text-white">
              {auctionById.make} {auctionById.model} - Auction Details
            </h3>
            <button
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 sm:mt-0 sm:w-auto"
            >
              Close
            </button>
          </div>

          {/* Body */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Vehicle Image Section */}
              <div className="md:col-span-1">
                <div className="h-48 w-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  {auctionById.image ? (
                    <img
                      src={`http://localhost:3001/${auctionById.image}`}
                      alt={`${auctionById.make} ${auctionById.model}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">No Image Available</span>
                  )}
                </div>
                
                {/* Quick Facts */}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium">{auctionById.year}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-gray-600">Color:</span>
                    <span className="font-medium">{auctionById.color}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-gray-600">Mileage:</span>
                    <span className="font-medium">{auctionById.mileage} km</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-gray-600">VIN:</span>
                    <span className="font-medium">{auctionById.vin}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="md:col-span-1">
                <h4 className="text-lg font-semibold text-[#191970] mb-3">Vehicle Specifications</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-500">Make</label>
                    <p className="text-sm font-medium">{auctionById.make}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Model</label>
                    <p className="text-sm font-medium">{auctionById.model}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Series</label>
                    <p className="text-sm font-medium">{auctionById.series}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Body Style</label>
                    <p className="text-sm font-medium">{auctionById.bodyStyle}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Transmission</label>
                    <p className="text-sm font-medium">{auctionById.transmission}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500">Fuel Type</label>
                    <p className="text-sm font-medium">{auctionById.fuelType}</p>
                  </div>
                </div>
              </div>

              {/* Auction Details */}
              <div className="md:col-span-1">
                <h4 className="text-lg font-semibold text-[#191970] mb-3">Auction Information</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium mb-2">Bidding</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current Bid:</span>
                        <span className="text-sm font-bold">PKR {auctionById.currentBid}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Seller Offer:</span>
                        <span className="text-sm font-bold">PKR {auctionById.sellerOffer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Buy Now:</span>
                        <span className="text-sm font-bold text-green-600">PKR {auctionById.buyNowPrice}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium mb-2">Timing</h5>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-500">Start Time</label>
                        <p className="text-sm">
                          {new Date(auctionById.startTime).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">End Time</label>
                        <p className="text-sm font-medium text-red-600">
                          {new Date(auctionById.endTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium mb-2">Seller Contact</h5>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{auctionById.name}</p>
                      <p className="text-xs text-gray-600">{auctionById.email}</p>
                      <p className="text-xs text-gray-600">{auctionById.contact}</p>
                      <p className="text-xs text-gray-600 mt-2">{auctionById.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-[#191970] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#000080] sm:ml-3 sm:w-auto"
            >
              Place Bid
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAuctionModal;