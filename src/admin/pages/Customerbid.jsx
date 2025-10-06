import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../components/Contant/URL";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import LiveCommentsModal from "../../components/Comment";
import moment from "moment";

export const Customerbid = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const userId = currentUser?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const [indexImage, setIndexImage] = useState(0);
  const { id } = useParams();
  const vehicleId = id;

  const initialState = {
    vehicleId,
    userId,
    maxBid: "",
  };

  const [bidAmount, setBidAmount] = useState(initialState);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const currentDate = new Date().toISOString().slice(0, 10);
  const selectedDate = selectedPrice?.endTime?.slice(0, 10);
  const imageList = selectedPrice?.images || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBidAmount({ ...bidAmount, [name]: value });
  };

  useEffect(() => {
    if (imageList.length > 0) setViewImage(imageList[0]);
  }, [selectedPrice]);

  useEffect(() => {
    if (imageList.length > 0) setViewImage(imageList[indexImage]);
  }, [indexImage]);

  const handleNextImage = () =>
    setIndexImage((prev) => (prev < imageList.length - 1 ? prev + 1 : 0));

  const handlePreviousImage = () =>
    setIndexImage((prev) => (prev > 0 ? prev - 1 : imageList.length - 1));

  const handleGetPrice = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getVehiclesById/${vehicleId}`);
      setSelectedPrice(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitBid = async () => {
    if (!currentUser) {
      toast.error("Please log in first");
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/customer/startBidding`,
        bidAmount
      );
      console.log(res.data);
      toast.success("Your bid has been added successfully!");
      setBidAmount(initialState);
      setIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetPrice();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#233D7B] mb-2">
          {selectedPrice?.make} {selectedPrice?.model} {selectedPrice?.series}{" "}
          {selectedPrice?.year}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT: IMAGE SLIDER */}
        <div className="col-span-2 bg-white rounded-xl shadow-md p-4 relative">
          <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
            <img
              src={viewImage || "/images/AudiQ2.jpg"}
              alt="Vehicle"
              className="w-full h-full object-cover"
            />
            <button
              onClick={handlePreviousImage}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black transition"
            >
              <FaArrowLeft size={18} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black transition"
            >
              <FaArrowRight size={18} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-3 mt-4 overflow-x-auto pb-2">
            {imageList.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail-${idx}`}
                onClick={() => {
                  setViewImage(img);
                  setIndexImage(idx);
                }}
                className={`w-24 h-20 object-cover rounded-md cursor-pointer border-4 transition ${
                  viewImage === img
                    ? "border-[#233D7B]"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: VEHICLE + BID DETAILS */}
        <div className="col-span-1 space-y-6">
          {/* Vehicle Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-[#233D7B] mb-3 border-b pb-2">
              Vehicle Details
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                <strong>Year:</strong> {selectedPrice?.year}
              </li>
              <li>
                <strong>Make:</strong> {selectedPrice?.make}
              </li>
              <li>
                <strong>Model:</strong> {selectedPrice?.model}
              </li>
              <li>
                <strong>Body Style:</strong> {selectedPrice?.bodyStyle}
              </li>
              <li>
                <strong>Transmission:</strong> {selectedPrice?.transmission}
              </li>
              <li>
                <strong>Drive:</strong> {selectedPrice?.driveType}
              </li>
              <li>
                <strong>Fuel:</strong> {selectedPrice?.fuelType}
              </li>
              <li>
                <strong>Color:</strong> {selectedPrice?.color || "Gray"}
              </li>
            </ul>
          </div>

          {/* Bid Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#233D7B]">
            <h2 className="text-xl font-bold text-[#233D7B] mb-3 border-b pb-2">
              Bid Detail
            </h2>

            <p className="text-sm mb-2">
              <strong>Bid Date:</strong>{" "}
              {selectedPrice?.startTime
                ? selectedPrice.startTime.slice(0, 10)
                : "Coming Soon"}
            </p>
            <p className="text-sm mb-2">
              <strong>Start Time:</strong>{" "}
              {(selectedPrice?.startTime &&
                moment(selectedPrice?.startTime).local().format("hh:mm A")) ||
                "N/A"}
            </p>
            <p className="text-sm mb-4">
              <strong>End Time:</strong>{" "}
              {(selectedPrice?.endTime &&
                moment(selectedPrice?.endTime).local().format("hh:mm A")) ||
                "N/A"}
            </p>

            <p className="text-xl font-bold mb-4">
              Demand Price:{" "}
              <span className="text-green-700">
                PKR {selectedPrice?.buyNowPrice?.toLocaleString()}
              </span>
            </p>

            {selectedPrice?.auctionStatus !== "end" && currentUser && (
              <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-[#233D7B] hover:bg-[#1a2f63] text-white py-3 rounded-lg font-semibold transition-all"
              >
                Start Bidding
              </button>
            )}
          </div>
        </div>
      </div>

      {isOpen && <LiveCommentsModal isOpen={isOpen} setIsOpen={setIsOpen} />}
      <ToastContainer />
    </div>
  );
};
