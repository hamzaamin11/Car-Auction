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
    vehicleId: vehicleId,
    userId: userId,
    maxBid: "",
  };

  const [bidAmount, setBidAmount] = useState(initialState);

  const [selectedPrice, setSelectedPrice] = useState(null);

  console.log("selected =>", selectedPrice);

  const currentDate = new Date().toISOString().slice(0, 10);

  const selectedDate = selectedPrice?.endTime?.slice(0, 10);

  console.log("currentDate =>", currentDate);

  console.log("selectedDate =>", selectedDate);

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

  // const handleGetallBid = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${BASE_URL}/admin/bidsPlacedById/${vehicleId}`
  //     );
  //     setAllCustomerBid(res.data); // update state
  //   } catch (error) {
  //     console.log("Error fetching bids:", error);
  //   }
  // };

  // const [bidSubmitted, setBidSubmitted] = useState(false);

  // useEffect(() => {
  //   handleGetallBid();
  // }, [bidSubmitted, vehicleId]);

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
      toast.success("your bid has been added successfully");
      setBidAmount(initialState);

      setIsOpen(true);

      // 🔥 Ab state ko true karenge taake socket wala useEffect run ho
      // setBidSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetPrice();
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Car Name Heading */}
      <h1 className="text-3xl font-bold text-start mb-10 text-[#233D7B] ">
        {selectedPrice?.make} {selectedPrice?.model} {selectedPrice?.series}{" "}
        {selectedPrice?.year}
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: IMAGE SLIDER */}
        <div className="col-span-1  bg-white rounded-xl shadow-md ">
          <div className="relative w-full h-96 rounded-md overflow-hidden p-2">
            <img
              src={viewImage || "/images/AudiQ2.jpg"}
              alt="Vehicle"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails & Arrows */}
          <div className="flex items-center justify-center gap-3 mt-4 p-2">
            <button
              onClick={handlePreviousImage}
              className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow hover:scale-110 transition"
            >
              <FaArrowLeft size={16} />
            </button>
            <div className="flex gap-2 overflow-x-auto">
              {imageList.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail-${idx}`}
                  onClick={() => {
                    setViewImage(img);
                    setIndexImage(idx);
                  }}
                  className={`w-[60px] h-[60px] object-cover rounded-md border cursor-pointer ${
                    viewImage === img
                      ? "border-blue-600 border-4"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNextImage}
              className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow hover:scale-110 transition"
            >
              <FaArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* MIDDLE: VEHICLE DETAILS */}
        <div className="col-span-1 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
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
              <strong>Series:</strong> {selectedPrice?.series}
            </li>

            <li>
              <strong>Vehicle Condition:</strong>{" "}
              {selectedPrice?.vehicleCondition}
            </li>
            <li>
              <strong>Body Style:</strong> {selectedPrice?.bodyStyle}
            </li>
            <li>
              <strong>Color:</strong> {selectedPrice?.color || "Gray"}
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
          </ul>
        </div>

        {/* RIGHT: BID SECTION */}
        <div className="col-span-1 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
            Place Your Bid
          </h2>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Bid Status:</strong> Minimum Bid
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Bid Live Date:</strong>
            {selectedPrice?.startTime ? (
              currentDate !== selectedDate ? (
                <span className=" font-bold text-red-500">Bid End Date</span>
              ) : (
                selectedPrice.startTime.slice(0, 10)
              )
            ) : (
              "Update Soon"
            )}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Bid Bid Start Time:</strong>{" "}
            {(selectedPrice?.startTime &&
              moment(selectedPrice?.startTime).local().format("HH:mm:ss")) ||
              "Coming Soon"}
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Bid Bid End Time:</strong>{" "}
            {(selectedPrice?.endTime &&
              moment(selectedPrice?.endTime).local().format("HH:mm:ss")) ||
              "Coming Soon"}
          </p>
          <p className="text-sm text-gray-700 mb-4">
            <strong>Demand Price:</strong>{" "}
            <span className="text-green-700 text-2xl font-bold">
              PKR {selectedPrice?.buyNowPrice}
            </span>
          </p>
          {selectedPrice?.auctionStatus !== "end" && currentUser && (
            <div>
              <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-semibold transition hover:cursor-pointer"
              >
                Start Bid{" "}
              </button>
            </div>
          )}
        </div>

        {isOpen && <LiveCommentsModal isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
      <ToastContainer />
    </div>
  );
};
