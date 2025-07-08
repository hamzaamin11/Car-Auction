import { useState } from 'react';
import { FaCalendar, FaListUl, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AuctionsSection() {
  const [showEmailForm, setShowEmailForm] = useState(false);

  return (
    <div className="w-full mb-6 px-6 py-6">
      <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
       
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          <h1 className="text-4xl font-bold mb-4 md:mb-0">Today's auctions</h1>
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
          </ul>
        </div>

    
        <div className="mt-4 md:mt-0">
          <ul className="flex space-x-4 text-sm text-gray-700">
            <li
              id="email"
              data-uname="todaysAuctionEmailbutton"
              data-doctitle="Today's auctions"
            >
              <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="flex items-center hover:text-red-600 transition"
              >
                <FaEnvelope className="mr-1" />
                Email
              </button>
            </li>
          </ul>
        </div>
      </div>

    
      <div className="max-w-4xl mt-6 text-gray-600 text-base leading-relaxed text-justify">
            <p>
                Check out Today’s Auctions to see what auctions are taking place today.
                You can sort these auctions by sale time, location and even see how many
                vehicles are in the auction before you join. Make sure you check the Sales
                Highlights to see if there is anything extra special about any of our{' '}
                <Link to="/" className="underline text-red-600 hover:text-red-800">
                Online Auctions
                </Link>, or if there is some important information to be aware of.
            </p>
        </div>


     
     {showEmailForm && ( 
        <div className="max-w-xl mt-6 bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Send Email</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                className="w-full px-4 py-2 border rounded h-24 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
                placeholder="Write your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-yellow-400 text-gray-800 font-semibold px-6 py-2 rounded hover:bg-yellow-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
