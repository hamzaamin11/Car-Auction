import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../components/Contant/URL";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { ViewAdminCar } from "../components/ViewAdminCar";
import Swal from "sweetalert2";
import { AdminAddBid } from "../components/AdminAddBidComponent/AdminAddBid";
import CarSelector from "../components/CarSelector";
import CustomAdd from "../CustomAdd";
import CustomSearch from "../CustomSearch";
import {
  addMake,
  addModel,
  addSeries,
  addYear,
} from "../components/Redux/SelectorCarSlice";
import Select from "react-select";
import Dropdown from "../Dropdown"; // <-- Your custom dropdown

const bodyStyles = [
  "Convertible",
  "Coupe",
  "Crossover",
  "Hatchback",
  "Minivan",
  "Pickup ",
  "Sedan",
  "Station Wagon",
  "SUV",
  "Van",
  "Truck",
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

/* ---------- Dropdown Option Arrays ---------- */
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
];

const certifyOptions = [
  { label: "Certified", value: "Certified" },
  { label: "Non-Certified", value: "Non-Certified" },
];

const AddVehicles = () => {
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";
  const { currentUser } = useSelector((state) => state?.auth);
  const [isSellerBidModalOpen, setIsSellerBidModalOpen] = useState(false);
  const [sellerBidData, setSellerBidData] = useState(null);
  const [isCustomerBidModalOpen, setIsCustomerBidModalOpen] = useState(false);
  const [customerBidData, setCustomerBidData] = useState({
    userId: "",
    vehicleId: "",
    maxBid: "",
    monsterBid: "",
  });

  const initialFields = {
    userId: currentUser?.id,
    year: "",
    make: "",
    model: "",
    series: "",
    bodyStyle: "",
    transmission: "Automatic",
    driveType: "fwd",
    fuelType: "petrol",
    color: "",
    mileage: "",
    vehicleCondition: "new",
    locationId: "",
    buyNowPrice: "",
    certifyStatus: "",
    image: [],
  };

  const fieldLabels = {
    vin: "VIN",
    year: "Year",
    make: "Make",
    model: "Model",
    series: "Series",
    bodyStyle: "Body Style",
    engine: "Engine",
    transmission: "Transmission",
    driveType: "Drive Type",
    fuelType: "Fuel Type",
    color: "Color",
    mileage: "Mileage",
    vehicleCondition: "Condition",
    keysAvailable: "Keys Available",
    locationId: "Location ID",
    saleStatus: "Sale Status",
    auctionDate: "Auction Date",
    currentBid: "Current Bid",
    buyNowPrice: "Buy Now Price",
    certifyStatus: "Certified",
  };

  const [vehicleData, setVehicleData] = useState(initialFields);
  const selected = useSelector((state) => state.carSelector);
  const [vehicles, setVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [selectVehicle, setSelectVehicle] = useState();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);
  const [preview, setPreview] = useState([]);
  const [isOpen, setIsOpen] = useState("");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage, setCarsPerPage] = useState(10);
  const [allCities, setAllCities] = useState([]);
  const dispatch = useDispatch();
  const [selectedCount, setSelectedCount] = useState(0);
  const [price, setPrice] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  console.log("vehicleData =>>:", imagePreview);

  // Convert numerical price to Indian format (e.g., 2800000 -> "28 Lac")
  const formatPriceToIndian = (num) => {
    if (!num) return "";
    num = parseInt(num);
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2)} Crore`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(2)} Lac`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)} Thousand`;
    }
    return num.toString();
  };

  // Parse user input (e.g., "10 Lac" -> 1000000)
  const parsePrice = (priceStr) => {
    if (!priceStr) return "";
    priceStr = priceStr.toString().toLowerCase().trim();
    if (priceStr.includes("crore")) {
      const num = parseFloat(priceStr);
      return num * 10000000;
    } else if (priceStr.includes("lac")) {
      const num = parseFloat(priceStr);
      return num * 100000;
    } else if (priceStr.includes("thousand")) {
      const num = parseFloat(priceStr);
      return num * 1000;
    }
    return parseInt(priceStr) || "";
  };

  // Convert number to Indian words (e.g., 1000000 -> "Ten Lac")
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
    const files = Array.from(e.target.files);

    if (editId) {
      // Edit mode: Allow up to 5 new images, ignore existing image count
      if (files.length > 5) {
        toast.error("You can add a maximum of 5 new images in edit mode.");
        return;
      }
      setVehicleData((prev) => ({
        ...prev,
        image: [...(prev.image || []), ...files], // Append new files only
      }));
      setSelectedCount(files.length); // Count only new files
    } else {
      // Add mode: Limit to 5 images total
      const currentImageCount = vehicleData.image.length;
      if (currentImageCount + files.length > 5) {
        toast.error("You can add a maximum of 5 images.");
        return;
      }
      setVehicleData((prev) => ({
        ...prev,
        image: [...prev.image, ...files],
      }));
      setSelectedCount(currentImageCount + files.length);
    }

    const Newpreviews = files.map((file) => URL.createObjectURL(file));

    setPreview([...preview, Newpreviews]);

    // Reset the file input to prevent accumulation
    e.target.value = null;
  };

  const handleGetAllCities = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`);
      setAllCities(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const totalPages = Math.ceil(allVehicles.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = Math.min(startIndex + carsPerPage, allVehicles.length);
  const currentCars = allVehicles.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 0);
  };

  useEffect(() => {
    handleGetAllCities();
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      setVehicleData((prev) => ({ ...prev, userId: currentUser.id }));
    }
  }, [user]);

  const handleGetAllVehicleById = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getVehiclesByUser/${
          currentUser?.id
        }?search=${search}&Entry=${10}&page=${pageNo}`
      );
      setAllVehicles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllVehicleById();
  }, [search, pageNo]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/getVehiclesByUser/:id`);
      const data = await res.json();
      setVehicles(data);
      setLoading(false);
    } catch {
      setErrorMsg("Failed to fetch vehicles.");
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuctionVehicles = async () => {
    try {
      const res = await fetch(`${BASE_URL}/seller/getAuctionVehicle`);
      if (!res.ok) throw new Error("Failed to fetch auction vehicles");
      const data = await res.json();
      setAuctionVehicles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIsOpenToggle = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchable = (selectedOption) => {
    setVehicleData((prev) => ({
      ...prev,
      locationId: selectedOption?.value,
    }));
  };

  const handleEdit = (vehicle) => {
    // Parse the buyNowPrice string (e.g., "34 Lac") to a raw number (e.g., "3400000")
    const rawPrice = parsePrice(vehicle.buyNowPrice).toString();
    console.log("Parsed buyNowPrice:", rawPrice); // Debug to confirm parsing
    setVehicleData({
      ...vehicle,
      buyNowPrice: rawPrice,
      image: [], // Reset image array to empty for new selections only
    });
    setImagePreview(null); // No preview in edit mode
    setSelectedCount(0); // Reset count to 0, ignoring previous images
    setPrice(rawPrice); // Set price state to raw number
    setFormOpen(true);
    setEditId(vehicle.newVehicleId);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[1-9][0-9]{0,8}$/.test(value)) {
      setPrice(value);
      const parsedValue = parsePrice(value);
      setVehicleData((prev) => ({
        ...prev,
        buyNowPrice: parsedValue.toString(), // Update correct field
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId && vehicleData.approval === "Y") {
      await Swal.fire({
        title: "Cannot Edit Vehicle",
        text: "Your vehicle is approved now, you cannot edit it.",
        icon: "error",
        confirmButtonColor: "#9333ea",
        confirmButtonText: "OK",
      });
      return;
    }

    const requiredFields = {
      year: "Year",
      make: "Make",
      model: "Model",
      series: "Series",
      bodyStyle: "Body Style",
      transmission: "Transmission",
      driveType: "Drive Type",
      fuelType: "Fuel Type",
      color: "Color",
      mileage: "Mileage",
      vehicleCondition: "Vehicle Condition",
      locationId: "Location",
      buyNowPrice: "Buy Now Price",
      certifyStatus: "Certify Status",
      image: "Image",
    };

    for (let field in requiredFields) {
      if (
        !vehicleData[field] ||
        (Array.isArray(vehicleData[field]) && vehicleData[field].length === 0)
      ) {
        toast.error(`${requiredFields[field]} is required.`);
        return;
      }
    }
    if (vehicleData.buyNowPrice < 10000) {
      await Swal.fire({
        title: "Cannot Edit Vehicle",
        text: "Your vehicle Price is less than 10000",
        icon: "error",
        confirmButtonColor: "#9333ea",
        confirmButtonText: "OK",
      });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("userId", currentUser?.id);
    Object.entries(vehicleData).forEach(([key, value]) => {
      if (key === "userId") return;
      if (key === "image") {
        if (Array.isArray(value)) {
          value.forEach((file) => {
            formData.append("image", file);
          });
        }
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `${BASE_URL}/seller/updateVehicle/${editId}`
      : `${BASE_URL}/seller/addVehicle`;

    try {
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Submission failed.");
      setVehicleData(initialFields);
      setImage(null);
      setImagePreview(null);
      setSelectedCount(0);
      setPrice("");
      setFormOpen(false);
      setEditId(null);
      toast.success(
        editId ? "Vehicle updated successfully" : "Vehicle added successfully"
      );
      handleGetAllVehicleById();
    } catch (err) {
      setErrorMsg(err.message);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId, approval) => {
    if (approval === "Y") {
      await Swal.fire({
        title: "Cannot Delete Vehicle",
        text: "Your vehicle is approved now, you cannot delete it.",
        icon: "error",
        confirmButtonColor: "#9333ea",
        confirmButtonText: "OK",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This vehicle will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${BASE_URL}/seller/deleteVehicle/${vehicleId}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to delete vehicle");

      await Swal.fire({
        title: "Deleted!",
        text: "Vehicle has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });

      handleGetAllVehicleById();
    } catch (err) {
      await Swal.fire({
        title: "Error",
        text: err.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  const handleSubmitSellerBid = async (userId, bidData) => {
    try {
      const response = await fetch(`${BASE_URL}/seller/createBid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...bidData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create bid");
      }

      const data = await response.json();
      setIsSellerBidModalOpen(false);
    } catch (error) {
      console.error("Error submitting seller bid:", error);
    }
  };

  const cityData = [
    ...(allCities?.map((city) => ({
      label: city.cityName,
      value: city.id,
    })) || []),
  ];

  const handleEndBidding = async (bidId) => {
    handleIsOpenToggle("bid");
    try {
      const res = await fetch(`${BASE_URL}/seller/endBidding/${bidId}`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to end bidding");
      alert(`Bidding ended for bid ID: ${bidId}`);
      fetchVehicles();
    } catch (err) {
      console.error("End bidding error:", err);
      alert("Error: " + err.message);
    }
  };

  const handleUpdateCarInfo = () => {
    handleIsOpenToggle("selector");
  };

  useEffect(() => {
    setVehicleData((prev) => ({
      ...prev,
      year: selected?.year,
      make: selected?.make,
      model: selected?.model,
      series: selected?.series,
    }));
  }, [selected]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const toggleDropdown = (vehicleId) => {
    setIsDropdownOpen((prev) => (prev === vehicleId ? null : vehicleId));
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(null);
  };

  return (
    <div
      className="min-h-screen lg:p-6 px-2 bg-gradient-to-br from-gray-100 to-blue-50"
      onClick={handleDropdownClose}
    >
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="lg:text-3xl text-xl font-bold text-gray-800 p-3">
            Vehicle List
          </h1>
          <div className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>
            <CustomSearch
              placeholder="Search by Car Name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                // debouncedSearch(e.target.value); // You can re-enable if needed
              }}
            />
          </div>
          {!isCustomer && (
            <CustomAdd
              text="Add Vehicle"
              variant="add"
              onClick={() => {
                setFormOpen(!formOpen);
                setVehicleData({
                  ...initialFields,
                  userId: currentUser?.id || "",
                });
                setImage(null);
                setImagePreview(null);
                setEditId(null);
                setSelectedCount(0);
                setPrice("");
                setErrorMsg("");
                setSuccessMsg("");
                dispatch(addYear(""));
                dispatch(addMake(""));
                dispatch(addModel(""));
                dispatch(addSeries(""));
              }}
            />
          )}
        </header>

        {(errorMsg || successMsg) && (
          <div
            className={`mb-6 p-4 rounded ${
              errorMsg
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {errorMsg || successMsg}
          </div>
        )}

        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30 px-4">
            <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto p-6 rounded-lg relative">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editId ? "Update Vehicle" : "Add a New Vehicle"}
                </h2>
                <button
                  onClick={() => setFormOpen(false)}
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
                  <Dropdown
                    options={cityData}
                    value={
                      cityData.find(
                        (option) =>
                          String(option.value) ===
                          String(vehicleData?.locationId)
                      ) || null
                    }
                    onChange={(option) => handleSearchable(option)}
                    placeholder="Select City...."
                    className="w-full"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 my-1">
                      Car Info <span className="text-red-500">*</span>
                    </label>
                    <input
                      onClick={handleUpdateCarInfo}
                      value={`${selected?.year || vehicleData?.year} ${
                        selected?.make || vehicleData?.make
                      } ${selected?.model || vehicleData?.model} ${
                        selected?.series || vehicleData?.series
                      }`}
                      placeholder="Year/Make/Model/Version"
                      readOnly
                      className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                        (selected.year &&
                          selected.make &&
                          selected.model &&
                          selected.series) ||
                        (vehicleData?.year &&
                          vehicleData?.make &&
                          vehicleData?.model &&
                          vehicleData?.series)
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200"
                      }`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Drive Type <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      options={driveTypeOptions}
                      value={
                        driveTypeOptions.find(
                          (o) => o.value === vehicleData.driveType
                        ) || null
                      }
                      onChange={(opt) =>
                        setVehicleData((p) => ({
                          ...p,
                          driveType: opt?.value || "",
                        }))
                      }
                      placeholder="Select Drive Type"
                      className={
                        vehicleData.driveType
                          ? "text-gray-900"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Body Style <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      options={bodyStyleOptions}
                      value={
                        bodyStyleOptions.find(
                          (o) => o.value === vehicleData.bodyStyle
                        ) || null
                      }
                      onChange={(opt) =>
                        setVehicleData((p) => ({
                          ...p,
                          bodyStyle: opt?.value || "",
                        }))
                      }
                      placeholder="Please Select BodyStyle"
                      className={
                        vehicleData.bodyStyle
                          ? "text-gray-900"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Transmission Type{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      options={transmissionOptions}
                      value={
                        transmissionOptions.find(
                          (o) => o.value === vehicleData.transmission
                        ) || null
                      }
                      onChange={(opt) =>
                        setVehicleData((p) => ({
                          ...p,
                          transmission: opt?.value || "",
                        }))
                      }
                      placeholder="Please Select Transmission Type"
                      className={
                        vehicleData.transmission
                          ? "text-gray-900"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Meter Reading{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="mileage"
                      value={vehicleData?.mileage || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^[1-9][0-9]{0,6}$/.test(value)) {
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
                    <Dropdown
                      options={colorOptions}
                      value={
                        colorOptions.find(
                          (o) => o.value === vehicleData.color
                        ) || null
                      }
                      onChange={(opt) =>
                        setVehicleData((p) => ({
                          ...p,
                          color: opt?.value || "",
                        }))
                      }
                      placeholder="Please Select Color"
                      className={
                        vehicleData.color ? "text-gray-900" : "text-gray-400"
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Fuel Type <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      options={fuelTypeOptions}
                      value={
                        fuelTypeOptions.find(
                          (o) => o.value === vehicleData.fuelType
                        ) || null
                      }
                      onChange={(opt) =>
                        setVehicleData((p) => ({
                          ...p,
                          fuelType: opt?.value || "",
                        }))
                      }
                      placeholder="Select Fuel Type"
                      className={
                        vehicleData.fuelType ? "text-gray-900" : "text-gray-400"
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Condition
                    </label>
                    <Dropdown
                      options={conditionOptions}
                      value={
                        conditionOptions.find(
                          (o) => o.value === vehicleData.vehicleCondition
                        ) || null
                      }
                      onChange={(opt) =>
                        setVehicleData((p) => ({
                          ...p,
                          vehicleCondition: opt?.value || "",
                        }))
                      }
                      placeholder="Select Vehicle Condition"
                      className={
                        vehicleData.vehicleCondition
                          ? "text-gray-900"
                          : "text-gray-400"
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Add Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="buyNowPrice"
                      value={price}
                      onChange={handlePriceChange}
                      placeholder="Add Price "
                      className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    />
                    {price && (
                      <p className="mt-2 text-sm text-red-500 font-semibold">
                        {numberToIndianWords(parsePrice(price))}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification Status <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    options={certifyOptions}
                    value={
                      certifyOptions.find(
                        (o) => o.value === vehicleData.certifyStatus
                      ) || null
                    }
                    onChange={(opt) =>
                      setVehicleData((p) => ({
                        ...p,
                        certifyStatus: opt?.value || "",
                      }))
                    }
                    placeholder="Please Select Certification Status"
                    className={
                      vehicleData.certifyStatus
                        ? "text-gray-900"
                        : "text-gray-400"
                    }
                  />
                </div>
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
                            You can add maximum 5 images and first image will be
                            used as front on the card
                          </p>
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
                  {preview?.length > 0 && (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
    {preview?.map((src, index) => (
      <div
        key={index}
        className="relative border rounded-xl shadow-sm overflow-hidden"
      >
        <img
          src={src}
          alt="preview"
          className="h-28 w-full object-cover"
        />
        <div 
          onClick={() => {
            const updatedPreviews = preview.filter((_, i) => i !== index);
            const updatedImages = vehicleData.image.filter((_, i) => i !== index);
            setPreview(updatedPreviews);
            setVehicleData((prev) => ({ ...prev, image: updatedImages }));
            setSelectedCount(updatedImages.length);
          }}
          className="absolute top-1 right-1 bg-white rounded-full shadow p-1 cursor-pointer hover:bg-gray-100"
        >
          <span className="text-xs text-gray-600">×</span>
        </div>
      </div>
    ))}
  </div>
)}
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-950 text-white px-5 py-2 rounded-lg shadow-md"
                    >
                      {loading ? "Loading..." : "Submit Vehicle"}
                    </button>
                  </div>
                </div>
              </form>
              {isOpen === "selector" && (
                <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
                  <div className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-lg relative">
                    <CarSelector
                      handleIsOpenToggle={() => handleIsOpenToggle("")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <section className="lg:mt-6 mt-3 space-y-4 max-h-[55vh] overflow-y-auto md:hidden block">
          {loading ? (
            <p className="text-center text-indigo-600 font-semibold">
              Loading vehicles...
            </p>
          ) : currentCars.length === 0 ? (
            <p className="text-center text-gray-600">No vehicles found.</p>
          ) : (
            currentCars?.map((vehicle) => (
              <div
                key={vehicle.newVehicleId}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-2 flex items-center justify-between gap-4"
              >
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={vehicle.images[0]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover hover:cursor-pointer"
                    onClick={() => (
                      setSelectVehicle(vehicle), handleIsOpenToggle("View")
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-gray-800 text-xs truncate">
                    {vehicle.make || "—"} {vehicle.model || "—"}{" "}
                    {vehicle.series || "—"}
                  </h2>
                  <p className="text-xs font-bold text-gray-900">
                    PKR {vehicle.buyNowPrice}
                  </p>
                  <p className="text-xs text-gray-600">
                    {vehicle.year || "—"} • {vehicle.fuelType || "—"} •{" "}
                    {vehicle.transmission || "—"}
                  </p>
                  <p
                    className={`text-[8px] text-center rounded w-16 ${
                      vehicle.approval === "Y"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {vehicle.approval === "Y" ? "Approved" : "Not Approved"}
                  </p>
                </div>
                <div className="relative flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(vehicle.newVehicleId);
                    }}
                    className="px-3 py-1 text-gray-600 text-xl"
                  >
                    <BsThreeDotsVertical />
                  </button>
                  {isDropdownOpen === vehicle.newVehicleId && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                      {!isCustomer ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(vehicle);
                            }}
                            className="block w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-100 text-left rounded-t-lg"
                          >
                            Edit
                          </button>
                          {vehicle.bidId ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEndBidding(vehicle.bidId);
                                handleIsOpenToggle("bid");
                              }}
                              className="block w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left"
                            >
                              Bid Added
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectVehicle(vehicle);
                                handleIsOpenToggle("View");
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-100"
                            >
                              View
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(
                                vehicle.newVehicleId,
                                vehicle.approval
                              );
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-b-lg"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomerBidData({
                              userId: user?.id,
                              vehicleId: vehicle.id,
                              maxBid: "",
                              monsterBid: "",
                            });
                            setIsCustomerBidModalOpen(true);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          Create Bid
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {currentCars.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
                {/* Page Buttons */}
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {/* First Page */}
                  <button
                    onClick={() => {
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 rounded border text-xs sm:text-sm ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {"<<"}
                  </button>

                  {/* Prev */}
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-2 py-1 rounded border text-xs sm:text-sm ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {"<"}
                  </button>

                  {/* Page Numbers */}
                  {Array.from(
                    {
                      length: Math.min(
                        window.innerWidth < 640 ? 3 : 5,
                        totalPages
                      ),
                    },
                    (_, i) => {
                      let pageNum;

                      if (totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 2) pageNum = i + 1;
                      else if (currentPage >= totalPages - 1)
                        pageNum =
                          totalPages - (window.innerWidth < 640 ? 2 : 4) + i;
                      else pageNum = currentPage - 1 + i;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`px-2 py-1 rounded border text-xs sm:text-sm ${
                            currentPage === pageNum
                              ? "bg-blue-950 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  {/* Next */}
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 rounded border text-xs sm:text-sm ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {">"}
                  </button>

                  {/* Last Page */}
                  <button
                    onClick={() => {
                      setCurrentPage(totalPages);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className={`px-2 py-1 rounded border text-xs sm:text-sm ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {">>"}
                  </button>
                </div>

                {/* Show entries */}
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="text-gray-600">Show</span>

                  <select
                    value={carsPerPage}
                    onChange={(e) => {
                      setCarsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>

                  <span className="text-gray-600">entries</span>
                </div>
                {/* Showing X to Y of Z */}
                <div className="text-gray-600 text-center sm:text-left">
                  Showing{" "}
                  <span className="font-medium">
                    {startIndex + 1} to {endIndex}
                  </span>{" "}
                  of <span className="font-medium">{allVehicles.length}</span>{" "}
                  entries
                </div>
              </div>
            </div>
          )}
        </section>

        <section
          className="lg:mt-6  overflow-y-auto md:block hidden pb-10 space-y-2"
          style={{ maxHeight: "calc(100vh - 210px)" }}
        >
          {loading ? (
            <p className="text-center text-indigo-600 font-semibold">
              Loading vehicles...
            </p>
          ) : currentCars.length === 0 ? (
            <p className="text-center text-gray-600">No vehicles found.</p>
          ) : (
            currentCars?.map((vehicle) => (
              <div
                key={vehicle.newVehicleId}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="w-full sm:w-40 sm:h-28 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={vehicle.images[0]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover hover:cursor-pointer"
                    onClick={() => (
                      setSelectVehicle(vehicle), handleIsOpenToggle("View")
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h2 className="font-bold text-gray-800">
                    {vehicle.make || "—"} {vehicle.model || "—"}{" "}
                    {vehicle.series || "—"}
                  </h2>
                  <p className="text-lg font-bold text-gray-800">
                    PKR {vehicle.buyNowPrice}
                  </p>
                  <div className="flex flex-wrap gap-1 text-sm text-gray-500">
                    <span>{vehicle.year || "—"}</span>|
                    <span>{vehicle.mileage || "—"}KM</span>|
                    <span>{vehicle.fuelType || "—"}</span>|
                    <span>{vehicle.color || "—"}</span>|
                    <span>{vehicle.transmission || "—"}</span>|
                    <span>{vehicle.cityName || "—"}</span>|
                    <span
                      className={`text-xs text-center rounded p-1 ${
                        vehicle.approval === "Y"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {vehicle.approval === "Y" ? "Approved" : "Not Approved"}
                    </span>
                  </div>
                </div>
                <div className="relative flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(vehicle.newVehicleId);
                    }}
                    className="px-3 py-1 text-gray-600 text-xl"
                  >
                    <BsThreeDotsVertical />
                  </button>
                  {isDropdownOpen === vehicle.newVehicleId && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                      {!isCustomer ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(vehicle);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-100 rounded-t-lg"
                          >
                            Edit
                          </button>
                          {vehicle.bidId ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEndBidding(vehicle.bidId);
                                handleIsOpenToggle("bid");
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-green-500 hover:bg-green-500 hover:text-white"
                            >
                              Bid Added
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectVehicle(vehicle);
                                handleIsOpenToggle("View");
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-100 rounded"
                            >
                              View
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(
                                vehicle.newVehicleId,
                                vehicle.approval
                              );
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-b-lg"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomerBidData({
                              userId: user?.id,
                              vehicleId: vehicle.id,
                              maxBid: "",
                              monsterBid: "",
                            });
                            setIsCustomerBidModalOpen(true);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          Create Bid
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {/* ✅ Pagination OUTSIDE the map */}
          {currentCars.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
                {/* Showing X to Y of Z */}
                <div className="text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {startIndex + 1} to {endIndex}
                  </span>{" "}
                  of <span className="font-medium">{allVehicles.length}</span>{" "}
                  entries
                </div>

                {/* Page Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {"<<"}
                  </button>

                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded border ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {"<"}
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2)
                      pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`px-3 py-1 rounded border ${
                          currentPage === pageNum
                            ? "bg-blue-950 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded border ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {">"}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage(totalPages);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded border ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {">>"}
                  </button>
                </div>

                {/* Show entries */}
                <div className="flex items-center gap-2">
                
                  {/* <select
                    value={carsPerPage}
                    onChange={(e) => {
                      setCarsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  >
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-600">entries</span> */}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
      {isOpen === "View" && (
        <ViewAdminCar
          handleClick={handleIsOpenToggle}
          selectedVehicle={selectVehicle}
        />
      )}
      {isOpen === "bid" && (
        <AdminAddBid
          selectedVehicle={sellerBidData}
          setIsOpenBid={setIsOpen}
          getAllVehicles={handleGetAllVehicleById}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default AddVehicles;
