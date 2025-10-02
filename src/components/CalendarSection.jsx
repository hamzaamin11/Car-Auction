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
      const res = await axios.post(`${BASE_URL}/seller/addCalenderEvent`);
      console.log("calender =>>>>>>>>>>>", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllDates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/seller/getCalenderEvents`);
      console.log("=> date", res.data);
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
    handleGetAllDates();
  }, []);

  return (
    <div className="w-full mb-6 px-6 py-6">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          <h1 className="text-4xl font-bold mb-0 md:mb-0">Auctions calendar</h1>
        </div>
      </div>

      <div className="w-full mt-2 lg:mt-6 text-gray-600 text-base leading-relaxed text-justify">
        <p>
          Don’t miss an auction with the Auctions Calendar. The Auction Calendar
          shows you all upcoming auctions planned for the week by date, time and
          location.
        </p>
      </div>

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
