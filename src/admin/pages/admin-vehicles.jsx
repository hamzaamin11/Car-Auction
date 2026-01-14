import React, { useEffect, useState } from "react";
import { CircleUser, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import CustomSearch from "../../CustomSearch";
import Dropdown from "../../Dropdown";
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
import CarSelector from "../../components/CarSelector";
import CustomAdd from "../../CustomAdd";
import {
  addMake,
  addModel,
  addSeries,
  addYear,
} from "../../components/Redux/SelectorCarSlice";
import EditAdminVehicle from "./EditAdminVehicle";
import { ViewAdminCar } from "../../components/ViewAdminCar";
import { BASE_URL } from "../../components/Contant/URL";
import moment from "moment";
import ViewUserModal from "./ViewUserModal";
import { UserDetailModal } from "../components/UserDetailModal/UserDetail";

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
    description: [],
    image: [],
  };

  const { currentUser } = useSelector((state) => state?.auth);
  const selected = useSelector((state) => state.carSelector);
  const [vehicle, setVehicle] = useState(initialVehicleState);

  console.log("Add a New Vehicle =>", vehicle);
  const [autoDescription, setAutoDescription] = useState(
    initialAutoDescription
  );

  const [allCities, setAllCities] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [userDetail, setUSerDetail] = useState(null);
  console.log("=>>", userDetail);
  const [isOpenBid, setIsOpenBid] = useState(false);
  const [isOpen, setIsOpen] = useState("");
  console.log("isOpen =>", isOpen);
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
  const [showModal, setShowModal] = useState(false);
  const [totalVehicles, setTotalVehicles] = useState([]);

  const currentDate = new Date().toISOString().split("T")[0];

  const initialState = {
    fromDate: currentDate,
    toDate: currentDate,
  };
  const [dateRange, setDateRange] = useState(initialState);

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
    const files = Array.from(e.target.files);
    if (vehicle.image.length + files.length > 5) {
      Swal.fire({
        title: "Error",
        text: "You can add a maximum of 5 images",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    setVehicle((prev) => ({
      ...prev,
      image: [...prev.image, ...files],
    }));

    const previews = files.map((file) => URL.createObjectURL(file));

    setPreviewImages([...previewImages, previews]);

    setSelectedCount(vehicle.image.length + files.length);
    e.target.value = null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPageNo(1);
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
        `${BASE_URL}/ApprovedVehicleListbyDateRange/${currentUser?.role}/${dateRange.fromDate}/${dateRange.toDate}`
      );
      setAllVehicles(res.data || []);
      setTotalVehicles(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setDateRange((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSelectDescription = (id, value) => {
    setAutoDescription((prev) => prev.filter((desc) => desc.id !== id));

    setVehicle((prev) => ({
      ...prev,
      description: [...prev.description, value],
    }));
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

  const handleTotalVehicles = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getApprovedVehicles/${currentUser?.role}`
      );
      console.log(res.data);
      setTotalVehicles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cityOptions =
    allCities?.map((city) => ({
      label: city.cityName,
      value: city.id,
    })) || [];

  const driveTypeOptions = [
    { label: "FWD (Front-Wheel Drive)", value: "fwd" },
    { label: "RWD (Rear-Wheel Drive)", value: "rwd" },
    { label: "AWD (All-Wheel Drive)", value: "awd" },
    { label: "4WD (Four-Wheel Drive)", value: "4wd" },
  ];

  const bodyStyleOptions = [
    ...bodyStyles.map((style) => ({ label: style, value: style })),
  ];

  const transmissionOptions = [
    { label: "Automatic", value: "Automatic" },
    { label: "Manual", value: "Manual" },
  ];

  const colorOptions = [
    ...carColors.map((color) => ({ label: color, value: color })),
  ];

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
        text:
          "Something went wrong while deleting the vehicle" ||
          error.response.data.message,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };
  const handleViewUserDetail = async (id) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getUserDetailsApprovedVehicleListById/${id}`
      );

      setUSerDetail(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = (prev) => setViewModal(!prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    for (const [key, value] of Object.entries(vehicle)) {
      if (key === "image") {
        if (!value || value.length === 0) {
          Swal.fire({
            title: "Error",
            text: "Please upload at least one image",
            icon: "error",
            confirmButtonColor: "#9333ea",
          });
          setLoading(false);
          return;
        }
      } else if (!value || value.toString().trim() === "") {
        Swal.fire({
          title: "Error",
          text: `Please fill out the ${key} field`,
          icon: "error",
          confirmButtonColor: "#9333ea",
        });
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
      setPrice("");
      setSelectedCount(0);
      setPreviewImages([]);
      await Swal.fire({
        title: "Success!",
        text: "Vehicle Added successfully.",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        timerProgressBar: true,
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

  const toggleActionMenu = (vehicleId) => {
    setActionMenuOpen((prev) => (prev === vehicleId ? null : vehicleId));
  };

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleOutsideClick = (e, vehicleId) => {
    if (actionMenuOpen === vehicleId && !e.target.closest(".action-menu")) {
      setActionMenuOpen(null);
    }
  };

  //  CLIENT-SIDE PAGINATION + SEARCH
  useEffect(() => {
    let filtered = allVehicles;

    if (search) {
      filtered = allVehicles.filter((v) =>
        `${v.make} ${v.model} ${v.year} ${v.series}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    const start = (pageNo - 1) * 10;
    const end = start + 10;
    setFilteredVehicles(filtered.slice(start, end));
  }, [allVehicles, search, pageNo]);

  const totalItems = search ? filteredVehicles.length : allVehicles.length;
  const totalPages = Math.ceil(
    allVehicles.filter(
      (v) =>
        !search ||
        `${v.make} ${v.model} ${v.year} ${v.series}`
          .toLowerCase()
          .includes(search.toLowerCase())
    ).length / 10
  );

  const goToPage = (page) => {
    setPageNo(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (pageNo <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (pageNo >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = pageNo - 2; i <= pageNo + 2; i++) pages.push(i);
    }
    return pages;
  };

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
    handleTotalVehicles();
  }, []);

  useEffect(() => {
    handleGetVehicles();
  }, [dateRange]);

  return (
    <div className="max-h-screen bg-white p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between lg:items-start items-center w-full gap-4 mb-6">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800 ">
          Vehicle Lists
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
          <CustomSearch
            placeholder="Search By Car Name..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <CustomAdd
          text="Add Vehicle"
          onClick={() => {
            setShowModal(true);
            dispatch(addYear(""));
            dispatch(addMake(""));
            dispatch(addModel(""));
            dispatch(addSeries(""));
            setVehicle(initialVehicleState);
            setPrice("");
            setSelectedCount(0);
          }}
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-800 mb-2 font-semibold text-2xl">
          Total Approval Vehicles: {allVehicles.length}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-800 mb-1">
              From Date :
            </label>
            <input
              type="date"
              name="fromDate"
              onChange={handleChangeDate}
              value={dateRange.fromDate}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-800 mb-1">
              To Date :
            </label>
            <input
              type="date"
              name="toDate"
              onChange={handleChangeDate}
              value={dateRange.toDate}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed  inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30 px-4 sm:px-6">
          <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto p-4 sm:p-6 rounded-lg relative  border">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Add a New Vehicle
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-700 text-3xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  options={cityOptions}
                  value={
                    cityOptions.find((c) => c.value === vehicle.locationId) ||
                    null
                  }
                  onChange={(option) =>
                    setVehicle((prev) => ({
                      ...prev,
                      locationId: option?.value || "",
                    }))
                  }
                  placeholder="Select City"
                  isSearchable
                />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Vehicle Drive Type <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    options={driveTypeOptions}
                    value={
                      driveTypeOptions.find(
                        (d) => d.value === vehicle.driveType
                      ) || null
                    }
                    onChange={(opt) =>
                      setVehicle((prev) => ({
                        ...prev,
                        driveType: opt?.value || "",
                      }))
                    }
                    placeholder="Select Drive Type"
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
                        (b) => b.value === vehicle.bodyStyle
                      ) || null
                    }
                    onChange={(option) =>
                      setVehicle((prev) => ({
                        ...prev,
                        bodyStyle: option?.value || "",
                      }))
                    }
                    placeholder="Select Body Style"
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
                        (t) => t.value === vehicle.transmission
                      ) || null
                    }
                    onChange={(option) =>
                      setVehicle((prev) => ({
                        ...prev,
                        transmission: option?.value || "",
                      }))
                    }
                    placeholder="Select Vehicle Transmission"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Meter Reading{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="mileage"
                    value={vehicle.mileage || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^[1-9][0-9]{0,6}$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    placeholder="Meter Reading (KM)"
                    inputMode="numeric"
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
                      colorOptions.find((c) => c.value === vehicle.color) ||
                      null
                    }
                    onChange={(option) =>
                      setVehicle((prev) => ({
                        ...prev,
                        color: option?.value || "",
                      }))
                    }
                    placeholder="Select Vehicle Color"
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
                        (f) => f.value === vehicle.fuelType
                      ) || null
                    }
                    onChange={(option) =>
                      setVehicle((prev) => ({
                        ...prev,
                        fuelType: option?.value || "",
                      }))
                    }
                    placeholder="Select Fuel type"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Condition <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    options={conditionOptions}
                    value={
                      conditionOptions.find(
                        (c) => c.value === vehicle.vehicleCondition
                      ) || null
                    }
                    onChange={(option) =>
                      setVehicle((prev) => ({
                        ...prev,
                        vehicleCondition: option?.value || "",
                      }))
                    }
                    placeholder="Select Vehicle Condition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Reserve Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="buyNowPrice"
                    value={vehicle.buyNowPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^[1-9][0-9]{0,8}$/.test(value)) {
                        setPrice(value);
                        setVehicle((prev) => ({
                          ...prev,
                          buyNowPrice: value,
                        }));
                      }
                    }}
                    onBlur={() => {
                      if (price && parseInt(price) < 100000) {
                        Swal.fire({
                          title: "Error!",
                          text: "VEHICLE PRICE MUST BE 6 DIGITS.",
                          icon: "error",
                          confirmButtonColor: "#9333ea",
                        });
                        setPrice("");
                        setVehicle((prev) => ({
                          ...prev,
                          buyNowPrice: "",
                        }));
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Status <span className="text-red-500">*</span>
                </label>
                <Dropdown
                  options={certifyOptions}
                  value={
                    certifyOptions.find(
                      (c) => c.value === vehicle.certifyStatus
                    ) || null
                  }
                  onChange={(option) =>
                    setVehicle((prev) => ({
                      ...prev,
                      certifyStatus: option?.value || "",
                    }))
                  }
                  placeholder="Select Certification Status"
                />
              </div>

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
                      vehicle.description.length < 50
                        ? "text-red-500"
                        : "text-gray-600"
                    }`}
                  >
                    Remaining character:({995 - vehicle.description.length})
                  </span>
                </div>
              </div>
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
                      onClick={() =>
                        handleSelectDescription(desc.id, desc.value)
                      }
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
                    {showMore
                      ? "Show less suggestions"
                      : "Show more suggestions"}
                  </button>
                </div>
              </div>

              <div className="col-span-1 sm:col-span-2 mt-4">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Images <span className="text-red-500">*</span>
                  </label>

                  {/* Upload Box */}
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="vehicleImage"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition shadow-sm"
                    >
                      <div className="flex flex-col items-center justify-center pt-4 pb-4">
                        <svg
                          className="w-12 h-12 mb-3 text-gray-400"
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
                          <span className="font-semibold text-indigo-600">
                            Click to upload
                          </span>
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG (Max 5MB)
                        </p>
                        <p className="text-xs text-gray-400 px-4 text-center">
                          Maximum 5 images — first image will be used as the
                          cover
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

                  {/* Preview Images */}
                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                      {previewImages.map((src, index) => (
                        <div
                          key={index}
                          className="relative border rounded-xl shadow-sm overflow-hidden"
                        >
                          <img
                            src={src}
                            alt="preview"
                            className="h-28 w-full object-cover"
                          />

                          {/* Remove Image Button */}
                          <div
                            onClick={() => {
                              const updatedPreviews = previewImages.filter(
                                (_, i) => i !== index
                              );
                              const updatedImages = vehicle.image.filter(
                                (_, i) => i !== index
                              );
                              setPreviewImages(updatedPreviews);
                              setVehicle((prev) => ({
                                ...prev,
                                image: updatedImages,
                              }));
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

                {/* Submit Button */}
                <div className="flex justify-center mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-950 text-white px-6 py-2.5 rounded-lg shadow-md hover:bg-blue-900 transition"
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

      {/* Vehicle List */}
      <div className="max-w-7xl mx-auto px-2 lg:px-0 ">
        {filteredVehicles?.length > 0 ? (
          <div className="overflow-x-auto rounded">
            <table className="w-full border-collapse border  overflow-hidden">
              <thead className="bg-blue-950 text-white">
                <tr>
                  <th className="p-3 text-center text-sm font-semibold text-white">
                    Sr
                  </th>
                  <th className="p-1 text-left text-sm font-semibold ">
                    Seller Name
                  </th>
                  <th className="p-1 text-left text-sm font-semibold ">
                    Vehicle Name
                  </th>
                  <th className="p-1 text-left text-sm font-semibold ">Lot#</th>
                  <th className="p-1 text-left text-sm font-semibold ">Year</th>
                  <th className="p-1 text-left text-sm font-semibold ">
                    Fuel Type
                  </th>

                  <th className="p-1 text-left text-sm font-semibold ">
                    Color
                  </th>
                  <th className="p-1 text-left text-sm font-semibold ">City</th>
                  <th className="p-1 text-left text-sm font-semibold ">
                    Date / Time
                  </th>
                  <th className="p-1 text-left text-sm font-semibold">
                    Resverse Price
                  </th>
                  <th className="p-1 text-left text-sm font-semibold ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredVehicles.map((vehicle, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                    onClick={(e) => handleOutsideClick(e, vehicle.id)}
                  >
                    <p className="  text-center pt-4  text-gray-600">
                      {index + 1}
                    </p>

                    <td
                      className="p-1 hover:cursor-pointer"
                      onClick={() => {
                        handleIsOpenToggle("detail");
                        handleViewUserDetail(vehicle.userId);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <CircleUser
                          size={"30"}
                          style={{
                            color: "gray",
                          }}
                        />
                        <span className="text-sm text-gray-600 capitalize">
                          {vehicle?.username}
                        </span>
                      </div>
                    </td>

                    {/* Vehicle Column with Image and Name */}
                    <td className="p-1">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                          onClick={() => handleViewClick(vehicle)}
                        >
                          {vehicle.images && vehicle.images.length > 0 ? (
                            <img
                              src={vehicle.images[0]}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="h-full w-full object-cover rounded-full"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div
                          className="cursor-pointer min-w-0"
                          onClick={() => handleViewClick(vehicle)}
                        >
                          <h2 className="text-sm font-bold text-gray-800 truncate">
                            {vehicle.make.charAt(0).toUpperCase() +
                              vehicle.make.slice(1)}{" "}
                            {vehicle.model.charAt(0).toUpperCase() +
                              vehicle.model.slice(1)}
                          </h2>
                          <p className="text-xs text-gray-500 truncate">
                            {vehicle.series.charAt(0).toUpperCase() +
                              vehicle.series.slice(1)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.lot_number}
                      </span>
                    </td>
                    {/* Year */}
                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.year}
                      </span>
                    </td>

                    {/* Fuel Type */}
                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.fuelType.charAt(0).toUpperCase() +
                          vehicle.fuelType.slice(1)}
                      </span>
                    </td>

                    {/* Color */}
                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.color.charAt(0).toUpperCase() +
                          vehicle.color.slice(1)}
                      </span>
                    </td>

                    {/* City */}
                    <td className="p-1">
                      <span className="text-sm text-gray-600">
                        {vehicle.cityName?.charAt(0)?.toUpperCase() +
                          vehicle.cityName?.slice(1) || "--"}
                      </span>
                    </td>
                    {/* Time Stamp */}
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex flex-col">
                        <span>
                          {vehicle?.VehicleCreatedAt
                            ? new Date(
                                vehicle?.VehicleCreatedAt
                              ).toLocaleDateString("en-GB")
                            : "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {vehicle?.VehicleCreatedAt
                            ? moment(vehicle?.VehicleCreatedAt)
                                .local()
                                .format("hh:mm A")
                            : "--"}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-1">
                      <span className="text-sm font-semibold text-gray-700">
                        PKR {vehicle.buyNowPrice}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-1">
                      <div className="relative">
                        <button
                          onClick={() => toggleActionMenu(vehicle.id)}
                          className="p-2 rounded-full hover:bg-gray-200 transition"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-600" />
                        </button>

                        {actionMenuOpen === vehicle.id && (
                          <div className="absolute right-0 mt-4 -translate-y-full w-32 bg-white border rounded-lg shadow-lg z-50">
                            <button
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setEditModalOpen(true);
                                setActionMenuOpen(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-100 text-left flex items-center gap-2 rounded-t-lg"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              onClick={() => handleViewClick(vehicle)}
                              className="w-full px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-100 text-left flex items-center gap-2"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              View
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteVehicle(vehicle.id);
                                setActionMenuOpen(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left flex items-center gap-2 rounded-b-lg"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No vehicles found. Please add a vehicle or change your date range.
          </p>
        )}
      </div>

      {/*  PAGINATION  */}
      {allVehicles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
            <div className="text-gray-600">
              Showing{" "}
              <span className="font-medium">{(pageNo - 1) * 10 + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(
                  pageNo * 10,
                  allVehicles.filter(
                    (v) =>
                      !search ||
                      `${v.make} ${v.model} ${v.year} ${v.series}`
                        .toLowerCase()
                        .includes(search.toLowerCase())
                  ).length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium">
                {
                  allVehicles.filter(
                    (v) =>
                      !search ||
                      `${v.make} ${v.model} ${v.year} ${v.series}`
                        .toLowerCase()
                        .includes(search.toLowerCase())
                  ).length
                }
              </span>{" "}
              entries
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={pageNo === 1}
                className={`px-3 py-1 rounded border ${
                  pageNo === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {"<<"}
              </button>
              <button
                onClick={() => goToPage(pageNo - 1)}
                disabled={pageNo === 1}
                className={`px-3 py-1 rounded border ${
                  pageNo === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {"<"}
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded border ${
                    pageNo === page
                      ? "bg-blue-950 text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(pageNo + 1)}
                disabled={pageNo >= totalPages}
                className={`px-3 py-1 rounded border ${
                  pageNo >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {">"}
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={pageNo >= totalPages}
                className={`px-3 py-1 rounded border ${
                  pageNo >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      )}

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
      {isOpen === "detail" && (
        <UserDetailModal
          isOpen={isOpen}
          closeModal={() => handleIsOpenToggle("")}
          userDetail={userDetail}
        />
      )}

      <ToastContainer />
    </div>
  );
}

export default AddAdminVehicle;
