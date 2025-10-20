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
import {
  addMake,
  addModel,
  addSeries,
  addYear,
} from "../components/Redux/SelectorCarSlice";
import Select from "react-select";

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
  const [imagePreview, setImagePreview] = useState(null);
  const [isOpen, setIsOpen] = useState("");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [allCities, setAllCities] = useState([]);
  const dispatch = useDispatch();
  const [selectedCount, setSelectedCount] = useState(0);
  const [price, setPrice] = useState(vehicleData?.buyNowPrice || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);

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
    setSelectedCount(files.length);
    handleAddedImage(e);
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
        }?search=${search}&entry=${10}?page=${pageNo}`
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

  const parsePrice = (priceStr) => {
    if (!priceStr) return "";
    if (priceStr.toLowerCase().includes("lac")) {
      const num = parseFloat(priceStr);
      return num * 100000;
    }
    if (priceStr.toLowerCase().includes("crore")) {
      const num = parseFloat(priceStr);
      return num * 10000000;
    }
    return priceStr;
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
      locationId: selectedOption.value,
    }));
  };

  const handleAddedImage = (e) => {
    const files = Array.from(e.target.files);
    setVehicleData((prev) => ({ ...prev, image: [...prev.image, ...files] }));
  };

  const handleEdit = (vehicle) => {
    setVehicleData(vehicle);
    setImagePreview(vehicle.image || null);
    setFormOpen(true);
    setEditId(vehicle.newVehicleId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      buyNowPrice: "buyNowPrice",
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
        } else if (!editId) {
          formData.append("image", value);
        }
      } else if (value !== null && value !== undefined) {
        if (key === "buyNowPrice") {
          const parsed = parsePrice(value.toString());
          formData.append("buyNowPrice", parsed.toString());
        } else {
          formData.append(key, value.toString());
        }
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

  const handleDelete = async (vehicleId) => {
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
      setSuccessMsg("Vehicle deleted.");
      setTimeout(() => setSuccessMsg(""), 3000);
      handleGetAllVehicleById();
    } catch (err) {
      setErrorMsg(err.message);
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
    { label: "Select City", value: "" },
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
        <header className="flex flex-col md:flex-row justify-between items-center ">
          <h1 className="lg:text-3xl text-xl  font-bold text-gray-800 p-3">
            Vehicle List
          </h1>
          <div className="relative w-full max-w-md ">
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
            <input
              type="text"
              placeholder="Search By Car Name"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-sm"
            />
          </div>
          {!isCustomer && (
            <button
              onClick={() => {
                setFormOpen(!formOpen);
                setVehicleData({
                  ...initialFields,
                  userId: currentUser?.id || "",
                });
                setImage(null);
                setImagePreview(null);
                setEditId(null);
                setErrorMsg("");
                setSuccessMsg("");
                dispatch(addYear(""));
                dispatch(addMake(""));
                dispatch(addModel(""));
                dispatch(addSeries(""));
              }}
              className="mt-4 md:mt-0 px-4 py-2 bg-blue-950 text-white text-sm rounded hover:cursor-pointer lg:w-32 w-full"
            >
              Add Vehicle
            </button>
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
                  <Select
                    onChange={handleSearchable}
                    options={cityData}
                    value={
                      cityData.find(
                        (option) =>
                          String(option.value) ===
                          String(vehicleData?.locationId)
                      ) || null
                    }
                    isClearable
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
                      Vehicle Drive Type
                    </label>
                    <select
                      name="driveType"
                      value={vehicleData.driveType}
                      onChange={handleChange}
                      className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicleData.driveType ? "text-gray-900" : "text-gray-400"
                    }`}
                    >
                      <option value="">Select Drive Type</option>
                      <option value="fwd" className="text-gray-900">FWD (Front-Wheel Drive)</option>
                      <option value="rwd" className="text-gray-900">RWD (Rear-Wheel Drive)</option>
                      <option value="awd" className="text-gray-900">AWD (All-Wheel Drive)</option>
                      <option value="4wd" className="text-gray-900">4WD (Four-Wheel Drive)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Body Style <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="bodyStyle"
                      value={vehicleData.bodyStyle}
                      onChange={handleChange}
                       className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicleData.bodyStyle ? "text-gray-900" : "text-gray-400"
                    }`}
                    >
                      <option value="">Please Select BodyStyle</option>
                      {bodyStyles?.map((body) => (
                        <option key={body} value={body} className="text-gray-900">
                          {body}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Transmission Type
                    </label>
                    <select
                      name="transmission"
                      value={vehicleData?.transmission || ""}
                      onChange={handleChange}
                      className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicleData.transmission ? "text-gray-900" : "text-gray-400"
                    }`}
                    >
                      <option value="">Please Select Transmission Type</option>
                      <option value="Automatic" className="text-gray-900">Automatic</option>
                      <option value="Manual" className="text-gray-900">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Meter Reading
                    </label>
                    <input
                      name="mileage"
                      value={vehicleData?.mileage || ""}
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
                      value={vehicleData.color || ""}
                      onChange={handleChange}
                      className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicleData.color ? "text-gray-900" : "text-gray-400"
                    }`}
                    >
                      <option value="">Please Select Color</option>
                      {carColors?.map((color) => (
                        <option key={color} value={color} className="text-gray-900">
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Fuel Type
                    </label>
                    <select
                      name="fuelType"
                      value={vehicleData.fuelType}
                      onChange={handleChange}
                       className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicleData.fuelType ? "text-gray-900" : "text-gray-400"
                    }`}
                    >
                      <option value="">Select Fuel Type</option>
                      <option value="petrol" className="text-gray-900">Petrol</option>
                      <option value="diesel" className="text-gray-900">Diesel</option>
                      <option value="cng" className="text-gray-900">CNG (Compressed Natural Gas)</option>
                      <option value="lpg" className="text-gray-900">LPG (Liquefied Petroleum Gas)</option>
                      <option value="electric" className="text-gray-900">Electric</option>
                      <option value="hybrid" className="text-gray-900">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Condition
                    </label>
                    <select
                      name="vehicleCondition"
                      value={vehicleData.vehicleCondition}
                      onChange={handleChange}
                      className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicleData.vehicleCondition ? "text-gray-900" : "text-gray-400"
                    }`}
                    >
                      <option value="">Select Vehicle Condition</option>
                      <option value="new" className="text-gray-900">New</option>
                      <option value="used" className="text-gray-900">Used</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Add Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="buyNowPrice"
                      value={price}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value) && value.length <= 9) {
                          setPrice(value);
                          handleChange(e);
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
                    Certification Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="certifyStatus"
                    value={vehicleData.certifyStatus}
                    onChange={handleChange}
                     className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicleData.certifyStatus ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    <option value="">Please Select Certification Status</option>
                    <option value="Certified" className="text-gray-900">Certified</option>
                    <option value="Non-Certified" className="text-gray-900">Non-Certified</option>
                  </select>
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
        <section className="lg:mt-6 mt-3 space-y-4 max-h-[55vh] overflow-y-auto  md:hidden block">
          {loading ? (
            <p className="text-center text-indigo-600 font-semibold">
              Loading vehicles...
            </p>
          ) : allVehicles.length === 0 ? (
            <p className="text-center text-gray-600">No vehicles found.</p>
          ) : (
            allVehicles?.map((vehicle) => (
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
                            className="block w-full text-left px-4 py-2 text-sm text-yellow-500 hover:bg-yellow-500 hover:text-white"
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
                              className="block w-full text-left px-4 py-2 text-sm text-green-500 hover:bg-green-500 hover:text-white"
                            >
                              View
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(vehicle.newVehicleId);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white"
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
        </section>
        <section
          className="lg:mt-6 space-y-4 overflow-y-auto  md:block hidden pb-10"
          style={{ maxHeight: "calc(100vh - 210px)" }}
        >
          {loading ? (
            <p className="text-center text-indigo-600 font-semibold">
              Loading vehicles...
            </p>
          ) : allVehicles.length === 0 ? (
            <p className="text-center text-gray-600">No vehicles found.</p>
          ) : (
            allVehicles?.map((vehicle) => (
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

                  <div className="flex flex-wrap gap-1 text-sm text-gray-500 ">
                    <span className=" ">{vehicle.year || "—"}</span>|
                    <span className="">{vehicle.mileage || "—"}KM</span>|
                    <span className=" ">{vehicle.fuelType || "—"}</span>|
                    <span className=" ">{vehicle.color || "—"}</span>|
                    <span className=" ">{vehicle.transmission || "—"}</span>|
                    <span className="">{vehicle.cityName || "—"}</span>|
                    <p
                      className={`text-xs text-center rounded p-1 ${
                        vehicle.approval === "Y"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {vehicle.approval === "Y" ? "Approved" : "Not Approved"}
                    </p>
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
                            className="block w-full text-left px-4 py-2 text-sm text-yellow-500 hover:bg-yellow-500 hover:text-white"
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
                              className="block w-full text-left px-4 py-2 text-sm text-green-500 hover:bg-green-500 hover:text-white"
                            >
                              View
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(vehicle.newVehicleId);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white"
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
          )}{" "}
          <div className="flex justify-between mt-6 px-2 sm:px-4">
            <button
              className={`bg-blue-950 text-white px-5 py-2 rounded  ${
                pageNo > 1 ? "block" : "hidden"
              }`}
              onClick={handlePrevPage}
            >
              ‹ Prev
            </button>
            <div></div>
            <button
              className={`bg-blue-950 text-white px-5 py-2 rounded ${
                allVehicles.length === 10 ? "block" : "hidden"
              }`}
              onClick={handleNextPage}
            >
              Next ›
            </button>
          </div>
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
