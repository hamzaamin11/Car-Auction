import { useEffect, useState } from "react";
import { FaCalendar, FaListUl, FaEnvelope, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import CalendarAuctionTable from "./CalendarAuctionTable";
import { AddCelandarModal } from "./AddCelandarModal";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";

export default function CalendarSection() {
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [showTime, setShowTime] = useState(false);

  const [showModel, setShowModel] = useState("");

  const [allAuctions, setAllAuctions] = useState([]);

  const handleGetAllCalendar = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/seller/getCalenderEvents`);
      console.log("calender =>>>>>>>>>>>", res.data);
      setAllAuctions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleModal = (active) => {
    setShowModel((prev) => (prev === active ? "" : active));
  };

  useEffect(() => {
    handleGetAllCalendar();
  }, []);

  return (
    <div className="w-full mb-6 px-6 py-6">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          <h1 className="text-4xl font-bold mb-4 md:mb-0">Auctions calendar</h1>
          <ul className="flex flex-wrap items-center space-x-4 text-sm text-gray-700">
            <li className="font-medium">View by</li>
            <li>
              <Link
                to="/calendar"
                className="flex items-center hover:text-red-600 transition"
                data-uname="auctionscalenderCalenderbutton"
              >
                <FaCalendar className="mr-2" />
                Calendar
              </Link>
            </li>
            <li>
              <Link
                to="/saleslist"
                className="flex items-center hover:text-red-600 transition"
                data-uname="auctionscalenderListbutton"
              >
                <FaListUl className="mr-2" />
                List
              </Link>
            </li>
            <div
              onClick={() => handleToggleModal("add")}
              className="bg-red-600 text-white p-2 rounded hover:scale-95 duration-100 hover:cursor-pointer"
            >
              Add Calendar
            </div>
          </ul>
        </div>

        <div className="mt-4 md:mt-0 flex space-x-4 text-sm text-gray-700">
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="flex items-center hover:text-red-600 transition"
            data-uname="todaysAuctionEmailbutton"
            data-doctitle="Today's auctions"
          >
            <FaEnvelope className="mr-1" />
            Email
          </button>

          <button
            onClick={() => setShowTime(!showTime)}
            className="flex items-center hover:text-red-600 transition"
          >
            <FaClock className="mr-1" />
            {showTime ? "Hide Time" : "Show Time"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mt-6 text-gray-600 text-base leading-relaxed text-justify">
        <p>
          Don’t miss an auction with the Auctions Calendar. The Auction Calendar
          shows you all upcoming auctions planned for the week by date, time and
          location. Click on the location to see the vehicles listed in that
          auction. You can make bids or add the vehicles to your Watchlist.
        </p>
      </div>

      {showEmailForm && (
        <div className="max-w-xl mt-6 bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Send Email</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                className="w-full px-4 py-2 border rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-[#518ecb] text-white font-semibold px-6 py-2 rounded hover:bg-[#08c] transition"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      <CalendarAuctionTable showTime={showTime} allAuctions={allAuctions} />
      {showModel === "add" && (
        <AddCelandarModal
          handleToggleModal={() => handleToggleModal("add")}
          handleGetAllCalendar={handleGetAllCalendar}
        />
      )}
    </div>
  );
}
