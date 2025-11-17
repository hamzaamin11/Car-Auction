import React from "react";
import Select from "react-select";
import { ChevronDown } from "lucide-react";

// Your exact same beautiful styling
const customSelectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: "white",
    borderColor: state.isFocused ? "#1E3A8A" : "#000000",
    boxShadow: state.isFocused ? "0 0 0 1px #1E3A8A" : "none",
    "&:hover": { borderColor: "#1E3A8A" },
    borderRadius: "0.5rem",
    padding: "2px 4px",
    cursor: "pointer",
    minHeight: "42px",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#DBEAFE" : state.isFocused ? "#EFF6FF" : "white",
    color: "#000000",
    cursor: "pointer",
    fontWeight: state.isSelected ? 600 : 400,
  }),
  placeholder: (provided: any) => ({ ...provided, color: "#9CA3AF" }),
  singleValue: (provided: any) => ({ ...provided, color: "#000000" }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "0.5rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
    zIndex: 9999,
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    padding: 4,
    color: state.isFocused ? "#1E3A8A" : "#9CA3AF",
    "&:hover": { color: "#1E3A8A" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

type Option = { label: string; value: string };

interface CustomDropdownProps {
  options?: Option[];
  datas?: Option[];
  value: Option | string | null;
  name?: string;
  placeholder?: string;
  onChange: (value: any) => void;
  isSearchable?: boolean;
  label?: string;
  isDisabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  datas,
  value,
  name,
  placeholder = "Select an option",
  onChange,
  isSearchable = true,
  label,
  isDisabled = false,
}) => {
  const allOptions = options || datas || [];

  // Convert string value → full option object for react-select
  const selectedOption =
    typeof value === "string" && value
      ? allOptions.find((opt) => opt.value === value) || null
      : (value as Option | null);

  // This is the ONLY important part for perfect clear behavior
  const handleChange = (selected: Option | null) => {
    if (name) {
      // React Hook Form or any form library
      onChange({
        target: {
          name,
          value: selected ? selected.value : "",   // ← clears with empty string
        },
      });
    } else {
      // Normal useState usage
      onChange(selected); // ← this sends null → perfect clear
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <Select
        options={allOptions}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={true}           // ← must be true
        isDisabled={isDisabled}
        styles={customSelectStyles}
        components={{
          DropdownIndicator: () => (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          ),
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
};

export default CustomDropdown;