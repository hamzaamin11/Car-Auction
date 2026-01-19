import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../components/Contant/URL";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
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
import Dropdown from "../Dropdown";
import { UserDetailModal } from "../admin/components/UserDetailModal/UserDetail";
import { CircleUser } from "lucide-react";

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

const currentDate = new Date().toISOString().split("T")[0];

const initialState = {
  fromDate: currentDate,
  toDate: currentDate,
};

const AddVehicles = () => {
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";
  const { currentUser } = useSelector((state) => state?.auth);
  const [isSellerBidModalOpen, setIsSellerBidModalOpen] = useState(false);
  const [sellerBidData, setSellerBidData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [isCustomerBidModalOpen, setIsCustomerBidModalOpen] = useState(false);

  const [dateRange, setDateRange] = useState(initialState);

  const [autoDescription, setAutoDescription] = useState(
    initialAutoDescription,
  );
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
    description: "",
    images: [],
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
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
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
  const [userDetail, setUSerDetail] = useState(null);

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
    if (!num || isNaN(num)) return "";
    num = parseInt(num);
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

  /* ----------------------------------------------------- */
  /*  Handle file upload                                  */
  /* ----------------------------------------------------- */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;

    if (totalImages > 5) {
      Swal.fire({
        title: "Limit Exceeded",
        text: "You can add a maximum of 5 images.",
        icon: "warning",
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

    // Update vehicle data with all images
    const allImagePreviews = [...imagePreviews, ...newPreviews];
    setVehicleData((prev) => ({
      ...prev,
      images: allImagePreviews,
    }));

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

      // Revoke object URL to prevent memory leak
      URL.revokeObjectURL(imagePreviews[index]);
    }

    // Update image previews
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);

    // Update selected count
    setSelectedCount((prev) => prev - 1);

    // Update vehicle images array
    setVehicleData((prev) => ({
      ...prev,
      images: updatedPreviews,
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

  const handleSelectDescription = (id, value) => {
    setAutoDescription((prev) => prev.filter((desc) => desc.id !== id));

    setVehicleData((prev) => ({
      ...prev,
      description: prev.description ? `${prev.description}\n${value}` : value,
    }));
  };

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setDateRange((prevState) => ({ ...prevState, [name]: value }));
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
        `${BASE_URL}/getVehiclesByUserbyDateRange/${currentUser?.id}/${
          dateRange.fromDate
        }/${dateRange.toDate}?search=${search}&Entry=${10}&page=${pageNo}`,
      );
      setAllVehicles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllVehicleById();
  }, [search, pageNo, dateRange]);

  // Auto-select the user's saved city when "Add Vehicle" form opens
  useEffect(() => {
    if (formOpen && currentUser?.city && allCities.length > 0) {
      const userCity = allCities.find(
        (city) =>
          city.cityName.toLowerCase() === currentUser.city.toLowerCase(),
      );

      if (userCity) {
        setVehicleData((prev) => ({
          ...prev,
          locationId: userCity.id.toString(),
        }));
      }
    }
  }, [formOpen, currentUser?.city, allCities]);

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

    setVehicleData({
      ...vehicle,
      buyNowPrice: rawPrice,
      images: vehicle.images || [],
    });

    // Set existing images and previews
    setExistingImages(vehicle.images || []);
    setImagePreviews(vehicle.images || []);
    setNewImages([]);
    setSelectedCount(vehicle.images?.length || 0);
    setPrice(rawPrice);
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
        buyNowPrice: parsedValue.toString(),
      }));
    }
  };

  /* ----------------------------------------------------- */
  /*  Clean up object URLs on unmount                     */
  /* ----------------------------------------------------- */
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        // Only revoke URLs for new images (blob URLs)
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  /* ----------------------------------------------------- */
  /*  Submit form                                         */
  /* ----------------------------------------------------- */
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

    // Check if we have at least one image
    if (imagePreviews.length === 0) {
      Swal.fire({
        title: "Missing Field",
        text: "At least one image is required.",
        icon: "error",
        confirmButtonColor: "#ef4444",
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
    };

    for (let field in requiredFields) {
      if (!vehicleData[field] || vehicleData[field] === "") {
        Swal.fire({
          title: "Missing Field",
          text: `${requiredFields[field]} is required.`,
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
        return;
      }
    }

    if (vehicleData.buyNowPrice < 10000) {
      await Swal.fire({
        title: "Invalid Price",
        text: "Vehicle price must be at least 10000",
        icon: "error",
        confirmButtonColor: "#9333ea",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("userId", currentUser?.id);

    // IMPORTANT: Only append each field once
    // List all fields that should be sent
    const fieldsToSend = [
      "year",
      "make",
      "model",
      "series",
      "bodyStyle",
      "transmission",
      "driveType",
      "fuelType",
      "color",
      "mileage",
      "vehicleCondition",
      "locationId",
      "buyNowPrice",
      "certifyStatus",
      "description",
    ];

    fieldsToSend.forEach((field) => {
      if (vehicleData[field] !== undefined && vehicleData[field] !== null) {
        formData.append(field, vehicleData[field].toString());
      }
    });

    // Append existing images (as JSON array) only for edit mode
    if (editId && existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }

    // Append new images (as files)
    newImages.forEach((file) => {
      formData.append("image", file);
    });

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `${BASE_URL}/seller/updateVehicle/${editId}`
      : `${BASE_URL}/seller/addVehicle`;

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Submission failed.");
      }

      // Reset form
      setVehicleData(initialFields);
      setExistingImages([]);
      setNewImages([]);
      setImagePreviews([]);
      setSelectedCount(0);
      setPrice("");
      setFormOpen(false);
      setEditId(null);

      Swal.fire({
        title: "Success!",
        text: editId
          ? "Vehicle updated successfully"
          : "Vehicle added successfully",
        icon: "success",
        confirmButtonColor: "#10b981",
        timer: 3000,
        timerProgressBar: true,
      });

      handleGetAllVehicleById();
    } catch (err) {
      setErrorMsg(err.message);
      Swal.fire({
        title: "Error",
        text: err.message || "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewUserDetail = async (id) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getUserDetailsApprovedVehicleListById/${id}`,
      );

      setUSerDetail(res.data?.data);
    } catch (error) {
      console.log(error);
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
    if (formOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [formOpen]);

  const toggleDropdown = (vehicleId) => {
    setIsDropdownOpen((prev) => (prev === vehicleId ? null : vehicleId));
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(null);
  };

  const carInfoValue = `${selected?.year || vehicleData?.year} ${
    selected?.make || vehicleData?.make
  } ${selected?.model || vehicleData?.model} ${
    selected?.series || vehicleData?.series
  }`.trim();

  const isCarInfoComplete =
    vehicleData.year &&
    vehicleData.make &&
    vehicleData.model &&
    vehicleData.series;

  return (
    <div
      className="max-h-screen lg:p-6 px-2 bg-gradient-to-br from-gray-100 to-blue-50"
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
                setExistingImages([]);
                setNewImages([]);
                setImagePreviews([]);
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

        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30 px-4">
            <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto p-6 rounded-lg relative border">
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editId ? "Update Vehicle" : "Add a New Vehicle"}
                </h2>
                <button
                  onClick={() => setFormOpen(false)}
                  className="text-red-700 text-3xl hover:text-red-900"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                          String(vehicleData?.locationId),
                      ) || null
                    }
                    onChange={(option) => handleSearchable(option)}
                    placeholder="Select City...."
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 my-1">
                    Car Info <span className="text-red-500">*</span>
                  </label>
                  <input
                    onClick={handleUpdateCarInfo}
                    value={carInfoValue}
                    placeholder="Year/Make/Model/Version"
                    readOnly
                    className={`border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full cursor-pointer ${
                      isCarInfoComplete
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-red-50 text-red-700 border-red-300"
                    }`}
                  />
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
                          (o) => o.value === vehicleData.driveType,
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
                          (o) => o.value === vehicleData.bodyStyle,
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
                          (o) => o.value === vehicleData.transmission,
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
                          (o) => o.value === vehicleData.color,
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
                          (o) => o.value === vehicleData.fuelType,
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
                          (o) => o.value === vehicleData.vehicleCondition,
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
                      Add Reserve Price <span className="text-red-500">*</span>
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
                        {numberToIndianWords(parseInt(price) || 0)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm  text-gray-700 mb-2">
                    Add Description <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    placeholder="Describe your vehicle condition, features, registration details, reason for sale etc."
                    value={vehicleData.description}
                    onChange={(e) =>
                      setVehicleData((prev) => ({
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
                        vehicleData?.description?.length < 50
                          ? "text-red-500"
                          : "text-gray-600"
                      }`}
                    >
                      Remaining character:(
                      {995 - (vehicleData?.description?.length || 0)})
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

                {/* Image Upload Section */}
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
                              {selectedCount} image
                              {selectedCount > 1 ? "s" : ""} selected (
                              {5 - selectedCount} remaining)
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
                          {editId ? "Updating..." : "Submitting..."}
                        </span>
                      ) : editId ? (
                        "Update Vehicle"
                      ) : (
                        "Submit Vehicle"
                      )}
                    </button>
                  </div>
                </div>
              </form>
              {isOpen === "selector" && (
                <div className="fixed inset-0 flex items-center justify-center z-50  ">
                  <div className="w-full max-w-5xl  rounded-lg  relative">
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
                    src={vehicle.images?.[0]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover hover:cursor-pointer"
                    onClick={() => (
                      setSelectVehicle(vehicle),
                      handleIsOpenToggle("View")
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
                    {vehicle.year || "—"} •{" "}
                    {vehicle.fuelType?.charAt(0)?.toUpperCase() +
                      vehicle.fuelType?.slice(1) || "--"}{" "}
                    • {vehicle.transmission || "—"} • {vehicle.cityName || "—"}
                  </p>
                  <p
                    className={`text-[8px] text-center rounded w-16 ${
                      vehicle.approval === "Y"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {vehicle.approval === "Y" ? "Approved" : "Pending"}
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
                                vehicle.approval,
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
                        totalPages,
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
                    },
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
          className="lg:mt-6 overflow-y-auto md:block hidden pb-10"
          style={{ maxHeight: "calc(100vh - 210px)" }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-center text-indigo-600 font-semibold">
                Loading vehicles...
              </p>
            </div>
          ) : currentCars.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-center text-gray-600">No vehicles found.</p>
            </div>
          ) : (
            <>
              {/* Table Container - Matching your desired style */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-blue-950 text-white">
                      <tr>
                        <th className="p-3 text-start text-sm font-semibold">
                          Sr
                        </th>

                        <th className="p-1 text-left text-sm font-semibold">
                          Vehicle Name
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Lot#
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Year
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Fuel Type
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Color
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          City
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Date / Time
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Reserve Price
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Status
                        </th>
                        <th className="p-1 text-left text-sm font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y border-gray-600 border-b">
                      {currentCars?.map((vehicle, index) => (
                        <tr
                          key={vehicle.newVehicleId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Serial Number */}
                          <td className="p-3 text-start text-gray-600">
                            {(currentPage - 1) * carsPerPage + index + 1}
                          </td>

                          {/* Vehicle with Image and Details */}
                          <td className="p-1">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                                onClick={() => {
                                  setSelectVehicle(vehicle);
                                  handleIsOpenToggle("View");
                                }}
                              >
                                <img
                                  src={vehicle.images?.[0]}
                                  alt={`${vehicle.make} ${vehicle.model}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div
                                className="cursor-pointer min-w-0"
                                onClick={() => {
                                  setSelectVehicle(vehicle);
                                  handleIsOpenToggle("View");
                                }}
                              >
                                <h2 className="text-sm font-bold text-gray-800 truncate">
                                  {vehicle.make} {vehicle.model}
                                </h2>
                                <p className="text-xs text-gray-500 truncate">
                                  {vehicle.series?.charAt(0)?.toUpperCase() +
                                    vehicle.series?.slice(1) || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Lot Number */}
                          <td className="p-1">
                            <span className="text-sm text-gray-600">
                              {vehicle.lot_number || "—"}
                            </span>
                          </td>

                          {/* Year */}
                          <td className="p-1">
                            <span className="text-sm text-gray-600">
                              {vehicle.year || "—"}
                            </span>
                          </td>

                          {/* Fuel Type */}
                          <td className="p-1">
                            <span className="text-sm text-gray-600 ">
                              {vehicle.fuelType?.charAt(0)?.toUpperCase() +
                                vehicle.fuelType?.slice(1) || "—"}
                            </span>
                          </td>

                          {/* Color */}
                          <td className="p-1">
                            <span className="text-sm text-gray-600">
                              {vehicle.color?.charAt(0)?.toUpperCase() +
                                vehicle.color?.slice(1) || "—"}
                            </span>
                          </td>

                          {/* City */}
                          <td className="p-1">
                            <span className="text-sm text-gray-600">
                              {vehicle.cityName || "—"}
                            </span>
                          </td>

                          {/* Date/Time */}
                          <td className="p-1 text-gray-700">
                            <div className="flex flex-col">
                              <span className="text-sm">
                                {vehicle?.createdAt
                                  ? new Date(
                                      vehicle?.createdAt,
                                    ).toLocaleDateString("en-GB")
                                  : "N/A"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {vehicle?.createdAt
                                  ? new Date(
                                      vehicle?.createdAt,
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })
                                  : "--"}
                              </span>
                            </div>
                          </td>

                          {/* Price */}
                          <td className="p-1">
                            <span className="text-sm font-semibold text-gray-700">
                              PKR {vehicle.buyNowPrice || "—"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-1">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                vehicle.approval === "Y"
                                  ? "bg-green-100 text-green-800"
                                  : vehicle.approval === "P"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : vehicle.approval === "R"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {vehicle.approval === "Y"
                                ? "Approved"
                                : vehicle.approval === "P"
                                  ? "Pending"
                                  : vehicle.approval === "R"
                                    ? "Reject"
                                    : "Pending"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-1">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(vehicle.newVehicleId);
                                }}
                                className="p-2 rounded-full hover:bg-gray-200 transition"
                              >
                                <BsThreeDotsVertical className="h-5 w-5 text-gray-600" />
                              </button>

                              {isDropdownOpen === vehicle.newVehicleId && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                                  {!isCustomer ? (
                                    <>
                                      {/* Edit */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEdit(vehicle);
                                          toggleDropdown(null);
                                        }}
                                        className="w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-100 text-left flex items-center gap-2 rounded-t-lg"
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

                                      {/* Bid Status / View */}
                                      {vehicle.bidId ? (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEndBidding(vehicle.bidId);
                                            handleIsOpenToggle("bid");
                                            toggleDropdown(null);
                                          }}
                                          className="w-full px-4 py-2 text-sm text-green-600 hover:bg-green-100 text-left flex items-center gap-2"
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
                                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                          </svg>
                                          Bid Added
                                        </button>
                                      ) : (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectVehicle(vehicle);
                                            handleIsOpenToggle("View");
                                            toggleDropdown(null);
                                          }}
                                          className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-left flex items-center gap-2"
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
                                          View Details
                                        </button>
                                      )}

                                      {/* Delete */}
                                      {/*  
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(
                                            vehicle.newVehicleId,
                                            vehicle.approval
                                          );
                                          toggleDropdown(null);
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
                                      */}
                                    </>
                                  ) : (
                                    /* Customer View - Create Bid */
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
                                        toggleDropdown(null);
                                      }}
                                      className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 text-left flex items-center gap-2 rounded-lg"
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
                                          d="M12 4v16m8-8H4"
                                        />
                                      </svg>
                                      Create Bid
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {currentCars.length > 0 && (
                  <div className="bg-white shadow-sm p-4 mt-4 ">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
                      <div className="text-gray-600">
                        Showing{" "}
                        <span className="font-medium">
                          {startIndex + 1} to {endIndex}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                          {allVehicles.length}
                        </span>{" "}
                        entries
                      </div>

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

                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
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
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
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
                          },
                        )}

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
                    </div>
                  </div>
                )}
              </div>
            </>
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

      {isOpen === "detail" && (
        <UserDetailModal
          isOpen={isOpen}
          closeModal={() => handleIsOpenToggle("")}
          userDetail={userDetail}
        />
      )}
    </div>
  );
};

export default AddVehicles;
