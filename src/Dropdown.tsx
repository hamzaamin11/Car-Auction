// src/components/Dropdown.tsx
import React from "react";
import Select, { StylesConfig } from "react-select";

export interface DropdownOption {
  label: string;
  value: string | number;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: DropdownOption | null;
  onChange: (option: DropdownOption | null) => void;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
}

const customStyles: StylesConfig<DropdownOption, false> = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#1E3A8A" : "#9CA3AF",
    borderWidth: "1px",
    borderRadius: "0.375rem",
    boxShadow: state.isFocused ? "0 0 0 1px #1E3A8A" : "none",
    padding: "0.25rem",
    backgroundColor: "white",
    minHeight: "42px",
    "&:hover": {
      borderColor: state.isFocused ? "#1E3A8A" : "#6B7280",
    },
  }),

  valueContainer: (provided) => ({
    ...provided,
    padding: "0 8px",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "#424242",
    fontWeight: "500",
  }),

  // THIS IS KEY: Force placeholder color
  placeholder: (provided) => ({
    ...provided,
    color: "#9CA3AF", // gray-400
    fontSize: "0.875rem",
  }),

  menu: (provided) => ({
    ...provided,
    borderRadius: "0.375rem",
    marginTop: "4px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #E5E7EB",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#DBEAFE"
      : state.isFocused
      ? "#EFF6FF"
      : "white",
    color: "#000000",
    padding: "8px 12px",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    cursor: "pointer",
  }),

  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#6B7280",
    "&:hover": { color: "#1E3A8A" },
  }),
};

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  isSearchable = false,
  className = "",
}) => {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isSearchable={isSearchable}
      styles={customStyles}
      className={`w-full ${className}`}
      classNamePrefix="react-select"
      // This ensures placeholder is always shown when value is null/empty
      isClearable={false}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: "#1E3A8A",
          primary25: "#EFF6FF",
          primary50: "#DBEAFE",
          neutral20: "#9CA3AF", // fallback border
        },
      })}
    />
  );
};

export default Dropdown;