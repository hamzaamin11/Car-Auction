import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export const ViewAdminCar = ({
  selectedVehicle,
  handleClick,
  isViewModalOpen,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (selectedVehicle?.images?.length > 0) {
      setCurrentImageIndex(0);
    }
  }, [selectedVehicle]);

  const handleNextImage = () => {
    const images = selectedVehicle?.images || [];
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handlePrevImage = () => {
    const images = selectedVehicle?.images || [];
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  if (!isViewModalOpen || !selectedVehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border">
        <div className="flex items-center justify-between bg-blue-950 p-4">
          <h2 className="text-2xl font-bold text-white">Vehicle Details</h2>
          <button onClick={handleClick} className="">
            <X className="h-6 w-6 text-white hover:cursor-pointer" />
          </button>
        </div>
        <div className="p-6 ">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Vehicle Details */}
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-700">Lot Number:</p>
                  <p className="text-base text-gray-900 border-b pb-1">
                    {selectedVehicle.lot_number || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">Location:</p>
                  <p className="text-base text-gray-900 border-b pb-1">
                    {selectedVehicle.cityName || "—"}
                  </p>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-4 ">
                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-700">Make:</p>
                    <p className="text-base text-gray-900 border-b pb-1">
                      {selectedVehicle.make || "—"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-700">Model:</p>
                    <p className="text-base text-gray-900 border-b pb-1">
                      {selectedVehicle.model || "—"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-700">Series:</p>
                    <p className="text-base text-gray-900 border-b pb-1">
                      {selectedVehicle.series || "—"}
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-bold text-gray-700">Color:</p>
                    <p className="text-base text-gray-900 border-b pb-1">
                      {selectedVehicle.color || "—"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-700">
                    Transmission:
                  </p>
                  <p className="text-base text-gray-900 border-b pb-1">
                    {selectedVehicle.transmission || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">Fuel Type:</p>
                  <p className="text-base text-gray-900 border-b pb-1">
                    {selectedVehicle.fuelType || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-700">Body Style:</p>
                  <p className="text-base text-gray-900 border-b pb-1">
                    {selectedVehicle.bodyStyle || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">
                    Certify Status:
                  </p>
                  <p className="text-base text-gray-900 border-b pb-1">
                    {selectedVehicle.certifyStatus || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-700">Drive Type:</p>
                  <p className="text-base text-gray-900 border-b pb-1 uppercase">
                    {selectedVehicle.driveType || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">Mileage:</p>
                  <p className="text-base text-gray-900 border-b pb-1">
                    {selectedVehicle.mileage || "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-bold text-gray-700">Year:</p>
                  <p className="text-base text-gray-900 border-b pb-1">
                    {selectedVehicle.year || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">Condition:</p>
                  <p className="text-base text-gray-900 border-b pb-1">
                    {selectedVehicle.vehicleCondition || "—"}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-bold text-gray-700">Price:</p>
                <p className="text-base text-gray-900 border-b pb-1">
                  {selectedVehicle.buyNowPrice
                    ? `PKR ${selectedVehicle.buyNowPrice}`
                    : "—"}
                </p>
              </div>

              <div className="">
                <p className="text-sm font-bold text-gray-700 mb-2">
                  Description:
                </p>
                <p className="text-base text-gray-700">
                  {selectedVehicle.description ||
                    "100% maintained by dealership"}
                </p>
              </div>
            </div>

            {/* Right Column - Image Gallery */}
            <div className="flex flex-col items-center">
              {selectedVehicle.images && selectedVehicle.images.length > 0 ? (
                <>
                  <div className="w-full h-72 rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={selectedVehicle.images[currentImageIndex]}
                      alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4 w-full">
                    <button
                      onClick={handlePrevImage}
                      className="bg-gray-800 hover:bg-gray-900 text-white rounded-full p-3 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={selectedVehicle.images.length <= 1}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={selectedVehicle.images[currentImageIndex]}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <button
                      onClick={handleNextImage}
                      className="bg-gray-800 hover:bg-gray-900 text-white rounded-full p-3 shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={selectedVehicle.images.length.length <= 1}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    {currentImageIndex + 1} / {selectedVehicle.images.length}
                  </p>
                </>
              ) : (
                <div className="w-full h-72 rounded-lg bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-400">No images available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
