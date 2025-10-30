import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { BASE_URL } from "../../components/Contant/URL";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import LiveCommentsModal from "../../components/Comment";
import moment from "moment";
import { io } from "socket.io-client";
import { current } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { IoMdArrowBack } from "react-icons/io";

export const Customerbid = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const userId = currentUser?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const [indexImage, setIndexImage] = useState(0);
  const { id } = useParams();
  const vehicleId = id;

  const [selectedPrice, setSelectedPrice] = useState(null);

  const currentTime = new Date();
  const startTime = selectedPrice?.startTime
    ? new Date(selectedPrice.startTime)
    : null;

  // Check if auction has started
  const hasStarted = startTime && currentTime >= startTime;

  // Socket and bid states
  const [allCustomerBid, setAllCustomerBid] = useState([]);
  const [socket, setSocket] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  console.log("=>", remainingTime);
  const [phase, setPhase] = useState("loading");
  const [key, setKey] = useState(0);

  const imageList = selectedPrice?.images || [];

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

  const handleGetallBid = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/bidsPlacedById/${vehicleId}`
      );
      console.log("📋 Fetched bids:", res.data);
      setAllCustomerBid(res.data);
    } catch (error) {
      console.error("❌ Error fetching bids:", error);
    }
  };

  const handleSubmitBid = async (bidAmount) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/customer/startBidding`,
        bidAmount
      );
      console.log("✅ Bid submitted:", response.data);

      // Refresh bids immediately after submission
      setTimeout(() => {
        handleGetallBid();
      }, 500);
    } catch (error) {
      console.error("❌ Bid submission failed:", error);
      throw error;
    }
  };

  // SOCKET CONNECTION - STAYS ACTIVE EVEN WHEN MODAL IS CLOSED
  useEffect(() => {
    console.log("🔌 Initializing socket connection for vehicle:", vehicleId);

    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      console.log("📡 Joining room for vehicle:", vehicleId);
      newSocket.emit("joinVehicleRoom", { vehicleId });
    });

    // Listen for bidUpdate event
    newSocket.on("bidUpdate", (data) => {
      console.log("📥 Received bidUpdate event:", data);

      // Check if the vehicleId matches (handle both string and number)
      if (data.vehicleId == vehicleId) {
        console.log("✅ VehicleId matches, processing bid");
        setAllCustomerBid((prev) => {
          // Avoid duplicates by checking if bid already exists
          const bidExists = prev.some(
            (bid) =>
              bid.id === data.latestBid.id ||
              (bid.createdAt === data.latestBid.createdAt &&
                bid.maxBid === data.latestBid.maxBid &&
                bid.userId === data.latestBid.userId)
          );

          if (bidExists) {
            console.log("⚠️ Bid already exists, skipping");
            return prev;
          }

          console.log("✅ Adding new bid to list:", data.latestBid);
          return [...prev, data.latestBid];
        });
      } else {
        console.log("⚠️ VehicleId mismatch:", data.vehicleId, "vs", vehicleId);
      }
    });

    // Listen for ANY event (for debugging)
    newSocket.onAny((eventName, ...args) => {
      console.log("🎯 Received socket event:", eventName, args);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("🔥 Socket connection error:", error);
    });

    newSocket.on("error", (error) => {
      console.error("🔥 Socket error:", error);
    });

    setSocket(newSocket);
    handleGetallBid();

    return () => {
      console.log("🧹 Cleaning up socket connection");
      newSocket.emit("leaveVehicleRoom", { vehicleId });
      newSocket.off("bidUpdate");
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("error");
      newSocket.off("connect_error");
      newSocket.offAny();
      newSocket.disconnect();
    };
  }, [vehicleId]);

  // POLLING FALLBACK - Check for new bids every 3 seconds
  useEffect(() => {
    console.log("⏰ Starting polling mechanism");
    const pollingInterval = setInterval(() => {
      console.log("🔄 Polling for new bids...");
      handleGetallBid();
    }, 3000); // Poll every 3 seconds

    return () => {
      console.log("⏰ Stopping polling mechanism");
      clearInterval(pollingInterval);
    };
  }, [vehicleId]);

  // TIMER LOGIC
  useEffect(() => {
    if (!allCustomerBid[0]?.startTime || !allCustomerBid[0]?.endTime) {
      console.log("⏰ Missing startTime or endTime:", allCustomerBid[0]);
      return;
    }

    const start = moment(allCustomerBid[0].startTime).unix();
    const end = moment(allCustomerBid[0].endTime).unix();
    const now = moment().unix();

    if (now < start) {
      setPhase("before");
      setRemainingTime(start - now);
      console.log("⏳ Auction starts in:", start - now, "seconds");
    } else if (now >= start && now <= end) {
      setPhase("running");
      setRemainingTime(end - now);
      console.log("🏃 Auction running, ends in:", end - now, "seconds");
    } else {
      setPhase("ended");
      setRemainingTime(0);
      console.log("🏁 Auction ended");
    }

    setKey((prev) => prev + 1);
  }, [allCustomerBid]);

  useEffect(() => {
    handleGetPrice();
  }, []);

  return (
    <div className="max-w-screen-2xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Header */}

      <div className="mb-8 flex">
        <Link
          to={-1}
          className="flex items-center text-[#233D7B] font-medium hover:underline mx-4"
        >
          <IoMdArrowBack className="mr-2 text-xl" />
          Back
        </Link>

        <h1 className="lg:text-3xl text-xl font-bold text-[#233D7B]">
          {selectedPrice?.make} {selectedPrice?.model} {selectedPrice?.series}{" "}
          {selectedPrice?.year}
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT: IMAGE SLIDER */}
        <div className="bg-white rounded-xl shadow-md p-4 relative">
          {/* Image container */}
          <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden">
            <img
              src={viewImage || "/images/AudiQ2.jpg"}
              alt="Vehicle"
              className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
            />

            {/* Left Arrow */}
            <button
              onClick={handlePreviousImage}
              className="absolute top-1/2 left-3 sm:left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black transition"
            >
              <FaArrowLeft size={16} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-3 sm:right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black transition"
            >
              <FaArrowRight size={16} />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-2 sm:gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400">
            {imageList.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail-${idx}`}
                onClick={() => {
                  setViewImage(img);
                  setIndexImage(idx);
                }}
                className={`w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-md cursor-pointer border-4 transition ${
                  viewImage === img
                    ? "border-[#233D7B]"
                    : "border-gray-300 hover:border-gray-500"
                }`}
              />
            ))}
          </div>
        </div>
        <div className=" space-y-6 hidden lg:block">
          {/* Vehicle Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6 h-full">
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
                <strong>City:</strong> {selectedPrice?.locationId}
              </li>
              <li>
                <strong>Body Style:</strong> {selectedPrice?.bodyStyle}
              </li>
              <li>
                <strong>Certification Status:</strong>{" "}
                {selectedPrice?.certifyStatus}
              </li>
              <li>
                <strong>Transmission:</strong> {selectedPrice?.transmission}
              </li>
              <li>
                <strong>Meter Reading:</strong> {selectedPrice?.mileage}
              </li>
              <li>
                <strong>Drive:</strong> {selectedPrice?.driveType}
              </li>
              <li>
                <strong>Fuel:</strong> {selectedPrice?.fuelType}
              </li>
              <li>
                <strong>Color:</strong> {selectedPrice?.color}
              </li>
              <li>
                <strong>Condition:</strong> {selectedPrice?.vehicleCondition}
              </li>
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6   hidden lg:block">
          <h2 className="text-xl font-bold text-[#233D7B] mb-3 border-b pb-2">
            Bid Details
          </h2>
          <p className="text-sm mb-2">
            <strong className="mr-1">Bid Status:</strong>
            <span className="text-gray-700">
              {selectedPrice?.bidStatus || "N/A"}
            </span>
          </p>

          <p className="text-sm mb-2">
            <strong className="mr-1">Eligility Status:</strong>
            <span className="text-gray-700">
              {" "}
              {selectedPrice?.eligibilityStatus || "N/A"}
            </span>
          </p>
          <p className="text-sm mb-2">
            <strong>Sale Status:</strong>
            <span className="text-gray-700">
              {" "}
              {selectedPrice?.saleStatus || "N/A"}
            </span>
          </p>
          <p className="text-sm mb-2">
            <strong>Time Left:</strong>{" "}
          </p>
          <p className="text-sm mb-2">
            <strong>Current Bid:</strong>{" "}
          </p>
          <p className="text-sm mb-2">
            <strong>Your Bid:</strong>{" "}
          </p>
          <p className="text-sm mb-2">
            <strong>Your Bid:</strong>{" "}
          </p>
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
              disabled={!hasStarted} // 🔹 disable jab tak auction start nahi hua
              onClick={() => {
                if (!currentUser.cnic) {
                  Swal.fire({
                    icon: "warning",
                    title: "CNIC Required",
                    text: "Please add your CNIC first before bidding.",
                    confirmButtonColor: "#233D7B",
                  });
                } else {
                  setIsOpen(true);
                }
              }}
              className={`w-full py-3 rounded-lg font-semibold transition-all text-white ${
                hasStarted
                  ? "bg-[#233D7B] hover:bg-[#1a2f63]"
                  : "bg-red-900 cursor-not-allowed"
              }`}
            >
              {selectedPrice?.startTime ? (
                hasStarted ? (
                  "Join Auction"
                ) : (
                  <div className="text-center">
                    {(() => {
                      const hours = Math.floor(remainingTime / 3600);
                      const minutes = Math.floor((remainingTime % 3600) / 60);
                      const seconds = remainingTime % 60;
                      const formatted = `${hours
                        .toString()
                        .padStart(2, "0")}:${minutes
                        .toString()
                        .padStart(2, "0")}:${seconds
                        .toString()
                        .padStart(2, "0")}`;
                      return (
                        <>
                          <div className="text-xl font-bold">{formatted}</div>
                          <div className="text-xs text-blue-100 mt-1">
                            {phase === "before"
                              ? "Starts In"
                              : phase === "running"
                              ? "Time Left"
                              : "Ended"}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )
              ) : (
                "Join Auction"
              )}
            </button>
          )}
          {!currentUser && (
            <button
              onClick={() => {
                Swal.fire({
                  icon: "warning",
                  title: "Login Required",
                  text: "Please login first, then join the auction.",
                  confirmButtonColor: "#233D7B",
                });
              }}
              className="w-full py-3 rounded-lg font-semibold transition-all text-white bg-[#233D7B] hover:bg-[#1a2f63] hover:cursor-pointer"
            >
              Join Auction
            </button>
          )}
        </div>

        {/* RIGHT: VEHICLE + BID DETAILS */}
      </div>
      <div className="col-span-1 space-y-6 lg:hidden block">
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
              <strong>City:</strong> {selectedPrice?.locationId}
            </li>
            <li>
              <strong>Body Style:</strong> {selectedPrice?.bodyStyle}
            </li>
            <li>
              <strong>Transmission:</strong> {selectedPrice?.transmission}
            </li>
            <li>
              <strong>Certification Status:</strong>{" "}
              {selectedPrice?.certifyStatus}
            </li>
            <li>
              <strong>Meter Reading:</strong> {selectedPrice?.mileage}
            </li>
            <li>
              <strong>Drive:</strong> {selectedPrice?.driveType}
            </li>
            <li>
              <strong>Fuel:</strong> {selectedPrice?.fuelType}
            </li>
            <li>
              <strong>Color:</strong> {selectedPrice?.color}
            </li>
            <li>
              <strong>Condition:</strong> {selectedPrice?.vehicleCondition}
            </li>
          </ul>
        </div>

        {/* Bid Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#233D7B]">
          <h2 className="text-xl font-bold text-[#233D7B] mb-3 border-b pb-2">
            Bid Details
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
              disabled={!hasStarted} // 🔹 disable jab tak auction start nahi hua
              onClick={() => {
                if (!currentUser.cnic) {
                  Swal.fire({
                    icon: "warning",
                    title: "CNIC Required",
                    text: "Please add your CNIC first before bidding.",
                    confirmButtonColor: "#233D7B",
                  });
                } else {
                  setIsOpen(true);
                }
              }}
              className={`w-full py-3 rounded-lg font-semibold transition-all text-white ${
                hasStarted
                  ? "bg-[#233D7B] hover:bg-[#1a2f63]"
                  : "bg-red-900 cursor-not-allowed"
              }`}
            >
              {selectedPrice?.startTime ? (
                hasStarted ? (
                  "Start Bidding"
                ) : (
                  <div className="text-center">
                    {(() => {
                      const hours = Math.floor(remainingTime / 3600);
                      const minutes = Math.floor((remainingTime % 3600) / 60);
                      const seconds = remainingTime % 60;
                      const formatted = `${hours
                        .toString()
                        .padStart(2, "0")}:${minutes
                        .toString()
                        .padStart(2, "0")}:${seconds
                        .toString()
                        .padStart(2, "0")}`;
                      return (
                        <>
                          <div className="text-xl font-bold">{formatted}</div>
                          <div className="text-xs text-blue-100 mt-1">
                            {phase === "before"
                              ? "Starts In"
                              : phase === "running"
                              ? "Time Left"
                              : "Ended"}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )
              ) : (
                "Start Bidding"
              )}
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <LiveCommentsModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          allCustomerBid={allCustomerBid}
          onSubmitBid={handleSubmitBid}
          phase={phase}
          remainingTime={remainingTime}
          timerKey={key}
          selectedPrice={selectedPrice}
        />
      )}
      <ToastContainer />
    </div>
  );
};
