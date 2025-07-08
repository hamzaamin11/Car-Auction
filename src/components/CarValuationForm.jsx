import React, { useState } from "react";

const CarValuationForm = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    version: "",
    year: "",
    mileage: "",
    engineType: "",
    engineCapacity: "",
    transmission: "",
    assembly: "",
    registeredCity: "",
  });

  const [carDetails, setCarDetails] = useState(null);
  const [warning, setWarning] = useState("");

  const makeOptions = ["Suzuki", "Toyota", "Honda", "Daihatsu", "Nissan", "Hyundai", "KIA", "Mitsubishi", "Changan",
  "Mercedes Benz", "Haval", "MG", "Audi", "BMW", "Mazda", "FAW", "Lexus", "JAC", "DFSK", "Prince", "Proton", "Peugeot", 
  "Subaru", "Chevrolet"];
  const modelOptions = {
    Toyota: ["Corolla", "C-HR", "Vitz", "Yaris Sedan", "Corolla Cross HEV", "Fortuner", "Land Cruiser"],
    Honda: ["Civic", "BR-V", "City", "Accord", "HR-V", "Vezel"],
    Suzuki: ["Alto", "Vitara", "Cultus", "Swift", "Wagon R"],
    Daihatsu: ["YRV", "Mira", "Taft"],
  };
  const versionOptions = {
    Corolla: ["GL_i", "Altis"],
  };
  const engineTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];
  const transmissions = ["Automatic", "Manual"];
  const assemblies = ["Local", "Imported"];
  const cities = ["Lahore", "Karachi", "Islamabad", "Peshawar"];
  const years = Array.from({ length: 26 }, (_, i) => 2000 + i);

  // Handle select change with validation for year first
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "make" || name === "model" || name === "version") &&
      !formData.year
    ) {
      setWarning("Please select the model year first");
      return;
    } else {
      setWarning("");
    }

    let newFormData = { ...formData, [name]: value };

    // If year is reset, clear make, model, version
    if (name === "year" && value === "") {
      newFormData = {
        ...newFormData,
        make: "",
        model: "",
        version: "",
      };
      setWarning("");
    }

    if (name === "make") {
      newFormData.model = "";
      newFormData.version = "";
    }
    if (name === "model") {
      newFormData.version = "";
    }

    setFormData(newFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.year) {
      setWarning("Please select the model year first");
      return;
    }

    const key = `${formData.make}_${formData.model}_${formData.version}_${formData.year}`;
    const carDatabase = {
      "Toyota_Corolla_GL_i_2021": {
        price: "3,200,000 PKR",
        image: "https://example.com/toyota_corolla.jpg",
      },
      "Honda_Civic_VTi_2020": {
        price: "3,500,000 PKR",
        image: "https://example.com/honda_civic.jpg",
      },
    };

    const result = carDatabase[key];

    if (result) {
      setCarDetails({ ...result, contact: "0312-1234567" });
    } else {
      setCarDetails({
        price: "Price estimate not found.",
        image: "https://via.placeholder.com/400x200?text=No+Image",
        contact: "0312-1234567",
      });
    }
  };

  
  const selectBgColor = "#f9fafb"; 
  const selectDisabledBgColor = "#e2e8f0"; 
  const optionBgColor = "#ffffff"; 
  const optionHoverBgColor = "#7b8397"; 

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg font-sans">
      <h1 className="text-3xl font-extrabold text-[#233d7b] text-left mb-2">
        Used Car Price Calculator
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Get a realistic price estimate of a used car based on extensive market research.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

       
        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Model Year
          </label>
          <select
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            style={{ backgroundColor: selectBgColor }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b] focus:border-[#233d7b]"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option
                key={year}
                value={year}
                style={{ backgroundColor: optionBgColor }}
                onMouseOver={e => e.target.style.backgroundColor = optionHoverBgColor}
                onMouseOut={e => e.target.style.backgroundColor = optionBgColor}
              >
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Make */}
        <div>
          <label
            htmlFor="make"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Make
          </label>
          <select
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            disabled={!formData.year}
            style={{
              backgroundColor: formData.year
                ? selectBgColor
                : selectDisabledBgColor,
              cursor: formData.year ? "pointer" : "not-allowed",
            }}
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b] focus:border-[#233d7b]"
            required
          >
            <option value="">Select Make</option>
            {makeOptions.map((make) => (
              <option
                key={make}
                value={make}
                style={{ backgroundColor: optionBgColor }}
                onMouseOver={(e) => (e.target.style.backgroundColor = optionHoverBgColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = optionBgColor)}
              >
                {make}
              </option>
            ))}
          </select>
          {!formData.year && (
            <p className="mt-1 text-sm text-red-600 font-semibold">
              Please select the model year first
            </p>
          )}
        </div>

       
        <div>
          <label
            htmlFor="model"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Model
          </label>
          <select
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            disabled={!formData.make}
            style={{
              backgroundColor: formData.make
                ? selectBgColor
                : selectDisabledBgColor,
              cursor: formData.make ? "pointer" : "not-allowed",
            }}
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b] focus:border-[#233d7b]"
            required
          >
            <option value="">Select Model</option>
            {(modelOptions[formData.make] || []).map((model) => (
              <option
                key={model}
                value={model}
                style={{ backgroundColor: optionBgColor }}
                onMouseOver={(e) => (e.target.style.backgroundColor = optionHoverBgColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = optionBgColor)}
              >
                {model}
              </option>
            ))}
          </select>
          {!formData.year && (
            <p className="mt-1 text-sm text-red-600 font-semibold">
              Please select the model year first
            </p>
          )}
        </div>

        {/* Version */}
        <div>
          <label
            htmlFor="version"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Version
          </label>
          <select
            id="version"
            name="version"
            value={formData.version}
            onChange={handleChange}
            disabled={!formData.model}
            style={{
              backgroundColor: formData.model
                ? selectBgColor
                : selectDisabledBgColor,
              cursor: formData.model ? "pointer" : "not-allowed",
            }}
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b] focus:border-[#233d7b]"
            required
          >
            <option value="">Select Version</option>
            {(versionOptions[formData.model] || []).map((version) => (
              <option
                key={version}
                value={version}
                style={{ backgroundColor: optionBgColor }}
                onMouseOver={(e) => (e.target.style.backgroundColor = optionHoverBgColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = optionBgColor)}
              >
                {version}
              </option>
            ))}
          </select>
          {!formData.year && (
            <p className="mt-1 text-sm text-red-600 font-semibold">
              Please select the model year first
            </p>
          )}
        </div>

      
        <div>
          <label
            htmlFor="mileage"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mileage (km)
          </label>
          <input
            type="text"
            id="mileage"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            min="0"
            required
            placeholder="Enter mileage"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b] focus:border-[#233d7b]"
          />
        </div>

   
        <div>
          <label
            htmlFor="engineType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Engine Type
          </label>
          <select
            id="engineType"
            name="engineType"
            value={formData.engineType}
            onChange={handleChange}
            required
            style={{ backgroundColor: selectBgColor }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b] focus:border-[#233d7b]"
          >
            <option value="">Select Engine Type</option>
            {engineTypes.map((et) => (
              <option
                key={et}
                value={et}
                style={{ backgroundColor: optionBgColor }}
                onMouseOver={(e) => (e.target.style.backgroundColor = optionHoverBgColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = optionBgColor)}
              >
                {et}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="engineCapacity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Engine Capacity (cc)
          </label>
          <input
            type="text"
            id="engineCapacity"
            name="engineCapacity"
            value={formData.engineCapacity}
            onChange={handleChange}
            min="0"
            required
            placeholder="Enter engine capacity"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b] focus:border-[#233d7b]"
          />
        </div>

     
        <div>
          <label
            htmlFor="transmission"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Transmission
          </label>
          <select
            id="transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            required
            style={{ backgroundColor: selectBgColor }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b] focus:border-[#233d7b]"
          >
            <option value="">Select Transmission</option>
            {transmissions.map((tr) => (
              <option
                key={tr}
                value={tr}
                style={{ backgroundColor: optionBgColor }}
                onMouseOver={(e) => (e.target.style.backgroundColor = optionHoverBgColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = optionBgColor)}
              >
                {tr}
              </option>
            ))}
          </select>
        </div>

       
        <div>
          <label
            htmlFor="assembly"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Assembly
          </label>
          <select
            id="assembly"
            name="assembly"
            value={formData.assembly}
            onChange={handleChange}
            required
            style={{ backgroundColor: selectBgColor }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b] focus:border-[#233d7b]"
          >
            <option value="">Select Assembly</option>
            {assemblies.map((as) => (
              <option
                key={as}
                value={as}
                style={{ backgroundColor: optionBgColor }}
                onMouseOver={(e) => (e.target.style.backgroundColor = optionHoverBgColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = optionBgColor)}
              >
                {as}
              </option>
            ))}
          </select>
        </div>

      
        <div>
          <label
            htmlFor="registeredCity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Registered City
          </label>
          <select
            id="registeredCity"
            name="registeredCity"
            value={formData.registeredCity}
            onChange={handleChange}
            required
            style={{ backgroundColor: selectBgColor }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#233d7b] focus:border-[#233d7b]"
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option
                key={city}
                value={city}
                style={{ backgroundColor: optionBgColor }}
                onMouseOver={(e) => (e.target.style.backgroundColor = optionHoverBgColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = optionBgColor)}
              >
                {city}
              </option>
            ))}
          </select>
        </div>

   
        <div className="text-center">
          <button
            type="submit"
            className="bg-[#b73439] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#518ecb] transition-colors"
          >
            Get Valuation
          </button>
        </div>
      </form>

      {/* Result */}
      {carDetails && (
        <div className="mt-10 p-6 bg-indigo-50 border border-indigo-300 rounded-md">
          <h2 className="text-xl font-bold text-indigo-700 mb-3">
            Car Valuation Result:
          </h2>
          <img
            src={carDetails.image}
            alt="Car"
            className="mx-auto rounded-md shadow-md mb-4 max-h-48 object-contain"
          />
          <p className="text-lg font-semibold mb-2">Estimated Price: {carDetails.price}</p>
          <p className="text-indigo-600 font-medium">
            Contact: {carDetails.contact}
          </p>
        </div>
      )}

      {/* Warning for selecting year first if applicable */}
      {warning && (
        <p className="mt-4 text-center text-red-700 font-semibold">{warning}</p>
      )}
    </div>
  );
};

export default CarValuationForm;
