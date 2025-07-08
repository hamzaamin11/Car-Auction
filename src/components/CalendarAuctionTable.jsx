
import React from 'react';

export default function CalendarAuctionTable({ showTime }) {
  const auctionData = [
    {
        date: "12/05/2025",
        day: "Monday",
        time: "02:00 PM", 
        locations: [],
    },
    {
        date: "13/05/2025",
        day: "Tuesday",
        time: "", 
        locations: ["Abbottabad", "karachi", "Lahore", "Islamabd"],
    },
    {
        date: "14/05/2025",
        day: "Wednesday",
        time: "", 
        locations: ["Faislabad", "Gujranwala", "Gujrat", "Peshawar"],
    },
    {
        date: "15/05/2025",
        day: "Thursday",
        time: "", 
        locations: ["Multan", "Quetta", "Swat"],
    },
    {
        date: "16/05/2025",
        day: "Friday",
        time: "04:00 PM", 
        locations: ["Lahore", "Bahawalpur", "Sindh"],
    },
    {
        date: "17/05/2025",
        day: "Saturday",
        time: "04:30 PM", 
        locations: [],
    },
    {
        date: "18/05/2025",
        day: "Sunday",
        time: "04:30 PM", 
        locations: [],
    },
    {
      date: "19/05/2025",
      day: "Monday",
      time: "02:00 PM",
      locations: ["Bristol", "Newbury"],
    },
    {
      date: "20/05/2025",
      day: "Tuesday",
      time: "02:00 PM",
      locations: ["Rochford", "Sandy"],
    },
    {
      date: "21/05/2025",
      day: "Wednesday",
      time: "02:00 PM",
      locations: ["Belfast", "Gloucester"],
    },
    {
      date: "22/05/2025",
      day: "Thursday",
      time: "02:00 PM",
      locations: ["Sandwich", "Westbury"],
    },
    {
      date: "23/05/2025",
      day: "Friday",
      time: "02:00 PM",
      locations: ["Bristol", "Colchester"],
    },
    {
      date: "24/05/2025",
      day: "Saturday",
      time: "02:00 PM",
      locations: ["Heavy Equipment", "Sandy"],
    },
    {
      date: "25/05/2025",
      day: "Sunday",
      time: "02:00 PM",
      locations: ["Belfast", "Newbury", "Rochford", "Sandwich"],
    },
  ];

  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full border-collapse rounded-xl overflow-hidden shadow-md">
        <thead className="bg-[#b73439] text-white text-left text-sm sm:text-base">
          <tr>
            <th className="px-4 py-3">Date</th>
            {showTime && <th className="px-4 py-3">Auction Time (PKT)</th>}
            <th className="px-4 py-3">Day</th>
            <th className="px-4 py-3">Auction Locations</th>
          </tr>
        </thead>
        <tbody className="bg-white text-gray-700 divide-y">
          {auctionData.map((auction, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium">{auction.date}</td>
               {showTime && <td className="px-4 py-3">{auction.time}</td>}
              <td className="px-4 py-3">{auction.day}</td>
              <td className="px-4 py-3">
                <ul className="list-disc list-inside space-y-1">
                  {auction.locations.map((location, idx) => (
                    <li key={idx}>{location}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
