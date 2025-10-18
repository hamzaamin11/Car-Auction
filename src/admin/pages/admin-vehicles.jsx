import React, { useContext, useEffect, useState } from "react";
import { SidebarClose, MoreVertical } from "lucide-react";
import VehicleContext from "../../context/VehicleContext";
import { useAuth } from "../../context/AuthContext";
import EditAdminVehicle from "./EditAdminVehicle";
import { BASE_URL } from "../../components/Contant/URL";
import { ViewAdminCar } from "../../components/ViewAdminCar";
import { useDispatch, useSelector } from "react-redux";
import {
  navigationStart,
  navigationSuccess,
} from "../../components/Redux/NavigationSlice";
import { RotateLoader } from "../../components/Loader/RotateLoader";
import { AdminAddBid } from "../../components/AdminAddBidComponent/AdminAddBid";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Select from "react-select";
import CarSelector from "../../components/CarSelector";
import {
  addMake,
  addModel,
  addSeries,
  addYear,
} from "../../components/Redux/SelectorCarSlice";

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

function AddAdminVehicle({ open, setOpen, onVehicleUpdated }) {
  const initialVehicleState = {
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

  const { currentUser } = useSelector((state) => state?.auth);
  const selected = useSelector((state) => state.carSelector);
  const [vehicle, setVehicle] = useState(initialVehicleState);
  const [allCities, setAllCities] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [isOpenBid, setIsOpenBid] = useState(false);
  const [isOpen, setIsOpen] = useState("");
  const [viewBider, setViewBider] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getVehicleId, setGetVehicleId] = useState(null);
  const [allBidCustomer, setAllBidCustomer] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [selectedCount, setSelectedCount] = useState(0);
  const [price, setPrice] = useState("");
  const { getVehicles, delVehicle, getAllVehicles } =
    useContext(VehicleContext);
  const { user } = useAuth();
  const dispatch = useDispatch();

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

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedCount(files.length);
    handleAddedImage(e);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPageNo(1); // Reset to page 1 on search
  };

  const handleSearchable = (selectedOption) => {
    setVehicle((prev) => ({
      ...prev,
      locationId: selectedOption.value,
    }));
  };

  const handleGetVehicles = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getApprovedVehicles?page=${pageNo}&entry=10`
      );
      setAllVehicles(res.data);
      setFilteredVehicles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllCities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`);
      setAllCities(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const cityData = [
    { label: "Select City", value: "" },
    ...(allCities?.map((city) => ({
      label: city.cityName,
      value: city.id,
    })) || []),
  ];

  const handleIsOpenToggle = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleUpdateCarInfo = () => {
    handleIsOpenToggle("selector");
  };

  const handleDeleteVehicle = async (id) => {
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
      await axios.patch(`${BASE_URL}/seller/deleteVehicle/${id}`);
      handleGetVehicles();
      await Swal.fire({
        title: "Deleted!",
        text: "The vehicle has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Error!",
        text: "Something went wrong while deleting the vehicle.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  const handleAddedImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) return toast.error("You can add maximum 5 images");
    setVehicle((prev) => ({
      ...prev,
      image: [...prev.image, ...files],
    }));
  };

  const handleToggle = (prev) => setViewModal(!prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    for (const [key, value] of Object.entries(vehicle)) {
      if (key === "image") {
        if (!value || value.length === 0) {
          toast.error("Please upload at least one image");
          setLoading(false);
          return;
        }
      } else if (!value || value.toString().trim() === "") {
        toast.error(`Please fill out the ${key} field`);
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("userId", currentUser?.id);

    Object.entries(vehicle).forEach(([key, value]) => {
      if (key === "image" && Array.isArray(value)) {
        value.forEach((file) => {
          formData.append("image", file);
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      const res = await fetch(`${BASE_URL}/addVehicleForAdmin`, {
        method: "POST",
        body: formData,
      });

      setVehicle(initialVehicleState);
      handleGetVehicles();
      setShowModal(false);
      setLoading(false);
      await Swal.fire({
        title: "Success!",
        text: "Vehicle Added successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
      });
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      console.log(error);
      setLoading(false);
    }
  };

  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setViewModal(true);
    setActionMenuOpen(null);
  };

  const handleBidAddedbtn = (id) => {
    setViewBider(true);
    setGetVehicleId(id);
    setActionMenuOpen(null);
  };

  const handleViewBidClose = () => setViewBider(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setVehicle((prev) => ({
      ...prev,
      year: selected?.year,
      make: selected?.make,
      model: selected?.model,
      series: selected?.series,
    }));
  }, [selected]);

  useEffect(() => {
    handleGetAllCities();
  }, []);

  useEffect(() => {
    handleGetVehicles();
  }, [pageNo]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredVehicles(allVehicles);
    } else {
      const filtered = allVehicles.filter((vehicle) =>
        `${vehicle.make} ${vehicle.model} ${vehicle.series}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      setFilteredVehicles(filtered);
    }
  }, [search, allVehicles]);

  const toggleActionMenu = (vehicleId) => {
    setActionMenuOpen((prev) => (prev === vehicleId ? null : vehicleId));
  };

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 0);
  };

  const handleOutsideClick = (e, vehicleId) => {
    if (actionMenuOpen === vehicleId && !e.target.closest(".action-menu")) {
      setActionMenuOpen(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between lg:items-start items-center w-full gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 ">
          Vehicle List
        </h2>
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
          <input
            type="text"
            placeholder="Search By Car Name..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 placeholder:text-xs sm:placeholder:text-sm rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            dispatch(addYear(""));
            dispatch(addMake(""));
            dispatch(addModel(""));
            dispatch(addSeries(""));
          }}
          className="bg-[#191970] hover:bg-blue-900 text-white font-medium py-2 px-4 text-sm rounded shadow transition-all duration-200 w-full sm:w-auto"
        >
          Add Vehicle
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30 px-4 sm:px-6">
          <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto p-4 sm:p-6 rounded-lg relative">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Add a New Vehicle
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-700 text-3xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <Select onChange={handleSearchable} options={cityData} />
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Car Info <span className="text-red-500">*</span>
                  </label>
                  <input
                    onClick={handleUpdateCarInfo}
                    value={`${selected?.year || ""} ${selected?.make || ""} ${
                      selected?.model || ""
                    } ${selected?.series || ""}`}
                    placeholder="Year/Make/Model/Version"
                    readOnly
                    className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      (selected.year && selected.make && selected.model) ||
                      selected.series
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
                     <select
                    name="driveType"
                    value={vehicle.driveType}
                    onChange={handleChange}
                    className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicle.driveType ? "text-gray-900" : "text-gray-400"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1 ">
                    Vehicle Body Style <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bodyStyle"
                    value={vehicle.bodyStyle}
                    onChange={handleChange}
                    className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicle.bodyStyle ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    <option className="" value={""}>Please Select BodyStyle</option>
                    {bodyStyles?.map((body) => (
                      <option key={body} value={body} className="text-gray-900">
                        {body}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Transmission Type{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="transmission"
                    value={vehicle?.transmission || ""}
                    onChange={handleChange}
                    className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicle?.transmission ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    <option value={"" }>Please Select Transmission Type</option>
                    <option value={"Automatic"} className="text-gray-900">Automatic</option>
                    <option value={"Manual"} className="text-gray-900">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Meter Reading{" "}
                    <span className="text-red-500">*</span>
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
                  className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicle.color ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    <option value={""} >Please Select Color</option>
                    {carColors?.map((color) => (
                      <option key={color} value={color} className="text-gray-900">
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Fuel Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="fuelType"
                    value={vehicle.fuelType}
                    onChange={handleChange}
                     className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicle.fuelType ? "text-gray-900" : "text-gray-400"
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
                    Vehicle Condition <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vehicleCondition"
                    value={vehicle.vehicleCondition}
                    onChange={handleChange}
                     className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicle.vehicleCondition ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    <option value="">Select Vehicle Condition</option>
                    <option value="new" className="text-gray-900">New</option>
                    <option value="used" className="text-gray-900">Used</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Vehicle Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="buyNowPrice"
                    value={vehicle.buyNowPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && value.length <= 9) {
                        setPrice(value);
                        setVehicle((prev) => ({
                          ...prev,
                          buyNowPrice: value,
                        }));
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
                  value={vehicle.certifyStatus}
                  onChange={handleChange}
                  className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full ${
                      vehicle.certifyStatus ? "text-gray-900" : "text-gray-400"
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
                    type="submit"
                    disabled={loading}
                    className="bg-[#191970] text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
                  >
                    {loading ? "loading..." : "Submit Vehicle"}
                  </button>
                </div>
              </div>
            </form>
            {isOpen === "selector" && (
              <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
                <div className="w-full max-w-5xl bg-white p-4 sm:p-6 rounded-lg shadow-lg relative">
                  <CarSelector
                    handleIsOpenToggle={() => handleIsOpenToggle("")}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-4 px-2 sm:px-4">
        {filteredVehicles?.length > 0 ? (
          filteredVehicles.map((vehicle, index) => (
            <div
              key={index}
              onClick={(e) => handleOutsideClick(e, vehicle.id)}
              className="relative"
            >
              {/* Desktop: Card View */}
              <div className="hidden lg:flex flex-col lg:flex-row items-start lg:items-center justify-between border rounded-lg hover:shadow-md transition-all duration-200 p-4 gap-4">
                <div
                  className="relative w-full lg:w-40 h-40 lg:h-24 flex-shrink-0 rounded-md overflow-hidden"
                  onClick={() => handleViewClick(vehicle)}
                >
                  {vehicle.images ? (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div
                  className="flex-1 px-0 lg:px-4"
                  onClick={() => handleViewClick(vehicle)}
                >
                  <h2 className="text-base font-bold text-gray-800">
                    {vehicle.make.charAt(0).toUpperCase() +
                      vehicle.make.slice(1)}{" "}
                    {vehicle.model.charAt(0).toUpperCase() +
                      vehicle.model.slice(1)}{" "}
                    {vehicle.series.charAt(0).toUpperCase() +
                      vehicle.series.slice(1)}
                  </h2>
                  <p className="text-lg font-bold text-gray-800">
                    PKR {vehicle.buyNowPrice}
                  </p>
                  <p className="text-sm text-gray-500">
                    {vehicle.year} |{" "}
                    {vehicle.fuelType.charAt(0).toUpperCase() +
                      vehicle.fuelType.slice(1)}{" "}
                    |{" "}
                    {vehicle.transmission.charAt(0).toUpperCase() +
                      vehicle.transmission.slice(1)}{" "}
                    | {vehicle.mileage || "--"} KM |{" "}
                    {vehicle.color.charAt(0).toUpperCase() +
                      vehicle.color.slice(1)}{" "}
                    |{" "}
                    {vehicle.cityName?.charAt(0)?.toUpperCase() +
                      vehicle.cityName?.slice(1) || "--"}
                  </p>
                </div>
                <div className="w-full lg:w-auto text-left lg:text-right relative action-menu">
                  <button
                    onClick={() => toggleActionMenu(vehicle.id)}
                    className="p-2 rounded-full hover:bg-gray-200 transition"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                  {actionMenuOpen === vehicle.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setEditModalOpen(true);
                          setActionMenuOpen(null);
                        }}
                        className="w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-100 text-left"
                      >
                        Edit
                      </button>
                      {vehicle.saleStatus === "upcoming" ||
                      vehicle.saleStatus === "sold" ? (
                        <button className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left opacity-50 cursor-not-allowed">
                          Bid Added
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsOpenBid(true);
                            setActionMenuOpen(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left"
                        >
                          Add Bid
                        </button>
                      )}
                      <button
                        onClick={() => handleViewClick(vehicle)}
                        className="w-full px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-100 text-left"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteVehicle(vehicle.id);
                          setActionMenuOpen(null);
                        }}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile: List View */}
              <div className="lg:hidden border-b py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100"
                    onClick={() => handleViewClick(vehicle)}
                  >
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                        No Img
                      </div>
                    )}
                  </div>
                  <div
                    className="flex-1"
                    onClick={() => handleViewClick(vehicle)}
                  >
                    <h2 className="text-sm font-bold text-gray-800">
                      {vehicle.make.charAt(0).toUpperCase() +
                        vehicle.make.slice(1)}{" "}
                      {vehicle.model.charAt(0).toUpperCase() +
                        vehicle.model.slice(1)}{" "}
                      {vehicle.series.charAt(0).toUpperCase() +
                        vehicle.series.slice(1)}
                    </h2>
                    <p className="text-xs text-gray-700 font-semibold">
                      PKR {vehicle.buyNowPrice}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vehicle.year} |{" "}
                      {vehicle.fuelType.charAt(0).toUpperCase() +
                        vehicle.fuelType.slice(1)}{" "}
                      |{" "}
                      {vehicle.transmission.charAt(0).toUpperCase() +
                        vehicle.transmission.slice(1)}{" "}
                      | {vehicle.mileage || "--"} KM |{" "}
                      {vehicle.color.charAt(0).toUpperCase() +
                        vehicle.color.slice(1)}{" "}
                      |{" "}
                      {vehicle.cityName?.charAt(0)?.toUpperCase() +
                        vehicle.cityName?.slice(1) || "--"}
                    </p>
                  </div>
                  <div className="relative action-menu">
                    <button
                      onClick={() => toggleActionMenu(vehicle.id)}
                      className="p-2 rounded-full hover:bg-gray-200 transition"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600" />
                    </button>
                    {actionMenuOpen === vehicle.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setEditModalOpen(true);
                            setActionMenuOpen(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-100 text-left"
                        >
                          Edit
                        </button>
                        {vehicle.saleStatus === "upcoming" ||
                        vehicle.saleStatus === "sold" ? (
                          <button className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left opacity-50 cursor-not-allowed">
                            Bid Added
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setIsOpenBid(true);
                              setActionMenuOpen(null);
                            }}
                            className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left"
                          >
                            Add Bid
                          </button>
                        )}
                        <button
                          onClick={() => handleViewClick(vehicle)}
                          className="w-full px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-100 text-left"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteVehicle(vehicle.id);
                            setActionMenuOpen(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">
            No vehicles found. Please add a vehicle or adjust your search.
          </p>
        )}
      </div>

      <div className="flex justify-between mt-6 px-2 sm:px-4">
        <button
          className={`bg-[#191970] text-white px-5 py-2 rounded  ${
            pageNo > 1 ? "block" : "hidden"
          }`}
          onClick={handlePrevPage}
        >
          ‹ Prev
        </button>
        <div></div>
        <button
          className={`bg-[#191970] text-white px-5 py-2 rounded ${
            allVehicles.length === 10 ? "block" : "hidden"
          }`}
          onClick={handleNextPage}
        >
          Next ›
        </button>
      </div>

      <EditAdminVehicle
        open={editModalOpen}
        setOpen={setEditModalOpen}
        selectedVehicle={selectedVehicle}
        onVehicleUpdated={handleGetVehicles}
      />
      {viewModal && (
        <ViewAdminCar
          handleClick={handleToggle}
          selectedVehicle={selectedVehicle}
        />
      )}
      {isOpenBid && (
        <AdminAddBid
          selectedVehicle={selectedVehicle}
          setIsOpenBid={setIsOpenBid}
          getAllVehicles={handleGetVehicles}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default AddAdminVehicle;