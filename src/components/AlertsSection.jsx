import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, ChevronUpDownIcon, ChevronDownIcon } from '@heroicons/react/20/solid';

const AlertsSection = () => {
  const [selectedVehicleType, setSelectedVehicleType] = useState('All Types');
  const [searchTermVehicleType, setSearchTermVehicleType] = useState('');
  const [isOpenVehicleType, setIsOpenVehicleType] = useState(false);
  const searchYears = Array.from({ length: 30 }, (_, i) => 2025 - i);
  const [yearFrom, setYearFrom] = useState(searchYears[10]); 
  const [yearTo, setYearTo] = useState(searchYears[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('All Makes');
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [selectedModel, setSelectedModel] = useState("All Models");
  const [isOpenFrequency, setIsOpenfrequency] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState('Daily');
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('include');

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
  ];
  const frequencies = [
    "Daily",
    "Weekly",
  ];
  const categories = [
    "include",
    "exclude",
  ];

  const [formData, setFormData] = useState({
    email: '',
    typeOfVehicleObj: 'All Types',
    firstname: '',
    lastname: '',
    agree: false,
  });

  const filteredVehicleTypes = vehicleTypes.filter((type) =>
    type.toLowerCase().includes(searchTermVehicleType.toLowerCase())
  );

  const handleSelectVehicleType = (type) => {
    setSelectedVehicleType(type);
    setFormData({ ...formData, typeOfVehicleObj: type });
    setIsOpenVehicleType(false);
    setSearchTermVehicleType('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleYearChange = (from, to) => {
    if (to < from) {
      alert('Year To should be equal or greater than Year From.');
    }
  };
  const filteredMakes = makes.filter((make) =>
    make.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (make) => {
    setSelectedMake(make);
    setIsOpen(false);
    setSearchTerm('');
  };
  const toggleModelDropdown = () => setIsOpenModel(!isOpenModel);

const handleModelSelect = (model) => {
  setSelectedModel(model);
  setIsOpenModel(false);
};
const toggleFrequencyDropdown = () => setIsOpenfrequency(!isOpenFrequency);

const handleFrequencySelect = (frequency) => {
  setSelectedFrequency(frequency);
  setIsOpenfrequency(false);
}
const toggleCategoryDropdown = () => setIsOpenCategory(!isOpenCategory);

const handleCategorySelect = (category) => {
  setSelectedCategory(category);
  setIsOpenCategory(false);
}

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    // You can add API submission logic here
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 p-8 rounded-lg shadow-md">
      <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
  <h2 className="text-2xl text-gray-600 font-bold mb-6 mt-6">
    Don’t see the vehicle you want? Sign up for Chaudhry Car Auctions Vehicle Alerts.
  </h2>
  <p className="mb-6 text-1xl text-gray-500">
    Vehicle Alerts are emails notifying you of the latest vehicles we add to our inventory based on what you're looking for.
  </p>
  <p className='mb-6 text-1xl text-gray-500'>
    You can cancel alerts at any time or change the frequency to suit your needs. You can also set up as many alerts as you want.
  </p>
  <p className='mb-6 text-1xl text-gray-500'>
    By signing up for Vehicle Alerts, you are consenting to receive Vehicle Alert emails. To unsubscribe from a Vehicle Alert email, click the unsubscribe link within the footer of the email.
  </p>
  <p className='mb-6 text-1xl text-gray-500'>
    Please note, that if you wish to unsubscribe from all Vehicle Alerts you have set up, you will need to unsubscribe from each one individually.
  </p>

 
  <img
    src="/alertmessage.jpg" 
    alt="Vehicle Alerts"
    className="w-full h-auto rounded-md shadow-md mt-10"
  />
</div>


      <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-inner">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="your@example.com"
            />
          </div>

         
          <div className="relative w-full">
            <label className="block text-sm font-medium mb-1 text-gray-700">Vehicle Types</label>
            <div
              onClick={() => setIsOpenVehicleType(!isOpenVehicleType)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm bg-white cursor-pointer flex justify-between items-center"
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
                <ul className="max-h-48 overflow-y-auto text-sm text-gray-600">
                  {filteredVehicleTypes.length > 0 ? (
                    filteredVehicleTypes.map((type, idx) => (
                      <li
                        key={idx}
                        className={`p-2 hover:bg-red-100 cursor-pointer ${selectedVehicleType === type ? 'bg-red-50 font-medium' : ''}`}
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

       
          <div className="flex flex-wrap items-center space-x-4 p-4">
            <div className="flex flex-col w-40">
              <label htmlFor="yearFrom" className="mb-1 text-sm font-medium text-gray-700">From Year</label>
              <select
                id="yearFrom"
                value={yearFrom}
                onChange={(e) => {
                  setYearFrom(Number(e.target.value));
                  handleYearChange(Number(e.target.value), yearTo);
                }}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {searchYears.map((year) => (
                  <option key={year} 
                  value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col w-40">
              <label htmlFor="yearTo" className="mb-1 text-sm font-medium text-gray-700">To Year</label>
              <select
                id="yearTo"
                value={yearTo}
                onChange={(e) => {
                  setYearTo(Number(e.target.value));
                  handleYearChange(yearFrom, Number(e.target.value));
                }}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {searchYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="relative w-full">
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
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              required
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              required
              value={formData.lastname}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Enter your last name"
            />
          </div>
          <div
          className={`relative full frequency-dropdown ${
            isOpenFrequency ? "open" : ""
          }`}
        >
           <label className="block text-sm font-medium mb-1 text-gray-700">Frequency</label>
          
          <button
            onClick={toggleFrequencyDropdown}
            className="dropdown-trigger w-full flex justify-between items-center bg-white border border-gray-300 px-4 py-2 rounded-md shadow-sm text-gray-700 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-haspopup="listbox"
            aria-expanded={isOpenFrequency}
          >
            <span className="selected-frequency">{selectedFrequency}</span>
            <ChevronDownIcon className="w-5 h-5 text-gray-500" />
          </button>
    
          {isOpenFrequency && (
            <ul
              className="dropdown-menu categories absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto text-sm"
              role="listbox"
            >
              {frequencies.map((frequency, index) => (
                <li
                  key={index}
                  onClick={() => handleFrequencySelect(frequency)}
                  className={`dropdown-item px-4 py-2 cursor-pointer ${
                    selectedFrequency === frequency
                      ? "selected bg-red-50 text-gray-600 font-bold"
                      : "hover:bg-red-100"
                  }`}
                  role="option"
                  aria-selected={selectedFrequency === frequency}
                >
                  {frequency}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className={`relative full category-dropdown ${
            isOpenCategory ? "open" : ""
          }`}
        >
           <label className="block text-sm font-medium mb-1 text-gray-700">Category B Vegicles</label>
          
          <button
            onClick={toggleCategoryDropdown}
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
                      ? "selected bg-red-50 text-gray-600 font-bold"
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

        
          <div className="flex items-start">
            <input
              type="checkbox"
              name="agree"
              id="agree"
              checked={formData.agree}
              onChange={handleChange}
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="agree" className="ml-2 text-sm text-gray-900">
              Yes, I consent to Chaudhry Cars Auction Limited sending me Vehicle Alert emails. I may cancel the sending of the Vehicle Alerts at any time using unsubscribe function in emails.
            </label>
          </div>

          
          <div className="w-full">
            <Link
              to="/register"
              className="w-full block text-center bg-yellow-400 text-black font-semibold py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Sign Up
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AlertsSection;
