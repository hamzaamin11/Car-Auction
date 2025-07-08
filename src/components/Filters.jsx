
import React from "react";

const options = {
  vehicle: ["Car", "Bike", "Truck"],
  model: ["Model A", "Model B", "Model C"],
  make: ["Audi", "BMW", "Toyota"],
  year: ["2023", "2022", "2021"],
  city: ["Lahore", "Karachi", "Islamabad"],
  province: ["Punjab", "Sindh", "KPK"],
};

export default function Filters({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      {Object.keys(options).map((key) => (
        <div key={key}>
          <label className="block mb-1 font-semibold capitalize">{key}</label>
          <select
            name={key}
            value={filters[key]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select {key}</option>
            {options[key].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
