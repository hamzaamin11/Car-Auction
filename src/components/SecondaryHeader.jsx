import React, { useState } from 'react';
import { FaSearch, FaGlobe, FaCheck } from 'react-icons/fa';
import { countries } from './countries';

const SecondaryHeader = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Here, you can integrate your filtering logic using searchQuery
  };

  return (
    <div className="bg-[#2e2e2e] px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-md">
      <div className="flex items-center gap-6 order-2 lg:order-1">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-500 rounded-md bg-[#3a3a3a] text-white text-sm hover:bg-[#4a4a4a] transition duration-200 shadow-sm"
          >
            <FaGlobe />
            {selectedCountry ? selectedCountry.name : 'Global Locations'}
          </button>

          {dropdownOpen && (
            <ul className="absolute left-0 bg-white border border-gray-300 shadow-xl mt-2 z-50 w-64 max-h-64 overflow-y-auto rounded-md text-sm animate-fade-in">
              {countries
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((country, index) => (
                  <li
                    key={index}
                    onClick={() => handleCountrySelect(country)}
                    className="px-4 py-2 hover:bg-gray-100 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span className="flex items-center">
                      <span className="mr-2">{country.flag}</span> {country.name}
                    </span>
                    {selectedCountry?.name === country.name && (
                      <FaCheck className="text-green-500" />
                    )}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-gray-300 hover:underline text-sm transition duration-200"
        >
          Help
        </a>
      </div>

      <form onSubmit={handleSearch} className="w-full lg:w-1/2 order-1 lg:order-2">
        <div className="flex items-center border border-gray-500 rounded-full overflow-hidden bg-[#3a3a3a] transition-all duration-200 shadow-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-transparent outline-none text-white text-sm placeholder-gray-300"
            placeholder="Search Cars by models, make, and locations.........."
          />
          <button type="submit" className="px-4 py-2 text-white hover:text-blue-400 transition">
            <FaSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecondaryHeader;
