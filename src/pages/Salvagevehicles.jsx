import React, {Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon, ChevronDownIcon } from '@heroicons/react/20/solid';




const SalvageVehicles = () => {
  const makes = [
    'Toyota',
    'Honda',
    'Ford',
    'BMW',
    'Mercedes',
    'Audi',
    'Hyundai',
    'Kia',
    'Nissan',
    'Chevrolet',
  ];
  const vehicleTypes = [
    'All Types',
    'Agricultural',
    'Boats',
    'Caravan',
    'Commercial Under 7.5T',
    'HGV',
    'Jet Ski',
    'RV',
    'Vehicles Under 7.5T',
  ];
  const damageOptions = [
    'All Damage Types',
    'Minor Dents/Scratches',
    'Normal Wear',
    'All Over',
    'Burn',
    'Burn-Engine',
    'Frame Damage Reported',
    'Front End',
    'Hail',
    'Mechanical',
    'Roll Over',
    'Side',
    'Top/Roof',
  ];
  const categories = [
    "All Categories",
    "CAT B-Breaker(1943)",
    "CAT C-New(13)",
    "CAT U-Used Unrecorded(2747)",
    "CAT X-Stolen Recovered Minimal Damage(117)",
    "N Reapairable Non Structural(3925)",
    "S Repairable Structure(4075)"
  ];
  const models = [
    "Tesla Model Y",
    "Toyota RAV4/Wildlander",
    "Honda Cr-v/Breeze",
    "Toyota Corolla/Levin sedon",
    "Toyota Corolla Cross/Frontlander",
    "Toyota Camry",
    "Ford F-150",
    "Toyota Hilux",
    "Nissan Sentra",
    "Tesla Model 3"
  ]
  
  
  
  
  const [activeTab, setActiveTab] = useState("buyNow");
  const [sixTab, setSixTab] = useState("featured items");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('All Makes');
  const [odometer, setOdometer] = useState(0);
  const [selectedOption, setSelectedOption] = useState("location");
  const navigate = useNavigate();
  const [selectedVehicleType, setSelectedVehicleType] = useState('All Types');
  const [searchTermVehicleType, setSearchTermVehicleType] = useState('');
  const [isOpenVehicleType, setIsOpenVehicleType] = useState(false);
  const [selected, setSelected] = useState(damageOptions[0]);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [selectedModel, setSelectedModel] = useState("All Models");


  

  const filteredVehicleTypes = vehicleTypes.filter((type) =>
    type.toLowerCase().includes(searchTermVehicleType.toLowerCase())
  );

  const handleSelectVehicleType = (type) => {
    setSelectedVehicleType(type);
    setIsOpenVehicleType(false);
    setSearchTermVehicleType('');
  };

  
  const filteredMakes = makes.filter((make) =>
    make.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (make) => {
    setSelectedMake(make);
    setIsOpen(false);
    setSearchTerm('');
  };
  const toggleDropdown = () => setIsOpenCategory(!isOpenCategory);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsOpenCategory(false);
  };
  const toggleModelDropdown = () => setIsOpenModel(!isOpenModel);

const handleModelSelect = (model) => {
  setSelectedModel(model);
  setIsOpenModel(false);
};

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => 1990 + i);

  
  const bottomTabLinks = {
    "featured items": ["Featured Cars (270)", "Vehicles for Auctions (11,048)", "High Value items (69)", "Buy it Now (826)", "New Listings (3160)",  "Pure Sale items (6073)", "Runs and Drives (8477)", "Fleet/Lease(2245)", "Repossessions (162)"],
    "make": ["Audi (593)", "BMW (664)", "Chevrolet (13)", "Citroen (463)", "Fiat (262)", "Ford (1691)", "Honda (319)", "Hyundai (390)", "Jaguar (125)", "Kia(302)", "Land Rover (260)", "Mazda (197)", "Mercedes (563)", "Mini (232)",
        "Mitsubishi (110)", "Nissan (642)", "Peugeot (628)", "Porsche (32)", "Renault (427)", "Rover (2)", "Seat (238)", "Skoda (209)", "SuzPakistani (138)", "Toyota (495)",
    "Vauxhall (1236)", "Volkswagen (915)", "Volve (149)", "Yamaha (19)"],
    "vehicle types": ["SUV", "Sedan", "Hatchback", "Coupe", "Convertibel", "Pickup", "Van", "Minivan", "Wagon", "Crossover", "Truck", "Other"],
    "category": ["CAT B-Breakers", "CAT N-New", "CAT S-New", "CAT U-Used Unrecorded"],
    "primary damage": [
      "All Over (72)",
      "Burn (66)",
      "Burn - Engine (43)",
      "Burn - Interior (14)",
      "Front End (6,468)",
      "Hail (1)",
      "Mechanical (670)",
      "Minor Dents/Scratches (467)",
      "Missing/Altered VIN (43)",
      "Normal Wear (37)",
      "Partial/Incomplete (1)",
      "Parts (12)",
      "Previous Repair (27)",
      "Rear End (1,953)",
      "Replaced VIN (4)",
      "Rollover (43)",
      "Side (1,865)",
      "Stripped (52)",
      "Top/Roof (66)",
      "Undercarriage (278)",
      "Vandalism (104)",
      "Water/Flood (67)"
    ],
    
    "graded vehicles": ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
  };

  return (
    <div className="flex flex-col lg:flex-row p-8 gap-10 bg-gray-50 rounded-lg shadow-md">
      
     
      
      <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow space-y-6">
        <h2 className="text-2xl font-bold text-gray-600">Vehicle Finder</h2>

       
        <div className="flex space-x-2">
          {["All", "Used", "New"].map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold ${
                activeTab === tab.toLowerCase()
                  ? "bg-[#c90107] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

     
        <div className="space-y-4">

        
        <div className="relative w-full max-w-sm">
            <label className="block text-sm font-medium mb-1 text-gray-700">Vehicle Type</label>
            <div
              onClick={() => setIsOpenVehicleType(!isOpenVehicleType)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white cursor-pointer flex justify-between items-center focus:ring-[#c90107] focus:border-gray-700"
            >
              <span>{selectedVehicleType}</span>
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {isOpenVehicleType && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md">
                <input
                  type="text"
                  placeholder="Search vehicle type..."
                  className="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none"
                  value={searchTermVehicleType}
                  onChange={(e) => setSearchTermVehicleType(e.target.value)}
                />
                <ul className="max-h-48 overflow-y-auto text-sm">
                  {filteredVehicleTypes.length > 0 ? (
                    filteredVehicleTypes.map((type, idx) => (
                      <li
                        key={idx}
                        className={`p-2 hover:bg-red-100 cursor-pointer ${
                          selectedVehicleType === type ? 'bg-red-50 font-medium' : ''
                        }`}
                        onClick={() => handleSelectVehicleType(type)}
                      >
                        {type}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500 text-center">No match found</li>
                  )}
                </ul>
              </div>
            )}
          </div>


        
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Odometer (Miles)</label>

            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>{odometer} Miles</span> 
              <span>250,000+ Miles</span>
            </div>

            <input
              type="range"
              min="0"
              max="250000"
              value={odometer}
              onChange={(e) => setOdometer(e.target.value)}
              className="w-full accent-[#c90107]"
            />
          </div>
        
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Year</label>
            <select className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#c90107] focus:border-gray-500">
              {years.map((year) => (
                <option className="p-2 hover:bg-red-100 cursor-pointer" key={year}>{year}</option>
              ))}
            </select>
          </div>

         
          <div className="w-full">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Label className="block text-sm font-medium mb-1 text-gray-700">
            Damage Type
          </Listbox.Label>
          <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500">
            <span className="block truncate">{selected}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {damageOptions.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-red-100 text-gray-900' : 'text-gray-900'
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>

     
          <div className="relative w-full max-w-sm">
      <label className="block text-sm font-medium mb-1 text-gray-700">All Makes</label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border border-gray-300 rounded-md p-2 text-sm bg-white cursor-pointer flex justify-between items-center"
      >
        <span>{selectedMake}</span>
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 text-sm border-b border-gray-200 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="max-h-40 overflow-y-auto text-sm">
            <li
              className={`p-2 hover:bg-red-100 cursor-pointer ${
                selectedMake === 'All Makes' ? 'bg-red-50 font-medium' : ''
              }`}
              onClick={() => handleSelect('All Makes')}
            >
              All Makes
            </li>
            {filteredMakes.length > 0 ? (
              filteredMakes.map((make, idx) => (
                <li
                  key={idx}
                  className={`p-2 hover:bg-red-100 cursor-pointer ${
                    selectedMake === make ? 'bg-red-50 font-medium' : ''
                  }`}
                  onClick={() => handleSelect(make)}
                >
                  {make}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500 text-center">No match found</li>
            )}
          </ul>
        </div>
      )}
    </div>
    <div
      className={`relative full category-dropdown ${
        isOpenCategory ? "open" : ""
      }`}
    >
       <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
      
      <button
        onClick={toggleDropdown}
        className="dropdown-trigger w-full flex justify-between items-center bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm text-gray-700 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-haspopup="listbox"
        aria-expanded={isOpenCategory}
      >
        <span className="selected-category">{selectedCategory}</span>
        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
      </button>

      {isOpenCategory && (
        <ul
          className="dropdown-menu categories absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm"
          role="listbox"
        >
          {categories.map((category, index) => (
            <li
              key={index}
              onClick={() => handleCategorySelect(category)}
              className={`dropdown-item px-4 py-2 cursor-pointer ${
                selectedCategory === category
                  ? "selected bg-red-50 text-gray-600 font-semibold"
                  : "hover:bg-red-100"
              }`}
              role="option"
              aria-selected={selectedCategory === category}
            >
              {category}
            </li>
          ))}
        </ul>
      )}
    </div>

    <div
      className={`relative full model-dropdown ${
        isOpenModel ? "open" : ""
      }`}
    >
       <label className="block text-sm font-medium mb-1 text-gray-700">Model</label>
      
      <button
        onClick={toggleModelDropdown}
        className="dropdown-trigger w-full flex justify-between items-center bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm text-gray-700 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        aria-haspopup="listbox"
        aria-expanded={isOpenModel}
      >
        <span className="selected-category">{selectedModel}</span>
        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
      </button>

      {isOpenModel && (
        <ul
          className="dropdown-menu categories absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm"
          role="listbox"
        >
          {models.map((model, index) => (
            <li
              key={index}
              onClick={() => handleModelSelect(model)}
              className={`dropdown-item px-4 py-2 cursor-pointer ${
                selectedModel === model
                  ? "selected bg-red-50 text-gray-600 font-bold"
                  : "hover:bg-red-100"
              }`}
              role="option"
              aria-selected={selectedModel === model}
            >
              {model}
            </li>
          ))}
        </ul>
      )}
    </div>


         
          <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
      <div className="flex items-center gap-4 text-sm mb-2">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="location"
            value="location"
            checked={selectedOption === "location"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          Location
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            name="location"
            value="postal"
            checked={selectedOption === "postal"}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          Postal Code
        </label>
      </div>

      {selectedOption === "location" ? (
        <select className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-[#c90107] focus:border-gray-500">
          <option>All Locations</option>
          <option>California</option>
          <option>Texas</option>
          <option>Florida</option>
        </select>
      ) : (
        <input
          type="text"
          placeholder="Enter Postal Code"
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-yellow-500 focus:border-blue-500"
        />
      )}
    </div>

    
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Lot #</label>
            <input
              type="text"
              placeholder="Enter Lot Number"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

        </div>

       
        <button className="w-full bg-[#ffbf00] hover:bg-yellow-600 text-white py-2 mt-4 rounded-md text-sm font-semibold">
          Search Vehicles
        </button>
      </div>
      
      <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow space-y-6">
  <h2 className="text-2xl font-bold text-gray-800">Select Your Vehicle Condition</h2>
  <p className="text-gray-600">
    Looking for vehicles in a specific condition? Simplify your search by selecting a category to narrow your results.
  </p>

 
  <div className="flex flex-wrap gap-6 mb-4">
    <button
      onClick={() => navigate("/Allvehicles")}
      className="flex-1 min-w-[140px] max-w-[200px] flex flex-col items-center gap-1 text-gray-600 border border-gray-600 p-4 hover:bg-blue-50 hover:shadow-md transition-all"
    >
      <img src="/AllVehicles.jpg" alt="All Vehicles" className="w-full h-20 object-cover" />
      <span className="text-sm font-bold text-center">All Vehicles</span>
    </button>
    <button
      onClick={() => navigate("/Salvagevehicles")}
      className="flex-1 min-w-[140px] max-w-[200px] flex flex-col items-center gap-1 text-gray-600 border border-gray-600 p-4 hover:bg-blue-50 hover:shadow-md transition-all"
    >
      <img src="/salvage.jpg" alt="New Vehicles" className="w-full h-20 object-cover" />
      <span className="text-sm font-bold text-center">New Vehicles</span>
    </button>
    <button
      onClick={() => navigate("/Usedvehicles")}
      className="flex-1 min-w-[140px] max-w-[200px] flex flex-col items-center gap-1 text-gray-600 border border-gray-600 p-4 hover:bg-blue-50 hover:shadow-md transition-all"
    >
      <img src="/used.jpg" alt="Used Vehicles" className="w-full h-20 object-cover" />
      <span className="text-sm font-bold text-center">Used Vehicles</span>
    </button>
  </div>

  <h3 className="text-xl font-bold text-gray-800">All Used & New Vehicles</h3>
  <p className="text-gray-600">
    Browse our wide selection of used and New vehicles in auction daily, by using the Vehicle Finder on this page, or by selecting the categories below. New inventory arrives daily, so check back often!
  </p>


  <div className="flex flex-wrap gap-2 mb-6">
    {Object.keys(bottomTabLinks).map((tab) => (
      <button
        key={tab}
        onClick={() => setSixTab(tab)}
        className={`px-4 py-2 rounded-md text-sm font-bold ${
          sixTab === tab ? "bg-[#c90107] text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>

 
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
    {bottomTabLinks[sixTab]?.map((item, i) => (
      <span
        key={i}
        className="text-gray-700 hover:text-[#c90107] underline text-sm cursor-pointer"
      >
        {item}
      </span>
    ))}
  </div>
</div>

    </div>
  );
};

export default SalvageVehicles;
