import React, { useState } from "react";
import Select from "react-select";
import { ChevronDown } from "lucide-react";

// 🎨 Consistent Blue-950 Focus + Black Border + Black Text Theme
const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "white",
    borderColor: state.isFocused ? "#1E3A8A" : "#000000", //  Blue-950 on focus, black default
    boxShadow: state.isFocused ? "0 0 0 1px #1E3A8A" : "none",
    "&:hover": {
      borderColor: "#1E3A8A",
    },
    borderRadius: "0.5rem",
    padding: "2px 4px",
    cursor: "pointer",
  }),

  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#DBEAFE" // light blue for selected
      : state.isFocused
      ? "#EFF6FF" // lighter blue hover
      : "white",
    color: "#000000", //  Black text for all options
    cursor: "pointer",
    fontWeight: state.isSelected ? 600 : 400,
  }),

  placeholder: (provided: any) => ({
    ...provided,
    color: "#9CA3AF",
  }),

  singleValue: (provided: any) => ({
    ...provided,
    color: "#000000", //  Black text for selected value
  }),

  menu: (provided: any) => ({
    ...provided,
    borderRadius: "0.5rem",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    zIndex: 50,
  }),

  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    padding: 4,
    color: state.isFocused ? "#1E3A8A" : "#9CA3AF",
    "&:hover": {
      color: "#1E3A8A",
    },
    transition: "transform 0.2s ease",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),
};

interface CustomDropdownProps {
  datas?: { label: string; value: string }[];
  options?: { label: string; value: string }[];
  value: { label: string; value: string } | string | null;
  name?: string;
  placeholder?: string;
  onChange: (option: any) => void;
  isSearchable?: boolean;
  label?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  datas,
  options,
  value,
  name,
  placeholder = "Select an option",
  onChange,
  isSearchable = true,
  label,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleSelect = (selectedOption: any) => {
    setSelectedValue(selectedOption);
    if (name) {
      onChange({
        target: { name, value: selectedOption?.value || "" },
      });
    } else {
      onChange(selectedOption);
    }
  };

  const mergedOptions = options || datas || [];

  const formattedValue =
    typeof value === "string"
      ? mergedOptions.find((opt) => opt.value === value) || null
      : value;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <Select
          options={mergedOptions}
          value={formattedValue}
          onChange={handleSelect}
          placeholder={placeholder}
          isSearchable={isSearchable}
          styles={customSelectStyles}
          components={{
            DropdownIndicator: () => (
              <ChevronDown
                size={16}
                className="w-4 h-4 text-gray-500 transition-transform duration-200"
              />
            ),
            IndicatorSeparator: () => null,
          }}
        />
      </div>
    </div>
  );
};

export default CustomDropdown;
