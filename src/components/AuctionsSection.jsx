import { useState } from "react";
import { FaCalendar, FaListUl, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AuctionsSection() {
  const [showEmailForm, setShowEmailForm] = useState(false);

  return (
    <div className="w-full  px-6 ">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          <h1 className="lg:text-4xl text-xl font-bold mb-4 md:mb-0">
            Today's auctions
          </h1>
          {/**
          <ul className="flex flex-wrap items-center space-x-4 text-sm text-gray-700">
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
          </ul>
           */}
        </div>
      </div>

      <div className=" lg:mt-2 mt-0 text-gray-600 text-base leading-relaxed text-justify">
        <p>
          Check out Today’s Auctions to see what auctions are taking place
          today.
          <Link
            to="/"
            className="underline text-red-600 hover:text-red-800 hover:cursor-pointer"
          >
            Online Auctions
          </Link>{" "}
          if there is some important information to be aware of.
        </p>
      </div>
    </div>
  );
}
