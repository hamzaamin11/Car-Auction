import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link, useNavigate } from "react-router-dom";

const AuctionTabs = () => {
  const [activeTab, setActiveTab] = useState("BodyType");

  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 12;

  const navigate = useNavigate();

  const tabData = {
    budgets: [
      { label: "5–10 Lac", value: 750000 },
      { label: "10–20 Lac", value: 1500000 },
      { label: "20–30 Lac", value: 2500000 },
      { label: "30–40 Lac", value: 3500000 },
      { label: "40–50 Lac", value: 4500000 },
      { label: "50–60 Lac", value: 5500000 },
      { label: "60–80 Lac", value: 7000000 },
      { label: "80 Lac – 1 Crore", value: 9000000 },
      { label: "1 Crore – 1.5 Crore", value: 12500000 },
      { label: "1.5 Crore – 2 Crore", value: 17500000 },
    ],

    BodyType: [
      { name: "Mini Vehicles", image: "/images/mini.svg" },
      { name: "Van", image: "/images/van.svg" },
      { name: "Truck", image: "/images/truck.svg" },
      { name: "SUV", image: "/images/suv.svg" },
      { name: "Subcompact hatchback", image: "/images/subcompact.svg" },
      { name: "Station Wagon", image: "/images/station.svg" },
      { name: "Single Cabin", image: "/images/single.svg" },
      { name: "Sedan", image: "/images/sedan.svg" },
      { name: "Pick Up", image: "/images/pickup.svg" },
      { name: "Off-Road Vehicles", image: "/images/offroad.svg" },
      { name: "MPV", image: "/images/mpv.svg" },
      { name: "Compact hatchback", image: "/images/compact.avif" },
      { name: "Mini Van", image: "/images/minivan.svg" },
      { name: "Micro Van", image: "/images/micro.svg" },
      { name: "High Roof", image: "/images/highroof.svg" },
      { name: "Hatchback", image: "/images/hatchback.svg" },
      { name: "Double Cabin", image: "/images/double.svg" },
      { name: "Crossover", image: "/images/crossover.svg" },
      { name: "Coupe", image: "/images/coupe.svg" },
      { name: "Convertible", image: "/images/convertible.svg" },
      { name: "Compact SUV", image: "/images/compactsuv.svg" },
      { name: "Compact sedan", image: "/images/compactsedan.svg" },
    ],
  };
  const totalPages =
    activeTab === "BodyType"
      ? Math.ceil(tabData.BodyType.length / itemsPerPage)
      : 1;

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const paginatedItems =
    activeTab === "BodyType"
      ? tabData.BodyType.slice(
          currentPage * itemsPerPage,
          (currentPage + 1) * itemsPerPage
        )
      : tabData[activeTab];

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-6 border-b pb-2">
        {Object.keys(tabData).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(0);
            }}
            className={`py-2 px-4 font-semibold border-b-2 ${
              activeTab === tab
                ? "border-[#c90107] text-[#c90107]"
                : "border-transparent text-gray-500 hover:text-[#c90107]"
            } transition duration-200`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        className={
          activeTab === "BodyType"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            : "grid grid-cols-2 md:grid-cols-4 gap-4"
        }
      >
        {activeTab === "BodyType"
          ? paginatedItems.map((item, index) => (
              <div
                onClick={() => navigate(`/filterprice/${item.name}`)}
                key={index}
                className="text-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-18 object-contain rounded shadow"
                />
                <p className="mt-2 text-gray-700 font-medium">{item.name}</p>
              </div>
            ))
          : paginatedItems.map((text, index) => (
              <div
                onClick={() => navigate(`/filterprice/${text.value}`)}
                key={index}
                className="text-gray-700 hover:text-[#c90107] underline transition duration-150"
              >
                {text.label}
              </div>
            ))}
      </div>

      {activeTab === "BodyType" && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="w-[100px] text-white px-4 py-2 bg-[#b73439] rounded hover:[#b73439] disabled:hidden"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className="w-[100px] px-4 py-2 bg-[#518ecb] text-white rounded hover:bg-[#518ecb] disabled:hidden"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AuctionTabs;
