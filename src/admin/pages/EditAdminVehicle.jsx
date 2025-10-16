import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../components/Contant/URL";
import { useSelector } from "react-redux";
import Select from "react-select";
import CarSelector from "../../components/CarSelector";
import axios from "axios";
import Swal from "sweetalert2";

const bodyStyles = [
  "Convertible",
  "Coupe",
  "Crossover",
  "Hatchback",
  "Minivan",
  "Pickup Truck",
  "Sedan",
  "Station Wagon",
  "SUV",
  "Van",
];

const carColors = [
  "White",
  "Black",
  "Silver",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Brown",
  "Beige",
  "Gold",
  "Maroon",
  "Purple",
  "Pink",
  "Turquoise",
];

function EditAdminVehicle({
  open,
  setOpen,
  selectedVehicle,

  onVehicleUpdated,
}) {
  const initialVehicleState = {
    userId: "",
    vin: "",
    year: "",
    make: "",
    model: "",
    series: "",
    bodyStyle: "",
    engine: "",
    transmission: "",
    driveType: "",
    fuelType: "",
    color: "",
    mileage: "",
    vehicleCondition: "",
    keysAvailable: "",
    locationId: "",
    saleStatus: "",
    auctionDate: "",
    buyNowPrice: "",
    certifyStatus: "",
    image: null,
  };

  const [vehicle, setVehicle] = useState(initialVehicleState);
  const selected = useSelector((state) => state.carSelector);
  console.log("vehicleData", selectedVehicle);

  const parsePrice = (priceStr) => {
    if (!priceStr) return "";

    // ✅ hamesha string me convert karo
    const str = priceStr.toString().toLowerCase();

    // Agar "Lac" likha ho
    if (str.includes("lac")) {
      const num = parseFloat(str);
      return num * 100000; // 1 Lac = 100000
    }

    // Agar "Crore" likha ho
    if (str.includes("crore")) {
      const num = parseFloat(str);
      return num * 10000000; // 1 Crore = 10000000
    }

    // Warna number nikal lo (commas, symbols hata ke)
    const parsed = parseFloat(str.replace(/[^0-9.]/g, ""));
    return isNaN(parsed) ? "" : parsed;
  };

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [allCities, setAllCities] = useState([]);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedVehicle) {
      setVehicle({
        vin: selectedVehicle.vin || "",
        year: selectedVehicle.year || "",
        make: selectedVehicle.make || "",
        model: selectedVehicle.model || "",
        series: selectedVehicle.series || "",
        bodyStyle: selectedVehicle.bodyStyle || "",
        engine: selectedVehicle.engine || "",
        transmission: selectedVehicle.transmission || "",
        driveType: selectedVehicle.driveType || "",
        fuelType: selectedVehicle.fuelType || "",
        color: selectedVehicle.color || "",
        mileage: selectedVehicle.mileage || "",
        vehicleCondition: selectedVehicle.vehicleCondition || "",
        keysAvailable: selectedVehicle.keysAvailable || "",
        locationId: selectedVehicle.locationId || "",
        cityName: selectedVehicle.cityName || "", // ✅ yeh add karo
        saleStatus: selectedVehicle.saleStatus || "",
        auctionDate: selectedVehicle.auctionDate || "",
        buyNowPrice: parsePrice(selectedVehicle.buyNowPrice) || "",
        certifyStatus: selectedVehicle.certifyStatus || "",
        image: selectedVehicle.image || null,
      });

      console.log("selectedVehicle", selectedVehicle);

      // Set image preview if image exists
      if (selectedVehicle.image) {
        setImagePreview(selectedVehicle.image);
      }
    }
  }, [selectedVehicle]);

  const { user } = useAuth();

  const [selectedCount, setSelectedCount] = useState(0);

  const [price, setPrice] = useState(vehicle?.buyNowPrice || "");

  useEffect(() => {
    if (vehicle?.buyNowPrice) {
      setPrice(String(vehicle.buyNowPrice)); // ✅ sync initial value
    }
  }, [vehicle]);

  // Indian Numbering System function
  const numberToIndianWords = (num) => {
    if (!num) return "";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const twoDigits = (n) => {
      if (n < 20) return ones[n];
      const t = Math.floor(n / 10);
      const o = n % 10;
      return tens[t] + (o ? " " + ones[o] : "");
    };

    const threeDigits = (n) => {
      const h = Math.floor(n / 100);
      const r = n % 100;
      return (h ? ones[h] + " Hundred " : "") + (r ? twoDigits(r) : "");
    };

    let words = "";

    if (Math.floor(num / 10000000) > 0) {
      words += numberToIndianWords(Math.floor(num / 10000000)) + " Crore ";
      num %= 10000000;
    }

    if (Math.floor(num / 100000) > 0) {
      words += numberToIndianWords(Math.floor(num / 100000)) + " Lac ";
      num %= 100000;
    }

    if (Math.floor(num / 1000) > 0) {
      words += numberToIndianWords(Math.floor(num / 1000)) + " Thousand ";
      num %= 1000;
    }

    if (num > 0) {
      words += threeDigits(num);
    }

    return words.trim();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedCount(files.length); // kitni images select hui hain
    handleAddedImage(e); // aapka existing handler call karna
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setVehicle((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create preview for new image
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setVehicle((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleIsOpenToggle = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleSearchable = (selectedOption) => {
    setVehicle((prev) => ({
      ...prev,
      locationId: selectedOption.value,
    }));
  };

  const handleGetAllCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`);

      setAllCities(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cityData = [
    { label: "Select City", value: "" },
    ...(allCities?.map((city) => ({
      label: city.cityName,
      value: city.id,
    })) || []),
  ];

  useEffect(() => {
    handleGetAllCities();
  }, [open]);
  const handleUpdateCarInfo = () => {
    handleIsOpenToggle("selector");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("userId", selectedVehicle.userId);

    // Append all fields to formData
    Object.entries(vehicle).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== "id") {
        formData.append(key, value);
      }
    });

    try {
      const response = await fetch(
        `${BASE_URL}/seller/updateVehicle/${selectedVehicle?.id}`,
        {
          method: "PUT",
          body: formData, // Send the FormData directly
          // Don't set Content-Type header - let the browser set it with boundary
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update vehicle");
      }

      const data = await response.json();
      await Swal.fire({
        title: "Success!",
        text: "Vehicle Added successfully",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
      onVehicleUpdated();
      setOpen(false);
      setLoading(false);
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-30 px-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 rounded-lg relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Vehicle</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-red-700 text-3xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>

            <Select
              onChange={handleSearchable}
              options={cityData}
              value={
                cityData.find(
                  (option) =>
                    String(option.value) === String(vehicle?.locationId)
                ) || null
              }
              isClearable
            />

            <div>
              <label className=" block text-sm font-medium text-gray-700 my-1">
                Car Info <span className="text-red-500">*</span>
              </label>
              <input
                onClick={handleUpdateCarInfo}
                value={`${vehicle?.year || ""} ${vehicle?.make || ""} ${
                  vehicle?.model || ""
                } ${vehicle?.series || ""}`}
                placeholder="Year/Make/Model/Version"
                readOnly
                className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                  vehicle.year &&
                  vehicle.make &&
                  vehicle.model &&
                  vehicle.series
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200"
                }`}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Drive Type<span className="text-red-500">*</span>
              </label>

              <select
                name="driveType"
                value={vehicle.driveType}
                onChange={handleChange}
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              >
                <option value="">Select Drive Type</option>
                <option value="fwd">FWD (Front-Wheel Drive)</option>
                <option value="rwd">RWD (Rear-Wheel Drive)</option>
                <option value="awd">AWD (All-Wheel Drive)</option>
                <option value="4wd">4WD (Four-Wheel Drive)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Body Style <span className="text-red-500">*</span>
              </label>

              <select
                name="bodyStyle"
                value={vehicle.bodyStyle}
                onChange={handleChange}
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              >
                <option value={""}>Please Select BodyStyle</option>

                {bodyStyles?.map((body) => (
                  <option id={body} value={body}>
                    {body}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Transmission Type<span className="text-red-500">*</span>
              </label>

              <select
                name="transmission"
                value={vehicle?.transmission || ""}
                onChange={handleChange}
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              >
                <option value={""}>Please Select Transmission Type</option>
                <option value={"Automatic"}>Automatic</option>
                <option value={"Manual"}>Manual</option>
              </select>
            </div>

            <div>
              <label className=" block text-sm font-medium text-gray-700 mb-1">
                Vehicle Meter Reading<span className="text-red-500">*</span>
              </label>
              <input
                name="mileage"
                value={vehicle?.mileage || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 7) {
                    handleChange(e);
                  }
                }}
                placeholder="Meter Reading(KM)"
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Color <span className="text-red-500">*</span>
              </label>

              <select
                name="color"
                value={vehicle.color || ""}
                onChange={handleChange}
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              >
                <option value={""}>Please Select Color</option>

                {carColors?.map((color) => (
                  <option id={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Fuel Type<span className="text-red-500">*</span>
              </label>
              <select
                name="fuelType"
                value={vehicle.fuelType}
                onChange={handleChange}
                placeholder="Fuel Type"
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              >
                <option value="">Select Fuel Type</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="cng">CNG (Compressed Natural Gas)</option>
                <option value="lpg">LPG (Liquefied Petroleum Gas)</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Condition<span className="text-red-500">*</span>
              </label>

              <select
                name="vehicleCondition"
                value={vehicle.vehicleCondition}
                onChange={handleChange}
                placeholder="Vehicle Condition"
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              >
                <option value="">Select Vehicle Condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="accidented">Accidented</option>
              </select>
            </div>

            <div>
              <label className=" block text-sm font-medium text-gray-700 mb-1">
                Add Vehicle Price <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="buyNowPrice"
                value={parsePrice(vehicle.buyNowPrice)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 9) {
                    setPrice(value); // Local state update
                    handleChange(e); // Parent handler call
                  }
                }}
                placeholder="Add Price"
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
              {price && (
                <p className="mt-2 text-sm text-red-500 font-semibold">
                  {numberToIndianWords(parseInt(price))}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certified Status <span className="text-red-500">*</span>
            </label>

            <select
              name="certifyStatus"
              value={vehicle.certifyStatus}
              onChange={handleChange}
              placeholder="Certify Status"
              className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            >
              <option value="">Please Select Certify Status</option>
              <option value="Certified">Certified</option>
              <option value="Non-Certified">NonCertified</option>
            </select>
          </div>

          {/* Image Upload */}

          {<img src={vehicle} />}

          {/* Submit Button */}
          <div className="col-span-1 sm:col-span-2 mt-4">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Images <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="vehicleImage"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5.002 5.002 0 0115.9 6H16a5 5 0 010 10h-1m-4 4v-8m0 0l-3 3m3-3l3 3"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium text-indigo-600">
                        Click to upload
                      </span>
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG (Max 5MB each)
                    </p>
                    <p className="text-xs text-gray-400 px-2">
                      You can add maximum 5 images and first image will be used
                      as front on the card
                    </p>

                    {/* Selected images count show karega */}
                    {selectedCount > 0 && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        {selectedCount} image
                        {selectedCount > 1 ? "s" : ""} selected
                      </p>
                    )}
                  </div>

                  <input
                    id="vehicleImage"
                    type="file"
                    multiple
                    name="image"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-950 text-white px-5 py-2 rounded-lg shadow-md hover:cursor-pointer"
              >
                {loading ? "loading..." : "Submit Vehicle"}
              </button>
            </div>
          </div>
          {isOpen === "selector" && (
            <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
              <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg relative">
                <CarSelector
                  handleIsOpenToggle={() => handleIsOpenToggle("")}
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditAdminVehicle;
