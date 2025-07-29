import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TabsSection = () => {
  const [activeTab, setActiveTab] = useState("City");

  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 12;

  const tabData = {
    City: [
      "Karachi",
      "Lahore",
      "Islamabad",
      "Rawalpindi",
      "Peshawar",
      "Faisalabad",
      "Multan",
      "Gujranwala",
      "Sialkot",
      "Hyderabad",
      "Sargodha",
      "Abbottabad",
      "Quetta",
      "Bahawalpur",
      "Wah Cantt",
      "Gujrat",
      "Mardan",
      "Rahim Yar Khan",
      "Sahiwal",
      "Attock",
      "Chakwal",
      "Okara",
      "Sheikhupura",
      "Jhelum",
      "Mansehra",
      "Swabi",
      "Mandi",
      "bahauddin",
      "Haripur",
      "Jhang",
      "Taxila",
    ],
    Make: [
      { name: "Suzuki", image: "/images/Suzuki.png" },
      { name: "Toyota", image: "/images/Tyota.png" },
      { name: "Honda", image: "/images/Honda.png" },
      { name: "Daihatsu", image: "/images/daihatsu.png" },
      { name: "Nissan", image: "/images/Nisan.png" },
      { name: "Hyundai", image: "/images/hyundai.png" },
      { name: "KIA", image: "/images/kia.png" },
      { name: "Mitsubishi", image: "/images/Mitsubishi.png" },
      { name: "Changan", image: "/images/changan.png" },
      { name: "Mercedes Benz", image: "/images/mercedes.png" },
      { name: "Haval", image: "/images/haval.png" },
      { name: "MG", image: "/images/MG.png" },
      { name: "Audi", image: "/images/Audi.png" },
      { name: "BMW", image: "/images/BMW.png" },
      { name: "Mazda", image: "/images/mazda.png" },
      { name: "FAW", image: "/images/FAW.png" },
      { name: "Lexus", image: "/images/Lexus.png" },
      { name: "JAC", image: "/images/jac.png" },
      { name: "DFSK", image: "/images/DFSK.png" },
      { name: "Prince", image: "/images/prince.png" },
      { name: "Proton", image: "/images/proton.png" },
      { name: "Peugeot", image: "/images/peugeot.png" },
      { name: "Subaru", image: "/images/Subaro.png" },
      { name: "Chevrolet", image: "/images/Chevrolet.png" },
    ],
    Model: [
      "Corolla",
      "Civic",
      "Mehran",
      "Alto",
      "Cultus",
      "City",
      "Wagon R",
      "Vitz",
      "Mira",
      "Bolan",
      "Swift",
      "Prado",
      "Passo",
      "Vezel",
      "Raize",
      "Sportage",
      "Hilux",
      "Cuore",
      "Land",
      "Cruiser",
      "Aqua",
      "Prius",
      "Yaris",
      "Sedan",
      "Khyber",
      "Dayz",
      "Santro",
      "Fortuner",
      "H6",
      "Yaris",
      "Hatchback",
      "Tucson",
      "Move",
    ],
  };

  const imageTabs = ["Make"];

  const isImageTab = imageTabs.includes(activeTab);

  const navigate = useNavigate();

  const totalPages = isImageTab
    ? Math.ceil(tabData[activeTab].length / itemsPerPage)
    : 1;

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const paginatedItems = isImageTab
    ? tabData[activeTab].slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      )
    : tabData[activeTab];

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
          isImageTab
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            : "grid grid-cols-2 md:grid-cols-4 gap-2"
        }
      >
        {isImageTab
          ? paginatedItems.map((item, index) => (
              <div
                onClick={() => navigate(`/filterprice/${item.name}`)}
                key={index}
                className={
                  isImageTab
                    ? "text-center bg-white p-2 rounded shadow-sm mx-auto sm:w-[90%] md:w-[85%] lg:w-[80%] transition-all duration-200"
                    : ""
                }
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-18 sm:h-14 object-contain mx-auto"
                  />
                ) : (
                  <span
                    // onClick={() => navigate(`/userCar$`)}
                    className="text-gray-700 hover:text-[#c90107] underline transition duration-150"
                  >
                    {item}
                  </span>
                )}
                <p className="mt-2 text-gray-700 text-sm sm:text-base font-medium">
                  {item.name}
                </p>
              </div>
            ))
          : paginatedItems.map((text, index) => (
              <span
                onClick={() => navigate(`/filterprice/${text}`)}
                key={index}
                className="text-gray-700 hover:text-[#c90107] hover:cursor-pointer underline transition duration-150"
              >
                {text}
              </span>
            ))}
      </div>

      {isImageTab && (
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

export default TabsSection;
