
import React, { useState } from "react";
import CustomDropdown from "../CustomDropdown";

const WheelBidzAlert: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const options = [
    { label: "Car", value: "car" },
    { label: "Truck", value: "truck" },
    { label: "SUV", value: "suv" },
    { label: "Motorcycle", value: "motorcycle" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) {
      alert("Please select a vehicle type");
      return;
    }
    alert(`WheelBidz alert set for: ${selectedOption}`);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-900">
        WheelBidz Vehicle Alert
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CustomDropdown
          options={options}
          value={selectedOption}
          onChange={setSelectedOption}
          placeholder="Select Vehicle Type"
        />

        <button
          type="submit"
          className="w-full bg-blue-900 text-white font-medium py-2 rounded-md hover:bg-blue-800 transition"
        >
          Set Alert
        </button>
      </form>
    </div>
  );
};

export default WheelBidzAlert;
