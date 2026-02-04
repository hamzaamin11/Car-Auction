import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { BASE_URL } from "../../components/Contant/URL";
import { useSelector } from "react-redux";
import Dropdown from "../../Dropdown";
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

const initialAutoDescription = [
  {
    id: 1,
    label: "Bumper-to-Bumper Original",
    value: "Everything is in genuine condition",
  },
  {
    id: 2,
    label: "Like New",
    value: "As good as a brand new car",
  },
  {
    id: 3,
    label: "Authorized Workshop Maintained",
    value: "100% maintained by dealership",
  },
  {
    id: 4,
    label: "Minor Accidental Cars",
    value: "Minor Accidental Cars",
  },
  {
    id: 5,
    label: "Complete Service History",
    value: "All service history log maintained",
  },
  {
    id: 6,
    label: "Fresh Import",
    value: "Just imported",
  },
  {
    id: 7,
    label: "Price Negotiable",
    value: "Price is flexible",
  },
  {
    id: 8,
    label: "Alloy Rims",
    value: "Alloy Rims",
  },
  {
    id: 9,
    label: "Original Book",
    value: "Original book of this car is also available",
  },
  {
    id: 10,
    label: "Duplicate Book",
    value: "Original book not available",
  },
  {
    id: 11,
    label: "Complete Original File",
    value: "All service history log maintained",
  },
  {
    id: 12,
    label: "Duplicate File",
    value: "Original book not available",
  },
  {
    id: 13,
    label: "Duplicate Number Plate",
    value: "Original book not available",
  },
  {
    id: 14,
    label: "Non Accidental Car",
    value: "Never been into any accident",
  },
  {
    id: 15,
    label: "New Tires",
    value: "Brand new tires installed",
  },
  {
    id: 16,
    label: "Auction Sheet Available",
    value: "Complete auction sheet available",
  },
  {
    id: 17,
    label: "Token or Tax Up to Date",
    value: "All taxes paid",
  },
  {
    id: 18,
    label: "Lifetime Token Paid",
    value: "All token taxes are paid for life",
  },
  {
    id: 19,
    label: "Urgent Sale",
    value: "Need to sell the car urgently",
  },
  {
    id: 20,
    label: "Driven on Petrol",
    value: "Driven on petrol throughout",
  },
  {
    id: 21,
    label: "Factory Fitted CNG",
    value: "Factory Fitted CNG",
  },
  {
    id: 22,
    label: "Army Officer Car",
    value: "The car was in the use of an Army Officer",
  },
  {
    id: 23,
    label: "Minor Touch Ups",
    value: "Minor Accidental Cars",
  },
  {
    id: 24,
    label: "Engine Repaired",
    value: "Engine is repaired",
  },
  {
    id: 25,
    label: "Sealed Engine",
    value: "Sealed and powerful engine",
  },
  {
    id: 26,
    label: "Engine Swapped",
    value: "Engine is repaired",
  },
  {
    id: 27,
    label: "Contact During Office Hours",
    value: "No call/SMS will be answered after office hours",
  },
  {
    id: 28,
    label: "Exchange Possible",
    value: "Willing to exchange with another car",
  },
  {
    id: 29,
    label: "Missing File",
    value: "Missing File",
  },
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
    description: "",
    images: [],
  };

  const [vehicle, setVehicle] = useState(initialVehicleState);

  console.log("=>", vehicle);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const selected = useSelector((state) => state.carSelector);
  const [loading, setLoading] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [price, setPrice] = useState("");
  const [autoDescription, setAutoDescription] = useState(
    initialAutoDescription,
  );
  const [showMore, setShowMore] = useState(false);

  const parsePrice = (priceStr) => {
    if (!priceStr) return "";
    const str = priceStr.toString().toLowerCase();
    if (str.includes("lac")) return parseFloat(str) * 100000;
    if (str.includes("crore")) return parseFloat(str) * 10000000;
    const parsed = parseFloat(str.replace(/[^0-9.]/g, ""));
    return isNaN(parsed) ? "" : parsed;
  };

  /* ----------------------------------------------------- */
  /*  Load vehicle data                                   */
  /* ----------------------------------------------------- */
  useEffect(() => {
    if (selectedVehicle) {
      const parsed = parsePrice(selectedVehicle.buyNowPrice);
      const vehicleImages = selectedVehicle?.images || [];

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
        images: vehicleImages,
        description: Array.isArray(selectedVehicle?.description)
          ? selectedVehicle.description.join(", ")
          : selectedVehicle?.description || "",
      });

      setExistingImages(vehicleImages);
      setImagePreviews(vehicleImages);
      setPrice(String(parsed || ""));
      setSelectedCount(vehicleImages.length);
    }
  }, [selectedVehicle]);

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
    if (num === 0) return "Zero";
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
      return (h ? ones[h] + " Hundred " : "") + (r ? twoDigits(r) : "").trim();
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

  /* ----------------------------------------------------- */
  /*  Handle file upload                                  */
  /* ----------------------------------------------------- */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 5) {
      Swal.fire({
        title: "Error",
        text: "You can add a maximum of 5 images",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    // Check file size (5MB limit)
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      Swal.fire({
        title: "Error",
        text: "Some files exceed 5MB limit",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    // Add new files
    setNewImages((prev) => [...prev, ...files]);

    // Create preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // Update selected count
    setSelectedCount(totalImages);

    // Clear file input
    e.target.value = null;
  };

  /* ----------------------------------------------------- */
  /*  Remove image                                        */
  /* ----------------------------------------------------- */
  const removeImage = (index) => {
    const isExistingImage = index < existingImages.length;

    if (isExistingImage) {
      // Remove from existing images
      const updatedExisting = existingImages.filter((_, i) => i !== index);
      setExistingImages(updatedExisting);
    } else {
      // Remove from new images
      const adjustedIndex = index - existingImages.length;
      const updatedNew = newImages.filter((_, i) => i !== adjustedIndex);
      setNewImages(updatedNew);

      // Revoke object URL
      URL.revokeObjectURL(imagePreviews[index]);
    }

    // Update image previews
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);

    // Update selected count
    setSelectedCount((prev) => prev - 1);

    // Update vehicle images array
    setVehicle((prev) => ({
      ...prev,
      images: updatedPreviews,
    }));
  };

  /* ----------------------------------------------------- */
  /*  Handle input changes                                */
  /* ----------------------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleSelectDescription = (id, value) => {
    setAutoDescription((prev) => prev.filter((desc) => desc.id !== id));

    setVehicle((prev) => {
      const existing = prev.description?.trim();

      const newText = existing
        ? existing.endsWith(",")
          ? `${existing} ${value}`
          : `${existing}, ${value}`
        : value;

      return {
        ...prev,
        description: newText,
      };
    });
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

  /* ----------------------------------------------------- */
  /*  Fetch cities                                        */
  /* ----------------------------------------------------- */
  const handleGetAllCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`);
      setAllCities(res.data);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Failed to load cities",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
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
  /*  Clean up object URLs on unmount                     */
  /* ----------------------------------------------------- */
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url, index) => {
        // Only revoke URLs for new images (blob URLs)
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  /* ----------------------------------------------------- */
  /*  Submit form                                         */
  /* ----------------------------------------------------- */
  /* ----------------------------------------------------- */
  /*  Submit form                                         */
  /* ----------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if we have at least one image
    if (imagePreviews.length === 0) {
      await Swal.fire({
        title: "Warning",
        text: "Please add at least one image",
        icon: "warning",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

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

    // Append user ID
    formData.append("userId", selectedVehicle.userId);

    // Append all vehicle data
    Object.entries(vehicle).forEach(([key, value]) => {
      if (
        key !== "images" &&
        value !== null &&
        value !== undefined &&
        key !== "id"
      ) {
        if (key === "description" && Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      }
    });

    // Append existing images (if they're URLs)
    if (existingImages.length > 0) {
      existingImages.forEach((image, index) => {
        // Check if it's a URL (existing image) or File (new image)
        if (typeof image === "string") {
          // It's an existing image URL
          formData.append(`existingImages[${index}]`, image);
        }
      });
    }

    // Append new images - IMPORTANT: Use 'image' as field name (multer expects this)
    newImages.forEach((file, index) => {
      formData.append("image", file); // Multer expects field name 'image'
    });

    // Send all existing images as a separate array
    if (existingImages.length > 0) {
      formData.append(
        "existingImages",
        JSON.stringify(existingImages.filter((img) => typeof img === "string")),
      );
    }

    try {
      const res = await fetch(
        `${BASE_URL}/admin/updateVehicleForAdmin/${selectedVehicle?.id}`,
        {
          method: "PUT",
          body: formData,
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update vehicle");
      }

      const result = await res.json();

      await Swal.fire({
        title: "Success!",
        text: "Vehicle updated successfully",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });

      onVehicleUpdated();
      setOpen(false);
    } catch (err) {
      await Swal.fire({
        title: "Error",
        text: err.message || "Something went wrong!",
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
  /*  Dropdown options                                    */
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
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 rounded-lg relative border">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Vehicle</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-red-700 text-3xl hover:text-red-900"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <Dropdown
              options={cityData}
              value={
                cityData.find(
                  (o) => String(o.value) === String(vehicle?.locationId),
                ) || null
              }
              onChange={(selectedOption) => handleSearchable(selectedOption)}
              placeholder="Select City"
              isSearchable={true}
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
                isCarInfoComplete
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-red-50 text-red-700 border-red-300"
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
                    (o) => o.value === vehicle.transmission,
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
                    (o) => o.value === vehicle.vehicleCondition,
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
                Add Reserve Price <span className="text-red-500">*</span>
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

          {/* Description */}
          <div className="mt-4">
            <label className="block text-sm  text-gray-700 mb-2">
              Add Description <span className="text-red-500">*</span>
            </label>

            <textarea
              placeholder="Describe your vehicle condition, features, registration details, reason for sale etc."
              value={vehicle.description}
              onChange={(e) =>
                setVehicle((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              maxLength={995}
              rows={6}
              className="w-full resize-none rounded-lg border border-gray-400 p-3 text-sm text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-gray-700">
              You can also use these suggestions
              <span
                className={`font-medium ${
                  vehicle?.description?.length < 50
                    ? "text-red-500"
                    : "text-gray-600"
                }`}
              >
                Remaining character:({995 - vehicle?.description?.length})
              </span>
            </div>
          </div>

          {/* Auto Description Suggestions */}
          <div className="w-full">
            <div
              className={`flex flex-wrap gap-3 w-full border border-gray-300 rounded-lg px-4 py-3 overflow-hidden transition-all duration-700 ease-in-out ${
                showMore ? "max-h-[500px]" : "max-h-24"
              }`}
            >
              {autoDescription.map((desc, index) => (
                <button
                  key={desc.id}
                  type="button"
                  onClick={() => handleSelectDescription(desc.id, desc.value)}
                  className="rounded-full border border-blue-900 px-4 py-1.5 text-sm font-medium text-blue-900 transition hover:bg-blue-900 hover:text-white"
                >
                  {desc.label}
                </button>
              ))}
            </div>

            {/* Show more / less button */}
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => setShowMore((prev) => !prev)}
                className="text-sm font-medium text-blue-900 hover:underline"
              >
                {showMore ? "Show less suggestions" : "Show more suggestions"}
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="col-span-1 sm:col-span-2 mt-4">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Images <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 ml-2">
                  (Max 5 images, first image will be displayed as primary)
                </span>
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
                    <p className="text-xs text-gray-400 px-2 text-center">
                      You can add maximum 5 images total
                    </p>
                    {selectedCount > 0 && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        {selectedCount} image{selectedCount > 1 ? "s" : ""}{" "}
                        selected ({5 - selectedCount} remaining)
                      </p>
                    )}
                  </div>
                  <input
                    id="vehicleImage"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={selectedCount >= 5}
                  />
                </label>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Uploaded Images ({imagePreviews.length}/5)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {imagePreviews.map((src, index) => (
                    <div
                      key={index}
                      className="relative border rounded-xl shadow-sm overflow-hidden group"
                    >
                      <img
                        src={src}
                        alt={`vehicle-preview-${index}`}
                        className="h-28 w-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/150?text=Image+Error";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove image"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {index === 0 ? "Primary" : `Image ${index + 1}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-950 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Vehicle"
                )}
              </button>
            </div>
          </div>
        </form>

        {/* CarSelector Modal */}
        {isOpen === "selector" && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-5xl bg-white p-4 sm:p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
              <CarSelector handleIsOpenToggle={() => handleIsOpenToggle("")} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditAdminVehicle;
