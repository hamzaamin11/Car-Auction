import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../components/Contant/URL";
import { useSelector } from "react-redux";
import Select from "react-select";
import Dropdown from "../../Dropdown"; // ← your custom dropdown
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

  const parsePrice = (priceStr) => {
    if (!priceStr) return "";
    const str = priceStr.toString().toLowerCase();
    if (str.includes("lac")) return parseFloat(str) * 100000;
    if (str.includes("crore")) return parseFloat(str) * 10000000;
    const parsed = parseFloat(str.replace(/[^0-9.]/g, ""));
    return isNaN(parsed) ? "" : parsed;
  };

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [allCities, setAllCities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [price, setPrice] = useState("");

  /* ----------------------------------------------------- */
  /*  Load vehicle data (unchanged)                        */
  /* ----------------------------------------------------- */
  useEffect(() => {
    if (selectedVehicle) {
      const parsed = parsePrice(selectedVehicle.buyNowPrice);
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
        cityName: selectedVehicle.cityName || "",
        saleStatus: selectedVehicle.saleStatus || "",
        auctionDate: selectedVehicle.auctionDate || "",
        buyNowPrice: parsed || "",
        certifyStatus: selectedVehicle.certifyStatus || "",
        image: selectedVehicle.image || null,
      });
      setPrice(String(parsed || ""));
      if (selectedVehicle.image) setImagePreview(selectedVehicle.image);
    }
  }, [selectedVehicle]);

  /* ----------------------------------------------------- */
  /*  CarSelector → vehicle (unchanged)                    */
  /* ----------------------------------------------------- */
  useEffect(() => {
    if (
      selected?.year ||
      selected?.make ||
      selected?.model ||
      selected?.series
    ) {
      setVehicle((prev) => ({
        ...prev,
        year: selected?.year || prev.year,
        make: selected?.make || prev.make,
        model: selected?.model || prev.model,
        series: selected?.series || prev.series,
      }));
    }
  }, [selected]);

  useEffect(() => {
    if (vehicle?.buyNowPrice) setPrice(String(vehicle.buyNowPrice));
  }, [vehicle]);

  const numberToIndianWords = (num) => {
    /* unchanged – omitted for brevity */
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedCount(files.length);
    const file = files[0];
    setVehicle((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setVehicle((prev) => ({ ...prev, [name]: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setVehicle((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleIsOpenToggle = (active) => {
    if (active === "" && selected) {
      setVehicle((prev) => ({
        ...prev,
        year: selected?.year || prev.year,
        make: selected?.make || prev.make,
        model: selected?.model || prev.model,
        series: selected?.series || prev.series,
      }));
    }
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleSearchable = (selectedOption) => {
    setVehicle((prev) => ({
      ...prev,
      locationId: selectedOption ? selectedOption.value : "",
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
    ...(allCities?.map((city) => ({ label: city.cityName, value: city.id })) ||
      []),
  ];

  useEffect(() => {
    if (open) handleGetAllCities();
  }, [open]);

  const handleUpdateCarInfo = () => handleIsOpenToggle("selector");

  /* ----------------------------------------------------- */
  /*  Submit – unchanged                                   */
  /* ----------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = {
      locationId: "City",
      year: "Year",
      make: "Make",
      model: "Model",
      series: "Series",
      driveType: "Drive Type",
      bodyStyle: "Body Style",
      transmission: "Transmission Type",
      mileage: "Meter Reading",
      color: "Color",
      fuelType: "Fuel Type",
      vehicleCondition: "Vehicle Condition",
      buyNowPrice: "Price",
      certifyStatus: "Certified Status",
    };
    const missing = Object.entries(requiredFields)
      .filter(([k]) => !vehicle[k] || vehicle[k] === "")
      .map(([, v]) => v);
    if (missing.length) {
      await Swal.fire({
        title: "Warning",
        text: `Please fill in: ${missing.join(", ")}.`,
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("userId", selectedVehicle.userId);
    Object.entries(vehicle).forEach(([k, v]) => {
      if (v !== null && v !== undefined && k !== "id") formData.append(k, v);
    });
    try {
      const res = await fetch(
        `${BASE_URL}/seller/updateVehicle/${selectedVehicle?.id}`,
        { method: "PUT", body: formData }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed");
      }
      await Swal.fire({
        title: "Success!",
        text: "Vehicle updated",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
      onVehicleUpdated();
      setOpen(false);
    } catch (err) {
      await Swal.fire({
        title: "Error",
        text: err?.response?.data?.message || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const carInfoValue = `${vehicle?.year || ""} ${vehicle?.make || ""} ${
    vehicle?.model || ""
  } ${vehicle?.series || ""}`.trim();
  const isCarInfoComplete =
    vehicle.year && vehicle.make && vehicle.model && vehicle.series;

  /* ----------------------------------------------------- */
  /*  Dropdown option arrays (same as original selects)   */
  /* ----------------------------------------------------- */
  const driveTypeOptions = [
    { label: "FWD (Front-Wheel Drive)", value: "fwd" },
    { label: "RWD (Rear-Wheel Drive)", value: "rwd" },
    { label: "AWD (All-Wheel Drive)", value: "awd" },
    { label: "4WD (Four-Wheel Drive)", value: "4wd" },
  ];
  const bodyStyleOptions = [...bodyStyles.map((b) => ({ label: b, value: b }))];
  const transmissionOptions = [
    { label: "Automatic", value: "Automatic" },
    { label: "Manual", value: "Manual" },
  ];
  const colorOptions = [...carColors.map((c) => ({ label: c, value: c }))];
  const fuelTypeOptions = [
    { label: "Petrol", value: "petrol" },
    { label: "Diesel", value: "diesel" },
    { label: "CNG (Compressed Natural Gas)", value: "cng" },
    { label: "LPG (Liquefied Petroleum Gas)", value: "lpg" },
    { label: "Electric", value: "electric" },
    { label: "Hybrid", value: "hybrid" },
  ];
  const conditionOptions = [
    { label: "New", value: "new" },
    { label: "Used", value: "used" },
    { label: "Accidented", value: "accidented" },
  ];
  const certifyOptions = [
    { label: "Certified", value: "Certified" },
    { label: "Non-Certified", value: "Non-Certified" },
  ];

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

        <div className="space-y-2">
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <Dropdown
              options={cityData}
              value={
                cityData.find(
                  (o) => String(o.value) === String(vehicle?.locationId)
                ) || null
              }
              onChange={(selectedOption) => handleSearchable(selectedOption)}
              placeholder="Select City"
              isSearchable={true} // ← enables typing/search
              className={vehicle.locationId ? "text-gray-900" : "text-gray-400"}
            />
          </div>

          {/* Car Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 my-1">
              Car Info <span className="text-red-500">*</span>
            </label>
            <input
              onClick={handleUpdateCarInfo}
              value={carInfoValue || ""}
              placeholder="Year/Make/Model/Version"
              readOnly
              className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full cursor-pointer ${
                isCarInfoComplete ? "bg-green-200 text-green-700" : "bg-red-200"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Drive Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Drive Type <span className="text-red-500">*</span>
              </label>
              <Dropdown
                options={driveTypeOptions}
                value={
                  driveTypeOptions.find((o) => o.value === vehicle.driveType) ||
                  null
                }
                onChange={(opt) =>
                  setVehicle((p) => ({ ...p, driveType: opt?.value || "" }))
                }
                placeholder="Select Drive Type"
                className={
                  vehicle.driveType ? "text-gray-900" : "text-gray-400"
                }
              />
            </div>

            {/* Body Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Body Style <span className="text-red-500">*</span>
              </label>
              <Dropdown
                options={bodyStyleOptions}
                value={
                  bodyStyleOptions.find((o) => o.value === vehicle.bodyStyle) ||
                  null
                }
                onChange={(opt) =>
                  setVehicle((p) => ({ ...p, bodyStyle: opt?.value || "" }))
                }
                placeholder="Please Select Body Style"
                className={
                  vehicle.bodyStyle ? "text-gray-900" : "text-gray-400"
                }
              />
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Transmission Type{" "}
                <span className="text-red-500">*</span>
              </label>
              <Dropdown
                options={transmissionOptions}
                value={
                  transmissionOptions.find(
                    (o) => o.value === vehicle.transmission
                  ) || null
                }
                onChange={(opt) =>
                  setVehicle((p) => ({ ...p, transmission: opt?.value || "" }))
                }
                placeholder="Please Select Transmission Type"
                className={
                  vehicle.transmission ? "text-gray-900" : "text-gray-400"
                }
              />
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Meter Reading <span className="text-red-500">*</span>
              </label>
              <input
                name="mileage"
                value={vehicle?.mileage || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^\d*$/.test(v) && v.length <= 7) handleChange(e);
                }}
                placeholder="Meter Reading (KM)"
                className="border border-gray-300 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Color <span className="text-red-500">*</span>
              </label>
              <Dropdown
                options={colorOptions}
                value={
                  colorOptions.find((o) => o.value === vehicle.color) || null
                }
                onChange={(opt) =>
                  setVehicle((p) => ({ ...p, color: opt?.value || "" }))
                }
                placeholder="Please Select Color"
                className={vehicle.color ? "text-gray-900" : "text-gray-400"}
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Fuel Type <span className="text-red-500">*</span>
              </label>
              <Dropdown
                options={fuelTypeOptions}
                value={
                  fuelTypeOptions.find((o) => o.value === vehicle.fuelType) ||
                  null
                }
                onChange={(opt) =>
                  setVehicle((p) => ({ ...p, fuelType: opt?.value || "" }))
                }
                placeholder="Select Fuel Type"
                className={vehicle.fuelType ? "text-gray-900" : "text-gray-400"}
              />
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Condition <span className="text-red-500">*</span>
              </label>
              <Dropdown
                options={conditionOptions}
                value={
                  conditionOptions.find(
                    (o) => o.value === vehicle.vehicleCondition
                  ) || null
                }
                onChange={(opt) =>
                  setVehicle((p) => ({
                    ...p,
                    vehicleCondition: opt?.value || "",
                  }))
                }
                placeholder="Select Vehicle Condition"
                className={
                  vehicle.vehicleCondition ? "text-gray-900" : "text-gray-400"
                }
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add Vehicle Price <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="buyNowPrice"
                value={price}
                onChange={(e) => {
                  const v = e.target.value;
                  if (
                    v === "" ||
                    (/^[1-9][0-9]{0,8}$/.test(v) && v.length <= 9)
                  ) {
                    setPrice(v);
                    setVehicle((p) => ({ ...p, buyNowPrice: v }));
                  }
                }}
                onBlur={() => {
                  if (price && parseInt(price) < 100000) {
                    Swal.fire({
                      title: "Invalid Price",
                      text: "Minimum 100000",
                      icon: "warning",
                      confirmButtonColor: "#6366f1",
                    });
                    setPrice("");
                    setVehicle((p) => ({ ...p, buyNowPrice: "" }));
                  }
                }}
                placeholder="Add Price"
                inputMode="numeric"
                className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
              {price && (
                <p className="mt-2 text-sm text-red-500 font-semibold">
                  {numberToIndianWords(parseInt(price))}
                </p>
              )}
            </div>
          </div>

          {/* Certification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certification Status <span className="text-red-500">*</span>
            </label>
            <Dropdown
              options={certifyOptions}
              value={
                certifyOptions.find((o) => o.value === vehicle.certifyStatus) ||
                null
              }
              onChange={(opt) =>
                setVehicle((p) => ({ ...p, certifyStatus: opt?.value || "" }))
              }
              placeholder="Please Select Certify Status"
              className={
                vehicle.certifyStatus ? "text-gray-900" : "text-gray-400"
              }
            />
          </div>

          {/* Image Upload (unchanged) */}
          <div className="col-span-1 sm:col-span-2 mt-4">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Images
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
                    {selectedCount > 0 && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        {selectedCount} image{selectedCount > 1 ? "s" : ""}{" "}
                        selected
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
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-950 text-white px-5 py-2 rounded-lg shadow-md hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "loading..." : "Submit Vehicle"}
              </button>
            </div>
          </div>

          {/* CarSelector Modal (unchanged) */}
          {isOpen === "selector" && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
              <div className="w-full max-w-5xl bg-white p-4 sm:p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
                <CarSelector
                  handleIsOpenToggle={() => handleIsOpenToggle("")}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditAdminVehicle;
