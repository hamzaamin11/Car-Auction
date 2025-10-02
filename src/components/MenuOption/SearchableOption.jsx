import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchableOption({
  options,
  placeholder = "Select an option...",
  onSelect,
  setActiveTab,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // <-- keyboard navigation ke liye
  const navigate = useNavigate();

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Select handler
  const handleSelect = (option) => {
    onSelect(option?.label);
    setSearchTerm(option.label);
    setIsOpen(false);
    setHighlightedIndex(-1); // reset highlight
  };

  // Keyboard handler
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <input
        type="text"
        value={searchTerm}
        placeholder={placeholder}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(-1); // reset navigation
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        onKeyDown={handleKeyDown} // <-- keyboard events
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      {/* Dropdown List */}
      {isOpen && (
        <ul
          style={{
            position: "absolute",
            width: "100%",
            background: "#fff",
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: "250px",
            overflowY: "auto",
            margin: 0,
            padding: 0,
            listStyle: "none",
            zIndex: 10,
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                  backgroundColor:
                    index === highlightedIndex ? "#f5f5f5" : "#fff", // highlight on arrow
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseLeave={() => setHighlightedIndex(-1)}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li style={{ padding: "8px", color: "#999" }}>No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default SearchableOption;
