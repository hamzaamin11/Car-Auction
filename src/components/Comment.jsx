import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { BASE_URL } from "./Contant/URL";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Swal from "sweetalert2";
import { FaMoneyCheck } from "react-icons/fa";

const LiveCommentsModal = ({
  isOpen,
  setIsOpen,
  allCustomerBid,
  onSubmitBid,
  phase,
  remainingTime,
  timerKey,
  selectedPrice,
  handleGetallBid,
  handleGetPrice,
}) => {
  const { currentUser } = useSelector((state) => state.auth);
  const userId = currentUser?.id;
  const { id: vehicleId } = useParams();

  console.log("id =>", vehicleId);

  const initialState = { vehicleId, userId, maxBid: "" };
  const [bidAmount, setBidAmount] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [showIncrementModal, setShowIncrementModal] = useState(false);
  const commentsEndRef = useRef(null);
  const [currentAmount, setCurrentAmount] = useState(null);

  console.log("currentBid =>", currentAmount);

  const maxBidRef = useRef();
  const [incrematalAmount, setIncrementAmount] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 9) {
      setBidAmount({ ...bidAmount, [name]: value });
    }
  };

  const handleGetIncrementalAmount = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/listConfigureIncrements`);
      setIncrementAmount(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  function convertToNumber(value) {
    if (!value) return 0;

    // Agar number hi hai
    if (typeof value === "number") return value;

    const lower = value.toLowerCase().replace(/,/g, "").trim();
    const num = parseFloat(lower);

    if (lower.includes("crore") || lower.includes("core")) {
      return Math.round(num * 10000000);
    }

    if (lower.includes("lakh")) {
      return Math.round(num * 100000);
    }

    if (lower.includes("thousand")) {
      return Math.round(num * 1000);
    }

    // Agar plain number string hai
    return Math.round(num);
  }

  const numberToIndianWords = (num) => {
    if (num === 0) return "Zero";
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const twoDigits = (n) =>
      n < 20
        ? ones[n]
        : tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    const threeDigits = (n) =>
      (Math.floor(n / 100) ? ones[Math.floor(n / 100)] + " Hundred " : "") +
      twoDigits(n % 100);

    let words = "";
    if (Math.floor(num / 10000000) > 0) {
      words += numberToIndianWords(Math.floor(num / 10000000)) + " Crore ";
      num %= 10000000;
    }
    if (Math.floor(num / 100000) > 0) {
      words += numberToIndianWords(Math.floor(num / 100000)) + " Lac ";
      num %= 100000;
    }
    if (Math.floor(num / 1000) > 0) {
      words += numberToIndianWords(Math.floor(num / 1000)) + " Thousand ";
      num %= 1000;
    }
    if (num > 0) words += threeDigits(num);
    return words.trim();
  };

  const handleGetCurrentBid = async () => {
    console.log("vehicleId =>", vehicleId);
    try {
      const res = await axios.get(
        `${BASE_URL}/customer/getLatestBidAmount/${vehicleId}`,
      );
      setCurrentAmount(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bidAmount.maxBid || bidAmount.maxBid.length < 6) {
      return Swal.fire({
        icon: "warning",
        title: "Invalid Bid",
        text: "Please enter a bid with at least 6 digits.",
        confirmButtonColor: "#f59e0b",
      });
    }

    // if (bidAmount.maxBid < convertToNumber(selectedPrice.buyNowPrice)) {
    //   return Swal.fire({
    //     icon: "warning",
    //     title: "Invalid Bid",
    //     text: `Your bid must be at least PKR${selectedPrice.buyNowPrice}`,
    //     confirmButtonColor: "#f59e0b",
    //   });
    // }

    if (phase !== "running") {
      return Swal.fire({
        icon: "error",
        title: "Bidding Closed",
        text: "Bidding is not active right now.",
        confirmButtonColor: "#ef4444",
      });
    }

    setLoading(true);
    try {
      await onSubmitBid(bidAmount);
      setBidAmount(initialState);
      handleGetallBid();
      handleGetPrice();

      await Swal.fire({
        icon: "success",
        title: "Bid Placed!",
        text: `PKR ${parseInt(
          bidAmount.maxBid,
        ).toLocaleString()} bid placed successfully!`,
        confirmButtonColor: "#10b981",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Bid submission error:", error);

      error.response?.data?.message || "Failed to place bid. Please try again.";
      if (error.success === false) {
        await Swal.fire({
          icon: "error",
          title: "Bid Failed",
          text: error.response.data.message,
          confirmButtonColor: "#ef4444",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = (value) => {
    const current = BigInt(currentAmount?.yourOffer || 0);

    console.log("current val =>", current);

    const increment = BigInt(value);

    console.log("increment val =>", increment);

    const newBid = current + increment;

    console.log("newBid =>", newBid);

    setBidAmount((prev) => ({
      ...prev,
      maxBid: newBid.toString(),
    }));

    setShowIncrementModal(false);
  };

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allCustomerBid]);

  useEffect(() => {
    handleGetIncrementalAmount();
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  useEffect(() => {
    if (bidAmount.maxBid) {
      maxBidRef.current = bidAmount.maxBid;
    }
  }, [bidAmount.maxBid]);

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center  p-3 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col relative my-auto max-h-[95vh]">
          {/* Header with Timer */}
          <div className="relative bg-blue-950 text-white p-6 flex flex-col items-center justify-center flex-shrink-0">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-4 text-white text-2xl font-bold hover:opacity-80"
            >
              ×
            </button>

            <h2 className="text-lg font-semibold">Live Auction</h2>

            <CountdownCircleTimer
              key={timerKey}
              isPlaying={phase !== "ended"}
              duration={remainingTime}
              colors={
                phase === "before"
                  ? ["#60a5fa", "#3b82f6", "#1e3a8a"]
                  : ["#22c55e", "#eab308", "#ef4444"]
              }
              colorsTime={[remainingTime, remainingTime / 2, 0]}
              strokeWidth={8}
              size={120}
              trailColor="#1e40af"
            >
              {({ remainingTime }) => {
                const hours = Math.floor(remainingTime / 3600);
                const minutes = Math.floor((remainingTime % 3600) / 60);
                const seconds = remainingTime % 60;
                const formatted = `${hours
                  .toString()
                  .padStart(2, "0")}:${minutes
                  .toString()
                  .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
                return (
                  <div className="text-center">
                    <div className="text-xl font-bold">{formatted}</div>
                    <div className="text-xs text-blue-100 mt-1">
                      {phase === "before"
                        ? "Starts In"
                        : phase === "running"
                          ? "Time Left"
                          : "Ended"}
                    </div>
                  </div>
                );
              }}
            </CountdownCircleTimer>
            {allCustomerBid.filter(
              (bid) => bid.role !== "admin" && bid.role !== "seller",
            ).length > 0 &&
              // Current and Second Last Bid
              (() => {
                const filteredBids = allCustomerBid.filter(
                  (bid) => bid.role !== "admin" && bid.role !== "seller",
                );
                const currentBid = filteredBids[filteredBids.length - 1];
                const secondLastBid =
                  filteredBids.length > 1
                    ? filteredBids[filteredBids.length - 2]
                    : null;

                return (
                  <div className="flex gap-14 mb-4">
                    {secondLastBid ? (
                      <div>
                        <h2>Previous Bid</h2>
                        <span className="font-bold">
                          PKR {secondLastBid.maxBid.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <h2 className="font-bold">Previous Bid</h2>
                        <span>PKR {0}</span>
                      </div>
                    )}
                    {currentBid ? (
                      <div>
                        <h2 className="">Current Bid</h2>
                        <span className="font-bold">
                          PKR {currentBid.maxBid.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <h2 className="font-bold">Current Bid</h2>
                        <span>PKR {0}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
          </div>

          {/* Bids List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
            {allCustomerBid.filter(
              (bid) => bid.role !== "admin" && bid.role !== "seller",
            ).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <FaMoneyCheck />
                <p className="text-center font-medium">No bids yet...</p>
              </div>
            ) : (
              allCustomerBid
                .filter((bid) => bid.role !== "admin" && bid.role !== "seller")
                .map((bid, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {bid.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {moment(bid.bidUpdatedAt).format("hh:mm A")}
                      </p>
                    </div>
                    <p className="text-red-600 font-bold text-lg">
                      PKR {bid.maxBid.toLocaleString()}
                    </p>
                  </div>
                ))
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* Input Field */}
          <div className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white flex items-center space-x-2 flex-shrink-0"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="maxBid"
                  value={bidAmount.maxBid}
                  onChange={(e) => {
                    const val = e.target.value.replace(/,/g, ""); // commas remove
                    // Only numbers allowed
                    if (val === "" || /^[0-9]+$/.test(val)) {
                      handleChange(e);
                    }
                  }}
                  placeholder="Enter bid amount"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-950"
                  disabled={phase !== "running" || loading}
                />

                <button
                  type="button"
                  onClick={() => {
                    (setShowIncrementModal(true), handleGetCurrentBid());
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 text-white rounded-md p-1.5 transition"
                  disabled={phase !== "running" || loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              <button
                type="submit"
                disabled={phase !== "running" || loading}
                className="bg-blue-950 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
                {loading ? "Placing..." : "Place Bid"}
              </button>
            </form>

            <div className="mt-3 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">
                Bid Increment:{" "}
                <span className="text-blue-950 font-bold">Auto</span>
              </p>
            </div>
          </div>

          {/* Amount in Words */}
          {bidAmount.maxBid && (
            <div className="px-5 py-2 bg-gray-50 border-t border-gray-200 flex-shrink-0">
              <p className="text-sm text-red-500 font-semibold">
                {numberToIndianWords(parseInt(bidAmount.maxBid))} Rupees
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Increment Modal */}
      {showIncrementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-blue-950">
                Quick Bid Increment
              </h3>
              <button
                onClick={() => setShowIncrementModal(false)}
                className="text-gray-400 hover:text-red-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {incrematalAmount.map((inc, index) => (
                <button
                  key={index}
                  onClick={() => handleIncrement(inc.amount)}
                  className="bg-blue-950 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
                >
                  + {inc.amount}
                </button>
              ))}
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              Current Bid:{" "}
              <span className="font-bold text-blue-950">
                PKR {currentAmount ? parseInt(currentAmount.yourOffer) : "0"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveCommentsModal;
