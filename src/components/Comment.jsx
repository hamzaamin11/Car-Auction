import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { BASE_URL } from "./Contant/URL";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const LiveCommentsModal = ({
  isOpen,
  setIsOpen,
  allCustomerBid, // ← Receive bids as prop
  onSubmitBid, // ← Receive submit function as prop
  phase, // ← Receive timer phase
  remainingTime, // ← Receive remaining time
  timerKey, // ← Receive timer key
}) => {
  const { currentUser } = useSelector((state) => state.auth);
  const userId = currentUser?.id;
  const { id: vehicleId } = useParams();

  const initialState = {
    vehicleId,
    userId,
    maxBid: "",
  };

  const [bidAmount, setBidAmount] = useState(initialState);
  const commentsEndRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 9) {
      setBidAmount({ ...bidAmount, [name]: value });
    }
  };

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
    const twoDigits = (n) => {
      if (n < 20) return ones[n];
      const t = Math.floor(n / 10);
      const o = n % 10;
      return tens[t] + (o ? " " + ones[o] : "");
    };
    const threeDigits = (n) => {
      const h = Math.floor(n / 100);
      const r = n % 100;
      return (h ? ones[h] + " Hundred " : "") + (r ? twoDigits(r) : "").trim();
    };
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
    if (num > 0) {
      words += threeDigits(num);
    }
    return words.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for bid amount length (must be at least 5 digits)
    if (!bidAmount.maxBid || bidAmount.maxBid.length < 5) {
      return toast.error("Please enter a bid with at least 5 digits.");
    }

    // Check if bidding phase is active
    if (phase !== "running") {
      return toast.error("Bidding is not active!");
    }

    try {
      await onSubmitBid(bidAmount); // Use the prop function
      setBidAmount(initialState);
      toast.success("Your bid has been added successfully!");
    } catch (error) {
      console.error("Bid submission error:", error);
      toast.error("Failed to add bid!");
    }
  };

  // Auto-scroll to bottom when new bids arrive
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allCustomerBid]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Main Wrapper */}
      <div className="relative flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Live Bidding Modal */}
        <div className="w-full max-w-md md:w-[420px] h-[38rem] md:h-[42rem] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1e3a8a] to-[#233D7B] text-white px-5 py-4 flex justify-between items-center rounded-t-2xl shadow-md">
            <h2 className="font-semibold text-lg tracking-wide">
              Live Bidding
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 text-2xl leading-none transition-transform transform hover:scale-110"
            >
              ×
            </button>
          </div>

          {/* Bids List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 rounded-b-2xl">
            {allCustomerBid.filter((bid) => bid.role !== "admin").length ===
            0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <span className="text-5xl mb-3">💸</span>
                <p className="text-center font-medium">No bids yet...</p>
              </div>
            ) : (
              allCustomerBid
                .filter((bid) => bid.role !== "admin")
                .map((bid, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition duration-200"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-[#233D7B]">
                        {bid.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {moment(bid.createdAt).format("hh:mm A")}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-700 tracking-tight">
                      PKR {bid.maxBid}
                    </p>
                  </div>
                ))
            )}
            <div ref={commentsEndRef} className="h-0" />
          </div>

          {/* Bid Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-gray-100 bg-white flex items-center space-x-3"
          >
            <input
              type="text"
              name="maxBid"
              value={bidAmount.maxBid}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val) && val.length <= 9) handleChange(e);
              }}
              placeholder="Enter your bid..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233D7B]"
              disabled={phase !== "running"}
            />

            <button
              type="submit"
              className="bg-[#233D7B] hover:bg-[#1a2f63] text-white px-5 py-2 rounded-lg font-medium text-sm tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={phase !== "running"}
            >
              Place Bid
            </button>
          </form>

          {/* Amount in Words */}
          {bidAmount.maxBid && (
            <div className="px-5 py-2 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-red-500 font-semibold">
                {numberToIndianWords(parseInt(bidAmount.maxBid))}
              </p>
            </div>
          )}
        </div>

        {/* Countdown Timer */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-100 flex flex-col items-center justify-center w-full max-w-xs md:w-56 md:h-64">
          <CountdownCircleTimer
            key={timerKey}
            isPlaying={phase !== "ended"}
            duration={remainingTime}
            colors={
              phase === "before"
                ? ["#2563eb", "#3b82f6", "#1e3a8a"]
                : ["#22c55e", "#eab308", "#ef4444"]
            }
            colorsTime={[remainingTime, remainingTime / 2, 0]}
            strokeWidth={9}
            size={120}
            trailColor="#e5e7eb"
          >
            {({ remainingTime }) => {
              const hours = Math.floor(remainingTime / 3600);
              const minutes = Math.floor((remainingTime % 3600) / 60);
              const seconds = remainingTime % 60;

              const formatted = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

              return (
                <div className="text-center font-bold text-gray-800">
                  <div className="text-xl">{formatted}</div>
                  <div className="text-xs mt-1 text-gray-500 tracking-wide">
                    {phase === "before"
                      ? "Starts In"
                      : phase === "running"
                      ? "Ends In"
                      : "Ended"}
                  </div>
                </div>
              );
            }}
          </CountdownCircleTimer>

          <h3 className="mt-4 text-sm text-gray-700 font-semibold uppercase tracking-wide">
            Auction Timer
          </h3>
        </div>
      </div>
    </div>
  );
};

export default LiveCommentsModal;
