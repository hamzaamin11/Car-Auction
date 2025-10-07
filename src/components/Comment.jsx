import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { BASE_URL } from "./Contant/URL";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { io } from "socket.io-client";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const LiveCommentsModal = ({ isOpen, setIsOpen }) => {
  const [allCustomerBid, setAllCustomerBid] = useState([]);
  const { currentUser } = useSelector((state) => state.auth);
  const userId = currentUser?.id;
  const { id: vehicleId } = useParams();

  const initialState = {
    vehicleId,
    userId,
    maxBid: "",
  };

  const [bidAmount, setBidAmount] = useState(initialState);
  const [socket, setSocket] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [phase, setPhase] = useState("loading");
  const [key, setKey] = useState(0);
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

    // ✅ Validation for bid amount length (must be at least 5 digits)
    if (!bidAmount.maxBid || bidAmount.maxBid.length < 5) {
      return toast.error("Please enter a bid with at least 5 digits.");
    }

    // ✅ Check if bidding phase is active
    if (phase !== "running") {
      return toast.error("Bidding is not active!");
    }

    try {
      await axios.post(`${BASE_URL}/customer/startBidding`, bidAmount);
      setBidAmount(initialState);
      toast.success("Your bid has been added successfully!");
      handleGetallBid(); // Refresh bids after posting
    } catch (error) {
      console.error("Bid submission error:", error);
      toast.error("Failed to add bid!");
    }
  };

  const handleGetallBid = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/bidsPlacedById/${vehicleId}`
      );
      setAllCustomerBid(res.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("joinVehicleRoom", { vehicleId });
    });

    newSocket.on("bidUpdate", (data) => {
      console.log("Received bidUpdate:", data);
      if (data.vehicleId === vehicleId) {
        setAllCustomerBid((prev) => {
          const newBids = [...prev, data.latestBid];
          console.log("Updated bids:", newBids);
          return newBids;
        });
      }
    });

    setSocket(newSocket);
    handleGetallBid();

    return () => {
      newSocket.emit("leaveVehicleRoom", { vehicleId });
      newSocket.off("bidUpdate");
      newSocket.disconnect();
    };
  }, [vehicleId]);

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
    } else if (now >= start && now <= end) {
      setPhase("running");
      setRemainingTime(end - now);
    } else {
      setPhase("ended");
      setRemainingTime(0);
    }

    setKey((prev) => prev + 1);
  }, [allCustomerBid]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allCustomerBid]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex flex-col items-center">
          <CountdownCircleTimer
            key={key}
            isPlaying={phase !== "ended"}
            duration={remainingTime}
            colors={
              phase === "before"
                ? ["#2563eb", "#3b82f6", "#1e3a8a"]
                : ["#22c55e", "#eab308", "#ef4444"]
            }
            colorsTime={[remainingTime, remainingTime / 2, 0]}
            strokeWidth={8}
            size={150}
            trailColor="#e5e7eb"
            onComplete={() => {
              if (phase === "before") {
                setPhase("running");
                setKey((prev) => prev + 1);
                return { shouldRepeat: true };
              }
              setPhase("ended");
              return { shouldRepeat: false };
            }}
          >
            {({ remainingTime }) => {
              const hours = Math.floor(remainingTime / 3600);
              const minutes = Math.floor((remainingTime % 3600) / 60);
              const seconds = remainingTime % 60;

              const formatted = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

              return (
                <div className="text-center text-gray-800 font-extrabold text-xl">
                  <div>{formatted}</div>
                  <div className="text-sm font-normal mt-1 text-gray-800">
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
        </div>
      </div>

      <div className="relative w-96 h-[42rem] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
        <div className="bg-[#233D7B] text-white px-5 py-3 flex justify-between items-center rounded-t-2xl">
          <h2 className="font-bold text-lg">Live Bidding</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {allCustomerBid.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">No bids yet...</p>
          ) : (
            allCustomerBid.map((bid, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#233D7B]">
                    {bid.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {moment(bid.createdAt).format("hh:mm A")}
                  </span>
                </div>
                <p className="text-xl font-bold text-green-700">
                  PKR {bid.maxBid}
                </p>
              </div>
            ))
          )}
          <div ref={commentsEndRef} className="h-0" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 border-t bg-white flex space-x-2 rounded-b-2xl"
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
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#233D7B]"
            disabled={phase !== "running"}
          />

          <button
            type="submit"
            className="bg-[#233D7B] hover:bg-[#1a2f63] text-white px-4 py-2 rounded-lg font-semibold"
            disabled={phase !== "running"}
          >
            Bid
          </button>
        </form>
        <div p-2 >
          {bidAmount.maxBid && (
            <p className="mt-2 text-sm text-red-500 font-semibold mx-4">
              {numberToIndianWords(parseInt(bidAmount.maxBid))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveCommentsModal;
