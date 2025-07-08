import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const CarSelectionForm = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedMake, setSelectedMake] = useState("Audi");
  const [selectedModel, setSelectedModel] = useState("Q2");
  const [selectedVersion, setSelectedVersion] = useState("1.0 TFSI Standard Line");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const options = [
    "Just want to check Information",
    "2 weeks",
    "1 Month",
    "2 Months"
  ];
  const [buyOption, setBuyOption] = useState(options[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const cities = ["All Cities", "Abbottabad", "Abdul Hakeem", "Bahawalpur", "Chakwal", "Chenab Nagar", "Dera Gazi Khan", "Dera ismail Khan", "Faisalabad", "Gujranwala", "Gujrat", "Hyderabad", "Islamabad", "Jehlum", "Karachi", "Lahore", "Madina", "Mardan", "Mirpur Khas", "Multan", "Peshawar", "Rahim Yar Khan", "Rawalpindi", "Sahiwal", "Sargodha", "Sialkot", "Sakhar"];
  const makes = ["Audi", "Toyota", "SuzPakistani"];
  const models = {
    Audi: ["Q2", "A4"],
    Toyota: ["Corolla", "Yaris"],
    SuzPakistani: ["Mehran", "Alto"]
  };
  const versions = {
    Q2: ["1.0 TFSI Standard Line", "1.0 TFSI Exclusive Line"],
    A4: ["2.0 Premium", "2.0 Elite"],
    Corolla: ["Altis", "XLI"],
    Yaris: ["1.3 GLi", "1.5 Ativ"],
    Mehran: ["VX", "VXR"],
    Alto: ["VX", "VXL"]
  };

  const handleMakeSelect = (make) => {
    setSelectedMake(make);
    const firstModel = models[make]?.[0] || "";
    setSelectedModel(firstModel);
    setSelectedVersion(versions[firstModel]?.[0] || "");
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setSelectedVersion(versions[model]?.[0] || "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCity) {
      navigate(`/OnRoadPriceCalculator/${selectedCity.toLowerCase()}`);
    } else {
      alert("Please select a city before proceeding.");
    }
  };

  return (
    <div className="flex justify-center items-center px-4 py-12 bg-[#f4f6fa] min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white shadow-2xl p-10 space-y-8"
      >
        <h4 className="text-2xl font-bold text-left text-gray-800 mb-6 tracking-wide">
          Car Details
        </h4>
  
      
        <div className="flex flex-col sm:flex-row items-center mb-4">
          <label className="w-full sm:w-48 text-sm font-semibold text-gray-700 mb-2 sm:mb-0">
            I want to buy in*:
          </label>
          <div className="w-full sm:flex-1 relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-800 cursor-pointer"
            >
              {buyOption}
            </div>
            {showDropdown && (
              <ul className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg w-full">
                {options.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      setBuyOption(option);
                      setShowDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-[#e6f0ff] cursor-pointer transition duration-200"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
  
      
        <div className="flex flex-col sm:flex-row items-center mb-4">
          <label className="w-full sm:w-48 text-sm font-semibold text-gray-700 mb-2 sm:mb-0">
            Select City:
          </label>
          <div className="w-full sm:flex-1 relative">
            <div
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="w-full border text-sm border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-800 cursor-pointer"
            >
              {selectedCity || "-- Select City --"}
            </div>
            {showCityDropdown && (
              <ul className="absolute z-10 mt-1 text-sm w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {cities.map((city) => (
                  <li
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setShowCityDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-[#e6f0ff] cursor-pointer transition duration-200"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
  
        <div className="flex flex-col sm:flex-row items-center mb-4">
          <label className="w-full sm:w-48 text-sm font-semibold text-gray-700 mb-2 sm:mb-0">
            Car Details:
          </label>
          <div className="w-full sm:flex-1 relative">
            <input
              type="text"
              value={`${selectedMake} / ${selectedModel} / ${selectedVersion}`}
              onClick={() => setIsModalOpen(true)}
              readOnly
              className="w-full border border-gray-300 rounded-xl px-4 py-3 cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#233d7b]"
            />
          </div>
        </div>
  
      
        <div className="text-center">
          <button
            type="submit"
            className="inline-block bg-[#233d7b] text-white px-8 py-3 font-semibold shadow-md opacity-90 hover:opacity-100 transition"
          >
            Get on Road Price
          </button>
        </div>
  
        <hr className="my-6 border-t border-gray-300" />
  
      
        <p className="text-left text-gray-600 text-sm">
          We at PakWheels respect your privacy and shall never reveal your contact details on the website.
          By providing these details on PakWheels.com you agree, we or our partner dealers may get in touch
          with you on the phone to provide you further information and assist you with any transaction.
        </p>
  
      
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-5xl rounded-3xl shadow-xl p-8 relative">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Select Make, Model & Version
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
  
             
                <div>
                  <h4 className="text-md font-semibold mb-2 text-blue-700">Make</h4>
                  <ul className="space-y-2">
                    {makes.map((make) => (
                      <li
                        key={make}
                        onClick={() => handleMakeSelect(make)}
                        className={`cursor-pointer px-4 py-3 rounded-lg transition font-medium ${
                          selectedMake === make
                            ? "bg-blue-100 border border-[#233d7b] text-blue-800"
                            : "hover:bg-[#e6f0ff]"
                        }`}
                      >
                        {make}
                      </li>
                    ))}
                  </ul>
                </div>
  
          
                <div>
                  <h4 className="text-md font-semibold mb-2 text-green-700">Model</h4>
                  <ul className="space-y-2">
                    {(models[selectedMake] || []).map((model) => (
                      <li
                        key={model}
                        onClick={() => handleModelSelect(model)}
                        className={`cursor-pointer px-4 py-3 rounded-lg transition font-medium ${
                          selectedModel === model
                            ? "bg-green-100 border border-green-500 text-green-800"
                            : "hover:bg-[#eafff1]"
                        }`}
                      >
                        {model}
                      </li>
                    ))}
                  </ul>
                </div>
  
                <div>
                  <h4 className="text-md font-semibold mb-2 text-yellow-700">Version</h4>
                  <ul className="space-y-2">
                    {(versions[selectedModel] || []).map((version) => (
                      <li
                        key={version}
                        onClick={() => setSelectedVersion(version)}
                        className={`cursor-pointer px-4 py-3 rounded-lg transition font-medium ${
                          selectedVersion === version
                            ? "bg-yellow-100 border border-yellow-500 text-yellow-800"
                            : "hover:bg-[#fff9e6]"
                        }`}
                      >
                        {version}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
  
              <div className="mt-8 text-center">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#233d7b] text-white px-8 py-2 hover:bg-[#1c2f5f] transition rounded-lg"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
  
};

export default CarSelectionForm;
