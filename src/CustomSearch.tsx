import React from "react";
import { Search } from "lucide-react";

interface CustomSearchProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const CustomSearch: React.FC<CustomSearchProps> = ({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm 
                   placeholder-gray-400 text-black placeholder:text-xs sm:placeholder:text-sm 
                   focus:outline-none focus:ring-2 focus:ring-blue-900"
      />
    </div>
  );
};

export default CustomSearch;
