import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { BASE_URL } from "./Contant/URL";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Swal from "sweetalert2";

const LiveCommentsModal = ({
  isOpen,
  setIsOpen,
  allCustomerBid,
  onSubmitBid,
  phase,
  remainingTime,
  timerKey,
}) => {
  const { currentUser } = useSelector((state) => state.auth);
  const userId = currentUser?.id;
  const { id: vehicleId } = useParams();

  const initialState = { vehicleId, userId, maxBid: "" };
  const [bidAmount, setBidAmount] = useState(initialState);
  const [loading, setLoading] = useState(false);
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
      "", "One", "Two", "Three", "Four", "Five",
      "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen",
      "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
    ];
    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty",
      "Sixty", "Seventy", "Eighty", "Ninety",
    ];
    const twoDigits = (n) => (n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : ""));
    const threeDigits = (n) => (Math.floor(n / 100) ? ones[Math.floor(n / 100)] + " Hundred " : "") + twoDigits(n % 100);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bidAmount.maxBid || bidAmount.maxBid.length < 5)
      return toast.error("Please enter a bid with at least 5 digits.");
    if (phase !== "running") return toast.error("Bidding is not active!");
    
    setLoading(true);
    try {
      await onSubmitBid(bidAmount);
      setBidAmount(initialState);
      setLoading(false);
      
      // Show SweetAlert success message
      Swal.fire({
        icon: "success",
        title: "Bid Placed!",
        text: "Your bid has been added successfully.",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Bid submission error:", error);
      setLoading(false);
      
      // Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to add bid. Please try again.",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allCustomerBid]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col relative my-auto max-h-[95vh]">
        {/* Header with Timer */}
        <div className="relative bg-gradient-to-b from-[#1e3a8a] to-[#233D7B] text-white p-6 flex flex-col items-center justify-center flex-shrink-0">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-4 text-white text-2xl font-bold hover:opacity-80"
          >
            ×
          </button>

          <h2 className="text-lg font-semibold mb-4">Live Auction</h2>

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
              const formatted = `${hours.toString().padStart(2, "0")}:${minutes
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
        </div>

        {/* Bids List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
          {allCustomerBid.filter((bid) => bid.role !== "admin").length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <span className="text-5xl mb-3">💸</span>
              <p className="text-center font-medium">No bids yet...</p>
            </div>
          ) : (
            allCustomerBid
              .filter((bid) => bid.role !== "admin")
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
                      {moment(bid.createdAt).format("hh:mm A")}
                    </p>
                  </div>
                  <p className="text-green-600 font-bold text-lg">
                    PKR {bid.maxBid}
                  </p>
                </div>
              ))
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Input Field */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-100 bg-white flex items-center space-x-2 flex-shrink-0"
        >
          <input
            type="text"
            name="maxBid"
            value={bidAmount.maxBid}
            onChange={(e) => {
              const val = e.target.value;
              if (/^\d*$/.test(val) && val.length <= 9) handleChange(e);
            }}
            placeholder="Enter bid amount"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={phase !== "running" || loading}
          />
          <button
            type="submit"
            disabled={phase !== "running" || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

        {/* Amount in Words */}
        {bidAmount.maxBid && (
          <div className="px-5 py-2 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            <p className="text-sm text-red-500 font-semibold">
              {numberToIndianWords(parseInt(bidAmount.maxBid))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveCommentsModal;