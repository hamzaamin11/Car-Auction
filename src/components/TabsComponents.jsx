import React, { useState } from "react";

const TabsComponents = ({ selectedPrice }) => {
  const [activeTab, setActiveTab] = useState("tab1");

  console.log("inner Component", selectedPrice);

  const tabs = [
    { id: "tab1", path: "#CarOverview" },
    { id: "tab2", path: "#price-block", label: "Price" },
    { id: "tab3", path: "#version-colors", label: "Colors" },
    { id: "tab4", path: "#specs", label: "Specifications & Features" },
    { id: "tab5", path: "#faqs", label: "FAQ's" },
  ];

  const handleTabClick = (id, path) => {
    setActiveTab(id);
    const section = document.querySelector(path);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-gray-100 px-4 py-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 justify-center md:justify-start">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.path)}
            className={`px-4 py-2 text-sm font-medium rounded transition duration-300 
              ${
                activeTab === tab.id
                  ? "bg-[#233D7B] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
          >
            {tab?.label ||
              (selectedPrice && `${selectedPrice.model} ${selectedPrice.make} ${selectedPrice.engine}`)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabsComponents;
