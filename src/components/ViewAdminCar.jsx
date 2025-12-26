import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export const ViewAdminCar = ({ selectedVehicle, handleClick }) => {
  const [viewImage, setViewImage] = useState(null);
  const [indexImage, setIndexImage] = useState(0);

  console.log(indexImage);

  const ImageLength = selectedVehicle?.images?.length - 1;

  useEffect(() => {
    if (selectedVehicle?.images?.length > 0) {
      setViewImage(selectedVehicle.images[0]);
    }
  }, [selectedVehicle]);

  useEffect(() => {
    if (selectedVehicle?.images?.length > 0) {
      return setViewImage(selectedVehicle.images[indexImage]);
    }
  }, [indexImage]);

  const handleNextImage = () =>
    setIndexImage((prev) => (ImageLength > prev ? prev + 1 : 0));

  const handlePreviousImage = () =>
    setIndexImage((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-start justify-center pt-20 ">
      <div className="bg-white  md:w-[70%] lg:w-[60%]  w-full rounded-lg shadow-lg p-6 relative max-h-[80vh] overflow-auto border">
        {/* Close Icon */}
        <button
          onClick={handleClick}
          className="absolute top-4 right-4 text-gray-600 hover:text-rose-600"
        >
          <MdClose size={24} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Vehicle Details
        </h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Car Details */}
          <div className="space-y-2 text-sm text-gray-800 grid grid-cols-2 gap-5 w-[100%] ">
            <p>
              <span className="font-bold">Location:</span>{" "}
              {selectedVehicle?.cityName.charAt(0).toUpperCase() +
                selectedVehicle?.cityName.slice(1) || "--"}
            </p>
            <p>
              <span className="font-bold">Make:</span>{" "}
              {selectedVehicle?.make.charAt(0).toUpperCase() +
                selectedVehicle?.make.slice(1) || "--"}
            </p>
            <p>
              <span className="font-bold">Model:</span>{" "}
              {selectedVehicle?.model.charAt(0).toUpperCase() +
                selectedVehicle?.model.slice(1) || "--"}
            </p>

            <p>
              <span className="font-bold">Series:</span>{" "}
              {selectedVehicle?.series.charAt(0).toUpperCase() +
                selectedVehicle?.series.slice(1) || "--"}
            </p>
            <p>
              <span className="font-bold">Color:</span>{" "}
              {selectedVehicle?.color.charAt(0).toUpperCase() +
                selectedVehicle?.color.slice(1) || "--"}
            </p>

            <p>
              <span className="font-bold">Transmission:</span>{" "}
              {selectedVehicle?.transmission.charAt(0).toUpperCase() +
                selectedVehicle?.transmission.slice(1) || "--"}
            </p>
            <p>
              <span className="font-bold">Fuel Type:</span>
              {selectedVehicle?.fuelType.charAt(0).toUpperCase() +
                selectedVehicle?.fuelType.slice(1) || "--"}
            </p>

            <p>
              <span className="font-bold">Body Style:</span>{" "}
              {selectedVehicle?.bodyStyle.charAt(0).toUpperCase() +
                selectedVehicle?.bodyStyle.slice(1) || "--"}
            </p>

            <p>
              <span className="font-bold">Certification Status:</span>{" "}
              {selectedVehicle?.certifyStatus.charAt(0).toUpperCase() +
                selectedVehicle?.certifyStatus.slice(1) || "--"}
            </p>

            <p>
              <span className="font-bold">Drive Type:</span>{" "}
              {selectedVehicle?.driveType.charAt(0).toUpperCase() +
                selectedVehicle?.driveType.slice(1) || "--"}
            </p>

            <p>
              <span className="font-bold">Meter Reading:</span>{" "}
              {selectedVehicle?.mileage || "--"}
            </p>
            <p>
              <span className="font-bold">Year:</span> {selectedVehicle?.year}
            </p>
            <p>
              <span className="font-bold">Condition:</span>{" "}
              {selectedVehicle?.vehicleCondition.charAt(0).toUpperCase() +
                selectedVehicle?.vehicleCondition.slice(1) || "--"}
            </p>
            <p>
              <span className="font-bold">Reserve Price:</span>{" "}
              {selectedVehicle?.buyNowPrice || "--"}
            </p>
          </div>

          {/* Right: Car Image + Thumbnails */}
          <div className="">
            <img
              src={viewImage}
              alt="Vehicle"
              className="w-full h-[250px] object-cover rounded shadow"
            />
            <div className="flex items-center justify-center mt-6 gap-2">
              <button
                onClick={handlePreviousImage}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition-transform duration-200"
              >
                <FaArrowLeft size={20} />
              </button>
              {selectedVehicle?.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail-${idx}`}
                  onClick={() => setViewImage(img)}
                  className={`w-[50px] h-[50px] object-cover rounded cursor-pointer border ${
                    viewImage === img
                      ? "border-blue-600 border-4"
                      : "border-gray-300"
                  }`}
                />
              ))}
              <button
                onClick={handleNextImage}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:scale-110 transition-transform duration-200"
              >
                <FaArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
