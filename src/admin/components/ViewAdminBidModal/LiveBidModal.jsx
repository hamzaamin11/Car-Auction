export const LiveBidModal = ({ vehicle, onClose, handleGetVehicleBid }) => {
  console.log("=>", vehicle);
  const formatPrice = (price) => {
    if (!price) return "0";

    if (price >= 10000000) return (price / 10000000).toFixed(1) + " crore";
    if (price >= 100000) return (price / 100000).toFixed(1) + " lac";

    return price.toLocaleString("en-US");
  };

  // ✅ FILTER ADMIN BIDS ONCE
  const userBids =
    vehicle?.bid?.filter(
      (bid) => bid?.bidderRole !== "admin" && bid?.bidderRole !== "seller"
    ) || [];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 min-h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="text-lg font-semibold">View Bidding</h2>
            <p className="text-sm text-gray-500">{vehicle?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-between px-7 border-b bg-gray-50 text-center">
          <div className="py-3">
            <p className="text-xl font-bold">{userBids.length}</p>
            <p className="text-xs text-gray-500">Total Bids</p>
          </div>
          <div className="py-3">
            <p className="text-xl font-bold text-green-600">
              PKR {formatPrice(vehicle?.highestBid)}
            </p>
            <p className="text-xs text-gray-500">Highest Bid</p>
          </div>
        </div>

        {/* Bid Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {userBids.length > 0 ? (
            userBids.map((bid, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-md p-3 bg-blue-50 border border-blue-300"
              >
                {/* Avatar */}
                <div className="h-9 w-9 rounded-full bg-gray-800 text-white flex items-center justify-center font-semibold">
                  {bid?.bidderName?.[0]?.toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{bid?.bidderName}</p>
                    <span className="text-xs text-gray-400">
                      {bid?.time || "just now"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm">
                    Bid:
                    <span className="ml-1 font-semibold text-gray-700">
                      PKR {formatPrice(bid?.yourOffer)}
                    </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 mt-20">
              Waiting for bids...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-between items-center">
          <span className="text-xs text-gray-500">Live updates active</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};
