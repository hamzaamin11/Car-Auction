import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { BASE_URL } from "./Contant/URL";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { io } from "socket.io-client";

const LiveCommentsModal = ({ isOpen, setIsOpen }) => {
  const [allCustomerBid, setAllCustomerBid] = useState([]);

  console.log("all customer bid => ", allCustomerBid);

  const { currentUser } = useSelector((state) => state.auth);

  const userId = currentUser?.id;

  const { id: vehicleId } = useParams();

  const initialState = {
    vehicleId: vehicleId,
    userId: userId,
    maxBid: "",
  };

  const [bidAmount, setBidAmount] = useState(initialState);

  const [comments, setComments] = useState([]);

  const [showTime, setShowTime] = useState(null);

  const startTime = allCustomerBid[0]?.startTime;

  const endTime = allCustomerBid[0]?.endTime;

  // convert start and end time to seconds
  const startInSeconds = moment(startTime).unix();
  const endInSeconds = moment(endTime).unix();

  // har second update ke liye
  const timer = setInterval(() => {
    const currentTimeInSeconds = moment().unix();

    if (currentTimeInSeconds < startInSeconds) {
      // event abhi start nahi hua → start countdown
      const remainingSeconds = startInSeconds - currentTimeInSeconds;
      const duration = moment.duration(remainingSeconds, "seconds");

      const hours = String(duration.hours()).padStart(2, "0");
      const minutes = String(duration.minutes()).padStart(2, "0");
      const seconds = String(duration.seconds()).padStart(2, "0");

      const all = `${hours}:${minutes}:${seconds}`;
      setShowTime(all);
    } else if (
      currentTimeInSeconds >= startInSeconds &&
      currentTimeInSeconds <= endInSeconds
    ) {
      // event start ho gaya → end countdown
      const remainingSeconds = endInSeconds - currentTimeInSeconds;
      const duration = moment.duration(remainingSeconds, "seconds");

      const hours = String(duration.hours()).padStart(2, "0");
      const minutes = String(duration.minutes()).padStart(2, "0");
      const seconds = String(duration.seconds()).padStart(2, "0");

      const all = `${hours}:${minutes}:${seconds}`;
      setShowTime(all);
    } else {
      clearInterval(timer); // stop timer
    }
  }, 1000);

  const commentsEndRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBidAmount({ ...bidAmount, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${BASE_URL}/customer/startBidding`,
        bidAmount
      );
      console.log("=>>>", res.data);
      // handleGetallBid();
      setBidAmount(initialState);
      toast.success("you bid has been added successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetallBid = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/bidsPlacedById/${vehicleId}`
      );
      setAllCustomerBid(res.data); // update state
    } catch (error) {
      console.log("Error fetching bids:", error);
    }
  };

  // // Simulate receiving live comments
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        const randomComment = {
          id: Date.now(),
          username: `user${Math.floor(Math.random() * 1000)}`,
          text: ["990000", "200000", "300000", "500000", "6000000"][
            Math.floor(Math.random() * 5)
          ],
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setComments((prev) => [...prev, randomComment]);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // useEffect(() => {
  //   // pehli dafa call
  //   handleGetallBid();

  //   // har 2 sec me call
  //   const interval = setInterval(() => {
  //     handleGetallBid();
  //     console.log("Polling bids...");
  //   }, 2000);

  //   // clean up jab component unmount ho
  //   return () => clearInterval(interval);
  // }, []);

  // Auto-scroll to bottom when new comments arrive
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) {
      const newSocket = io("http://localhost:3001", {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);

        newSocket.emit(`joinVehicleRoom`, { vehicleId });

        newSocket.on(`bidUpdate`, (data) => {
          console.log("Hamza socket", { data });

          console.log("id mil ri =>", data.vehicleId);
          console.log("yh b  mil ra =>", vehicleId);
          if (data.vehicleId === vehicleId) {
            setAllCustomerBid((prev) => [...prev, data.latestBid]);
          }
        });
      });

      setSocket(newSocket);

      /**
       * Listing all existing bids
       */
      handleGetallBid();

      return () => {
        socket?.emit(`leaveVehicleRoom`, { vehicleId });
        socket?.off("bidUpdate"); // cleanup
      };
    }
  }, [vehicleId]);

  return (
    <div className="fixed backdrop-blur-sm inset-0  bottom-0 flex items-center justify-end  z-50">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full flex justify-center">
        <div className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-2xl sm:text-5xl font-bold text-gray tracking-widest animate-pulse">
          {showTime}
        </div>
      </div>

      <div className="relative w-80 h-[40rem]  bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-red-600 text-white p-3 flex justify-between items-center">
          <h3 className="font-bold">Live Bid</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Comments Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
          {allCustomerBid?.map((item) => (
            <div key={item.bidId} className="text-sm">
              <div className="flex justify-between">
                <span className="font-semibold text-red-600">
                  {item.role === "admin" || item.role === "seller"
                    ? null
                    : item?.name}
                </span>
              </div>
              <p className="text-gray-800">{item.maxBid}</p>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>

        {/* Comment Input */}

        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="number"
              value={bidAmount.maxBid}
              name="maxBid"
              onChange={(e) => {
                const value = e.target.value;

                if (/^[0-9]*$/.test(value) && value.length <= 9) {
                  handleChange(e);
                }
              }}
              placeholder="Bid Amount..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
            >
              Add bid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LiveCommentsModal;
