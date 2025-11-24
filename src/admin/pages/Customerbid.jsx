import {
  FaArrowLeft,
  FaArrowRight,
  FaClock,
  FaCalendarPlus,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../components/Contant/URL";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import LiveCommentsModal from "../../components/Comment";
import moment from "moment";
import { io } from "socket.io-client";
import { current } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { IoMdArrowBack } from "react-icons/io";
import { ChevronRight } from "lucide-react";
import { WarningModal } from "../../components/ModelModal/WarningModel";

export const Customerbid = () => {
  const { currentUser } = useSelector((state) => state.auth);

  const userId = currentUser?.id;

  const token = currentUser?.token;

  const navigate = useNavigate();

  console.log("userid =>", userId);

  const [isOpen, setIsOpen] = useState(false);

  const [isOpenModal, setIsOpenModal] = useState("");

  console.log("isopenmodal =>", isOpenModal);

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

  const handleIsOpenModal = (active) => {
    setIsOpenModal((prev) => (prev === active ? "" : active));
  };

  const yourBid = useEffect(() => {
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
      const res = await axios.get(`${BASE_URL}/getVehiclesById/${vehicleId}`, {
        headers: {
          Authorization: token,
        },
      });
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
      console.log("Fetched bids:", res.data);
      setAllCustomerBid(res.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  const handleSubmitBid = async (bidAmount) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/customer/startBidding`,
        bidAmount
      );
      console.log("Bid submitted:", response.data);

      // Refresh bids immediately after submission
      setTimeout(() => {
        handleGetallBid();
      }, 500);
    } catch (error) {
      console.error("Bid submission failed=>", error);
      Swal.fire({
        icon: "warning",
        title: "",
        text: error.response.data.message,
        confirmButtonColor: "#233D7B",
      });

      throw error.response.data.message;
    }
  };

  // SOCKET CONNECTION - STAYS ACTIVE EVEN WHEN MODAL IS CLOSED
  useEffect(() => {
    console.log("Initializing socket connection for vehicle:", vehicleId);

    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      console.log("Joining room for vehicle:", vehicleId);
      newSocket.emit("joinVehicleRoom", { vehicleId });
    });

    // Listen for bidUpdate event
    newSocket.on("bidUpdate", (data) => {
      console.log("Received bidUpdate event:", data);

      // Check if the vehicleId matches (handle both string and number)
      if (data.vehicleId == vehicleId) {
        console.log("VehicleId matches, processing bid");
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
            console.log("Bid already exists, skipping");
            return prev;
          }

          console.log("Adding new bid to list:", data.latestBid);
          return [...prev, data.latestBid];
        });
      } else {
        console.log("VehicleId mismatch:", data.vehicleId, "vs", vehicleId);
      }
    });

    // Listen for ANY event (for debugging)
    newSocket.onAny((eventName, ...args) => {
      console.log("Received socket event:", eventName, args);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    setSocket(newSocket);
    handleGetallBid();

    return () => {
      console.log("Cleaning up socket connection");
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
    console.log("Starting polling mechanism");
    const pollingInterval = setInterval(() => {
      console.log("Polling for new bids...");
      handleGetallBid();
    }, 3000); // Poll every 3 seconds

    return () => {
      console.log("Stopping polling mechanism");
      clearInterval(pollingInterval);
    };
  }, [vehicleId]);

  // TIMER LOGIC
  useEffect(() => {
    if (!allCustomerBid[0]?.startTime || !allCustomerBid[0]?.endTime) {
      console.log("Missing startTime or endTime:", allCustomerBid[0]);
      return;
    }

    const start = moment(allCustomerBid[0].startTime).unix();
    const end = moment(allCustomerBid[0].endTime).unix();
    const now = moment().unix();

    if (now < start) {
      setPhase("before");
      setRemainingTime(start - now);
      console.log("Auction starts in:", start - now, "seconds");
    } else if (now >= start && now <= end) {
      setPhase("running");
      setRemainingTime(end - now);
      console.log("Auction running, ends in:", end - now, "seconds");
    } else {
      setPhase("ended");
      setRemainingTime(0);
      console.log("Auction ended");
    }

    setKey((prev) => prev + 1);
  }, [allCustomerBid]);

  useEffect(() => {
    handleGetPrice();
  }, []);

  // === ADD TO CALENDAR FUNCTION ===
  const generateICS = () => {
    if (!selectedPrice?.startTime || !selectedPrice?.endTime) return;

    const start = moment(selectedPrice.startTime).utc();
    const end = moment(selectedPrice.endTime).utc();

    const event = {
      title: `Bid: ${selectedPrice.make} ${selectedPrice.model} ${selectedPrice.year}`,
      description: `Auction for Lot #${
        selectedPrice.lot_number
      }. Current Bid: PKR ${selectedPrice.buyNowPrice?.toLocaleString()}. Join at: ${
        window.location.href
      }`,
      location: "Online Auction",
      start: start.format("YYYYMMDD[T]HHmmss[Z]"),
      end: end.format("YYYYMMDD[T]HHmmss[Z]"),
    };

    const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your App//Auction Reminder//EN
BEGIN:VEVENT
UID:${Date.now()}@yourapp.com
DTSTAMP:${moment().utc().format("YYYYMMDD[T]HHmmss[Z]")}
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, "\\n")}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`.trim();

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Auction-${selectedPrice.lot_number}-${selectedPrice.make}-${selectedPrice.model}.ics`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-screen-2xl mx-auto p-4 bg-gray-100 min-h-screen">
      {/* Header */}

      <div className="mb-4">
        {/* Breadcrumb Section */}
        <nav className="flex flex-nowrap items-center whitespace-nowrap text-sm text-gray-600 mb-3 lg:mx-4 mx-1 ">
          <Link to="/" className="hover:underline text-blue-950">
            Home
          </Link>

          <ChevronRight className="lg:mx-2 mx-1 w-4  h-4  text-gray-600" />

          <Link to="/finder" className="hover:underline text-blue-950">
            Find Vehicle
          </Link>

          <ChevronRight className="lg:mx-2 mx-1 w-4  h-4  text-gray-600" />

          <span
            onClick={() => navigate(`/filterprice/make/${selectedPrice?.make}`)}
            className="text-blue-950 capitalize hover:cursor-pointer hover:underline"
          >
            {selectedPrice?.make || "N/A"}
          </span>

          <ChevronRight className="mx-1 lg:mx-2 w-4  h-4  text-gray-600" />

          <span className="text-blue-950 capitalize">
            {selectedPrice?.model} {selectedPrice?.series} {selectedPrice?.year}
          </span>
        </nav>

        {/* Header with Back Button */}
        <div className="flex items-center">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-700 hover:text-black font-medium text-sm lg:text-base mr-4 transition-all duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1.5 text-black "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back
          </button>

          {/* Title */}
          <h1 className="lg:text-3xl text-xl font-bold text-black">
            {selectedPrice?.make} {selectedPrice?.model} {selectedPrice?.series}{" "}
            {selectedPrice?.year}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-1">
        {/* LEFT: IMAGE SLIDER */}
        <div className="bg-white rounded-xl shadow-md p-4 relative">
          {/* Image container */}
          <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden">
            <img
              src={viewImage}
              alt="No image found"
              className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
            />

            {/* Left Arrow */}
            <button
              onClick={handlePreviousImage}
              className="absolute top-1/2 left-3 sm:left-4 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-blue-950 transition"
            >
              <FaArrowLeft size={16} />
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNextImage}
              className="absolute top-1/2 right-3 sm:right-4 transform -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-blue-950 transition"
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

        {/* CENTER: VEHICLE DETAILS (DESKTOP) */}
        <div className="hidden lg:block space-y-6">
          {/* Vehicle Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6 h-full">
            <h2 className="text-1rem font-bold text-gray-800  border-b border-gray-100 pb-2">
              Vehicle Details
            </h2>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm text-gray-700   border-collapse">
                <tbody className=" ">
                  <tr className="border-b border-gray-100   ">
                    <td className=" py-2 px-2 w-1/2">Lot Number:</td>
                    <td className="py-2 font-semibold">
                      {selectedPrice?.lot_number || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100   ">
                    <td className=" py-2 px-2 w-1/2">Year:</td>
                    <td className="py-2 font-semibold">
                      {selectedPrice?.year || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 ">
                    <td className="py-2 px-2 ">Make:</td>
                    <td className="py-2 font-semibold ">
                      {selectedPrice?.make || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 ">
                    <td className="py-2 px-2 ">Model:</td>
                    <td className="py-2 font-semibold ">
                      {selectedPrice?.model || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 ">
                    <td className="py-2 px-2 ">City:</td>
                    <td className="py-2 font-semibold ">
                      {selectedPrice?.locationId || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 ">
                    <td className=" py-2 px-2 ">Body Style:</td>
                    <td className="py-2 font-semibold">
                      {selectedPrice?.bodyStyle || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 ">
                    <td className=" py-2 px-2 ">Certification Status:</td>
                    <td className="py-2 font-semibold ">
                      {selectedPrice?.certifyStatus || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 ">
                    <td className=" py-2 px-2 ">Transmission:</td>
                    <td className="py-2 font-semibold">
                      {selectedPrice?.transmission || "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 ">
                    <td className=" py-2 px-2 ">Meter Reading:</td>
                    <td className="py-2 font-semibold">
                      {selectedPrice?.mileage || "N/A"} KM
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 ">
                    <td className=" py-2 px-2 ">Drive</td>
                    <td className="py-2 font-semibold">
                      {selectedPrice?.driveType
                        ? selectedPrice.driveType.charAt(0).toUpperCase() +
                          selectedPrice.driveType.slice(1)
                        : "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 ">
                    <td className=" py-2 px-2 ">Fuel:</td>
                    <td className="py-2 font-semibold">
                      {selectedPrice?.fuelType
                        ? selectedPrice.fuelType.charAt(0).toUpperCase() +
                          selectedPrice.fuelType.slice(1)
                        : "N/A"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 ">
                    <td className=" py-2 px-2 ">Color:</td>
                    <td className="py-2 font-semibold">
                      {selectedPrice?.color
                        ? selectedPrice.color.charAt(0).toUpperCase() +
                          selectedPrice.color.slice(1)
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 ">Condition:</td>
                    <td className="py-2 font-semibold">
                      {selectedPrice?.vehicleCondition
                        ? selectedPrice.vehicleCondition
                            .charAt(0)
                            .toUpperCase() +
                          selectedPrice.vehicleCondition.slice(1)
                        : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: BID INFORMATION (DESKTOP) */}
        <div className="bg-white rounded-xl shadow-md p-6 hidden lg:block">
          <h2 className="text-1rem font-bold text-gray-800 mb-3 border-b pb-2 border-gray-100">
            Bid Information
          </h2>

          <table className="w-full text-sm  border-gray-100 text-gray-700 rounded-lg overflow-hidden">
            <tbody>
              <tr className="border-b border-gray-100">
                <th className="text-left p-2  font-medium w-1/2">
                  Bid Status:
                </th>
                <td className="p-2 font-semibold ">
                  {selectedPrice?.userMaxBid
                    ? "You have bid"
                    : "You haven't bid" || "N/A"}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <th className="text-left p-2 font-medium ">
                  Eligibility Status:
                </th>
                <td className="p-2 font-semibold flex items-center gap-2">
                  <span>
                    {currentUser &&
                    currentUser.cnic &&
                    selectedPrice?.eligibilityStatus ? (
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                        <span className="text-green-600 font-semibold">
                          Yes
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                        <p className="text-red-600 text-sm">
                          Not eligible to bid{" "}
                          <span
                            onClick={() => handleIsOpenModal("warning")}
                            className="text-blue-950 underline text-xs hover:cursor-pointer font-semibold"
                          >
                            Check Why
                          </span>
                        </p>
                      </div>
                    )}
                  </span>
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <th className="text-left p-2 font-medium  ">Sale Status:</th>
                <td className="p-2 font-semibold ">On Approval</td>
              </tr>

              <tr className="border-b border-gray-100">
                <th className="text-left p-2 font-medium ">Time Left:</th>
                <td className="p-2 font-semibold text-red-600 flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    {(() => {
                      if (remainingTime <= 0) {
                        return (
                          <span className="text-gray-700">
                            The bidding for this vehicle has ended
                          </span>
                        );
                      }

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

                      return formatted;
                    })()}
                    {remainingTime > 0 && (
                      <FaClock className="text-red-600 text-sm" />
                    )}
                  </div>

                  {/* ADD TO CALENDAR - DESKTOP */}
                  {selectedPrice?.startTime && (
                    <button
                      onClick={generateICS}
                      className="flex items-center gap-1 text-xs text-blue-950  underline mt-1"
                    >
                      <FaCalendarPlus size={12} />
                      Add to Calendar
                    </button>
                  )}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <th className="text-left p-2 font-medium ">Current Bid:</th>
                <td className="p-2 font-semibold ">
                  PKR {selectedPrice?.buyNowPrice?.toLocaleString()}
                </td>
              </tr>
              {currentUser && (
                <tr className="border-b border-gray-100">
                  <th className="text-left p-2 font-medium ">Your Bid:</th>
                  <td className="p-2 font-semibold  ">
                    PKR {selectedPrice?.userMaxBid?.toLocaleString() || "--"}
                  </td>
                </tr>
              )}

              <tr className="border-b border-gray-100">
                <th className="text-left p-2 font-medium ">Bid Date:</th>
                <td className="p-2 font-semibold  ">
                  {selectedPrice?.startTime
                    ? new Date(selectedPrice.startTime).toLocaleDateString(
                        "en-GB"
                      )
                    : "Coming Soon"}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <th className="text-left p-2 font-medium ">Start Time:</th>
                <td className="p-2  font-semibold">
                  {(selectedPrice?.startTime &&
                    moment(selectedPrice?.startTime)
                      .local()
                      .format("hh:mm A")) ||
                    "N/A"}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <th className="text-left p-2  font-medium ">End Time:</th>
                <td className="p-2 font-semibold">
                  {(selectedPrice?.endTime &&
                    moment(selectedPrice?.endTime).local().format("hh:mm A")) ||
                    "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Buttons Section */}
          <div className="mt-4">
            {currentUser && (
              <button
                disabled={
                  !hasStarted ||
                  selectedPrice.auctionStatus === "upcoming" ||
                  selectedPrice.auctionStatus === "end"
                }
                onClick={() => {
                  if (!currentUser.cnic) {
                    Swal.fire({
                      icon: "warning",
                      title: "CNIC Required",
                      text: "Please add your CNIC first before bidding.",
                      confirmButtonColor: "#233D7B",
                    });
                  } else if (selectedPrice?.auctionStatus === "end") {
                    Swal.fire({
                      icon: "warning",
                      title: "Auction Time",
                      text: "Auction time for this vehicle is not available anymore!",
                      confirmButtonColor: "#233D7B",
                    });
                  } else {
                    setIsOpen(true);
                  }
                }}
                className={`w-full py-3 rounded-lg font-semibold transition-all text-white ${
                  hasStarted ? "bg-blue-950 " : "bg-red-600 cursor-not-allowed"
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
                            <div className="text-base text-white mt-1">
                              {phase === "before"
                                ? "Auction start in"
                                : phase === "running"
                                ? "Time Left"
                                : "Ended"}
                            </div>
                            <div className="text-xl font-bold">{formatted}</div>
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
                disabled={
                  selectedPrice?.auctionStatus === "upcoming" ||
                  selectedPrice?.auctionStatus === "end"
                }
                onClick={() => {
                  navigate("/login");
                }}
                className="w-full py-3 rounded-lg font-semibold transition-all text-white bg-blue-950 disabled:opacity-70"
              >
                {currentUser ? "Join Auction" : "Bid Now"}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: VEHICLE + BID DETAILS */}
      </div>

      {/* MOBILE LAYOUT */}
      <div className="col-span-1 space-y-6 lg:hidden block">
        {/* Vehicle Details Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-4">
          <h2 className="text-1rem font-bold text-black mb-3 border-b border-gray-100 pb-2">
            Vehicle Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700 border-collapse">
              <tbody className=" border-gray-100">
                <tr className="border-b border-gray-100">
                  <td className=" py-2 px-2 w-1/3">Lot Number:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.lot_number || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className=" py-2 px-2 w-1/3">Year:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.year || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className=" px-2 py-2">Make:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.make || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className=" px-2 py-2">Model:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.model || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className=" px-2 py-2">City:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.locationId || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-2 py-2">Body Style:</td>
                  <td className="py-2 font-semibold text-right ">
                    {selectedPrice?.bodyStyle || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className=" px-2 py-2">Certification Status:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.certifyStatus || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className=" px-2 py-2">Transmission:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.transmission || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className=" px-2 py-2">Meter Reading:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.mileage || "N/A"} KM
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className=" px-2 py-2 ">Drive:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.driveType || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className=" px-2 py-2">Fuel:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.fuelType || "N/A"}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className=" px-2 py-2">Color:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.color || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className=" px-2 py-2 border-gray-100">Condition:</td>
                  <td className="py-2 font-semibold text-right">
                    {selectedPrice?.vehicleCondition || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bid Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-1rem font-bold text-black mb-3 border-b border-gray-100 pb-2">
            Bid Information
          </h2>

          <table className="w-full text-sm  border-gray-100 rounded-lg overflow-hidden">
            <tbody className="text-gray-800">
              <tr className="border-b border-gray-100">
                <th className="text-left p-2  w-1/2 font-medium">
                  Bid Status:
                </th>
                <td className="p-2 font-semibold text-right">
                  {selectedPrice?.userMaxBid
                    ? "You have bid"
                    : "You haven't bid" || "N/A"}
                </td>
              </tr>

              <tr className="border-b border-gray-100 ">
                <th className="text-left p-2 font-medium ">
                  Eligibility Status:
                </th>
                <td className="p-2 font-semibold text-right ">
                  {currentUser &&
                  currentUser.cnic &&
                  selectedPrice?.eligibilityStatus ? (
                    <div className="flex items-center gap-2 justify-end">
                      <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                      <span className="text-green-600 font-semibold">Yes</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-0">
                      <span className="w-4 h-3 bg-red-600 rounded-full mt-1  "></span>
                      <p className="text-red-600 text-sm">
                        Not eligible to bid{" "}
                        <span
                          onClick={() => handleIsOpenModal("warning")}
                          className="text-blue-950 underline text-xs hover:cursor-pointer font-semibold"
                        >
                          Check Why
                        </span>
                      </p>
                    </div>
                  )}
                </td>
              </tr>

              <tr className="border-b border-gray-100 ">
                <th className="text-left p-2 font-medium ">Sale Status:</th>
                <td className="p-2 font-semibold text-right ">On Approval</td>
              </tr>

              <tr className="border-b border-gray-100 ">
                <th className="text-left p-2 font-medium ">Time Left:</th>

                <td className="p-2 font-semibold justify-end text-red-600 flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    {(() => {
                      if (remainingTime <= 0) {
                        return (
                          <span className="text-gray-800 text-right">
                            The bidding for this vehicle has ended
                          </span>
                        );
                      }

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

                      return formatted;
                    })()}
                    {remainingTime > 0 && (
                      <FaClock className="text-red-600 text-sm" />
                    )}
                  </div>

                  {/* ADD TO CALENDAR - MOBILE */}
                  {selectedPrice?.startTime && (
                    <button
                      onClick={generateICS}
                      className="flex items-center gap-1 text-xs text-blue-950 underline mt-1"
                    >
                      <FaCalendarPlus size={12} />
                      Add to Calendar
                    </button>
                  )}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <th className="text-left p-2 font-medium ">Current Bid:</th>
                <td className="p-2 font-semibold text-right  ">
                  PKR {selectedPrice?.buyNowPrice?.toLocaleString()}
                </td>
              </tr>
              {currentUser && (
                <tr className="border-b border-gray-100">
                  <th className="text-left p-2 font-medium  text-gray-800">
                    Your Bid:
                  </th>
                  <td className="p-2 font-semibold text-right ">
                    PKR {selectedPrice?.userMaxBid?.toLocaleString() || "--"}
                  </td>
                </tr>
              )}

              <tr className="border-b border-gray-100">
                <th className="text-left p-2 font-medium">Bid Date:</th>
                <td className="p-2  font-semibold text-right ">
                  {selectedPrice?.startTime
                    ? new Date(selectedPrice.startTime).toLocaleDateString(
                        "en-GB"
                      )
                    : "Coming Soon"}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <th className="text-left p-2 font-medium  ">Start Time:</th>
                <td className="p-2 font-semibold text-right ">
                  {(selectedPrice?.startTime &&
                    moment(selectedPrice?.startTime)
                      .local()
                      .format("hh:mm A")) ||
                    "N/A"}
                </td>
              </tr>

              <tr className="border-b border-gray-100">
                <th className="text-left p-2 font-medium  ">End Time:</th>
                <td className="p-2 font-semibold text-right ">
                  {(selectedPrice?.endTime &&
                    moment(selectedPrice?.endTime).local().format("hh:mm A")) ||
                    "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Buttons Section */}
          <div className="mt-4">
            {currentUser && (
              <button
                disabled={!hasStarted}
                onClick={() => {
                  if (!currentUser.cnic) {
                    Swal.fire({
                      icon: "warning",
                      title: "CNIC Required",
                      text: "Please add your CNIC first before bidding.",
                      confirmButtonColor: "#233D7B",
                    });
                  } else if (selectedPrice?.auctionStatus === "end") {
                    Swal.fire({
                      icon: "warning",
                      title: "Auction Time",
                      text: "Auction time for this vehicle is not available anymore!",
                      confirmButtonColor: "#233D7B",
                    });
                  } else {
                    setIsOpen(true);
                  }
                }}
                className={`w-full py-3 rounded-lg font-semibold transition-all text-white ${
                  hasStarted ? "bg-blue-950 " : "bg-red-600 cursor-not-allowed"
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
                            <div className="text-base text-white mt-1">
                              {phase === "before"
                                ? "Auction start in"
                                : phase === "running"
                                ? "Time Left"
                                : "Ended"}
                            </div>
                            <div className="text-xl font-bold">{formatted}</div>
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
                className="w-full py-3 rounded-lg font-semibold transition-all text-white bg-blue-950 hover:cursor-pointer"
              >
                Join Auction
              </button>
            )}
          </div>
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
          handleGetallBid={handleGetallBid}
          handleGetPrice={handleGetPrice}
        />
      )}
      <ToastContainer />
      {isOpenModal === "warning" && (
        <WarningModal onClose={() => handleIsOpenModal("")} />
      )}
    </div>
  );
};
