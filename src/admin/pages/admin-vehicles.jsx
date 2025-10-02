import React, { useContext, useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { SidebarClose } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { BidderModal } from "../../components/ViewBiderPeoples/BidderModal";
import Swal from "sweetalert2";
import Select from "react-select";
import CarSelector from "../../components/CarSelector";
import {
  addMake,
  addModel,
  addSeries,
  addYear,
} from "../../components/Redux/SelectorCarSlice";
import AllVehicles from "../../pages/Allvehicles";

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

const Cities = [
  // A
  "Abbottabad",
  "Addul Hakeem",
  "Ahmadpur East",
  "Ahmednagar",
  "Alipur",
  "Arandu",
  "Arifwala",
  "Atharan Hazari",
  "Attock",

  // B
  "Badah",
  "Badin",
  "Bahawalnagar",
  "Bahawalpur",
  "Balakot",
  "Bannu",
  "Barkhan",
  "Basirpur",
  "Basti Maluk",
  "Bela",
  "Bhag",
  "Bhakkar",
  "Bhan",
  "Bhera",
  "Bucheki",

  // C
  "Chacharan Sharif",
  "Chak Jhumra",
  "Chakwal",
  "Chaman",
  "Charsadda",
  "Chawinda",
  "Chichawatni",
  "Chiniot",
  "Chitral",
  "Choubara",
  "Chunian",

  // D
  "Dadu",
  "Daira Din Panah",
  "Dalbandin",
  "Daulatpur",
  "Daur",
  "Depalpur",
  "Dera Bugti",
  "Dera Ghazi Khan",
  "Dera Ismail Khan",
  "Dhadar",
  "Digri",
  "Dijkot",
  "Dinga",
  "Diplo",
  "Dir",
  "Drosh",
  "Dudhial",
  "Duki",
  "Dunyapur",

  // E
  "Eminabad",

  // F
  "Faisalabad",
  "Fateh Jang",
  "Fateh Pur",
  "Firozwala",
  "Fort Abbas",

  // G
  "Gaddani",
  "Gambat",
  "Garhi Khairo",
  "Gharibwal",
  "Gharo",
  "Gilgit",
  "Gojra",
  "Gujranwala",
  "Gujrat",
  "Gwadar",

  // H
  "Hafizabad",
  "Hala",
  "Hangu",
  "Haripur",
  "Harnai",
  "Haroonabad",
  "Hasilpur",
  "Havelian",
  "Hoshab",
  "Hyderabad",

  // I
  "Isa Khel",
  "Islamabad",

  // J
  "Jacobabad",
  "Jaranwala",
  "Jhang",
  "Jhelum",
  "Jamshoro",

  // K
  "Karachi",
  "Kamalia",
  "Kamoke",
  "Kandhkot",
  "Kasur",
  "Khairpur",
  "Khushab",
  "Khuzdar",
  "Kohat",
  "Kot Abdul Malik",
  "Kot Addu",
  "Kotri",

  // L
  "Lahore",
  "Larkana",
  "Layyah",
  "Lodhran",

  // M
  "Mandi Bahauddin",
  "Mansehra",
  "Mardan",
  "Mianwali",
  "Mirpur Khas",
  "Mirpur (Azad Kashmir)",
  "Mingora",
  "Muzaffarabad",
  "Muzaffargarh",
  "Multan",
  "Muridke",

  // N
  "Nawabshah",
  "Narowal",
  "Nowshera",

  // O
  "Okara",

  // P
  "Pakpattan",
  "Parachinar",

  // Q
  "Quetta",
  "Qambar Shahdadkot",

  // R
  "Rahim Yar Khan",
  "Rawalpindi",
  "Rabwah",

  // S
  "Sadiqabad",
  "Sahiwal",
  "Sambrial",
  "Sanghar",
  "Sargodha",
  "Shaheed Benazirabad (Nawabshah)",
  "Sheikhupura",
  "Shikarpur",
  "Sialkot",
  "Sukkur",
  "Swabi",

  // T
  "Taxila",
  "Tando Adam",
  "Tando Allahyar",
  "Tando Muhammad Khan",
  "Talagang",
  "Tharparkar",
  "Thatta",
  "Turβat",

  // V
  "Vehari",

  // W
  "Wah Cantonment",
  "Wazirabad",
  "WeTa? (ignore)",

  // Z
  "Zabād",
  "Zafarke",
  "Zafarwal",
  "Zahir Pir",
  "Zahri",
  "Zaida",
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

  console.log("allCities =>", allCities);

  console.log(" =>", vehicle.certifyStatus);

  const [allVehicles, setAllVehicles] = useState([]);

  console.log(AllVehicles);

  const [isOpenBid, setIsOpenBid] = useState(false);

  const [isOpen, setIsOpen] = useState("");

  const [viewBider, setViewBider] = useState(false);

  const [loading, setLoading] = useState(false);

  console.log("loading =>", loading);

  const [getVehicleId, setGetVehicleId] = useState(null);

  const [allBidCustomer, setAllBidCustomer] = useState([]);

  console.log("getVehicleId", getVehicleId);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [viewModal, setViewModal] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [actionBtn, setActionBtn] = useState(null);

  const [pageNo, setPageNo] = useState(1);

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 0 ? pageNo - 1 : 0);
  };

  const handleClickActionBtn = (active) => {
    setActionBtn((prev) => (prev === active ? null : active));
  };

  const { getVehicles, delVehicle, getAllVehicles } =
    useContext(VehicleContext);

  const { user } = useAuth();

  const dispatch = useDispatch();

  const [selectedCount, setSelectedCount] = useState(0);

  const [price, setPrice] = useState("");

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

    // Helper: 2 digit numbers
    const twoDigits = (n) => {
      if (n < 20) return ones[n];
      const t = Math.floor(n / 10);
      const o = n % 10;
      return tens[t] + (o ? " " + ones[o] : "");
    };

    // Helper: 3 digit numbers
    const threeDigits = (n) => {
      const h = Math.floor(n / 100);
      const r = n % 100;
      return (
        (h ? ones[h] + " Hundred " : "") + (r ? twoDigits(r) : "")
      ).trim();
    };

    let words = "";

    // Crores
    if (Math.floor(num / 10000000) > 0) {
      words += numberToIndianWords(Math.floor(num / 10000000)) + " Crore ";
      num %= 10000000;
    }

    // Lakhs
    if (Math.floor(num / 100000) > 0) {
      words += numberToIndianWords(Math.floor(num / 100000)) + " Lac ";
      num %= 100000;
    }

    // Thousands
    if (Math.floor(num / 1000) > 0) {
      words += numberToIndianWords(Math.floor(num / 1000)) + " Thousand ";
      num %= 1000;
    }

    // Hundreds
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

  // const handleChange = (e) => {
  //   const { name, type, value, files } = e.target;
  //   setVehicle((prev) => ({
  //     ...prev,
  //     [name]: type === "file" ? files[0] : value,
  //   }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
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
        `${BASE_URL}/seller/getVehicles?search=${search}&page=${pageNo}&entry=${10}`
      );
      console.log(res.data);
      setAllVehicles(res.data);
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
      const res = await axios.patch(`${BASE_URL}/seller/deleteVehicle/${id}`);
      console.log(res.data);
      handleGetVehicles();
      toast.info("Vehicle has been deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddedImage = (e) => {
    const files = Array.from(e.target.files); // get selected files as array

    if (files.length > 5) return toast.error("You can added maximum 5 images");
    setVehicle((prev) => ({
      ...prev,
      image: [...prev.image, ...files], // append new images to previous ones
    }));
  };

  const handleToggle = (prev) => setViewModal(!prev);

  useEffect(() => {
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("submit"));
    }, 1000);
  }, []);

  useEffect(() => {
    handleGetVehicles();
  }, [search, pageNo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Validation Step
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

    // Optional Debug
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await fetch(`${BASE_URL}/seller/addVehicle`, {
        method: "POST",
        body: formData,
      });

      setVehicle(initialVehicleState);
      handleGetVehicles();
      setShowModal(false);
      setLoading(false);
      toast.success("Vehicle Added successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
      console.log(error);
      setLoading(false);
    }
  };

  const handleViewBidder = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/bidsPlacedById/${getVehicleId}`
      );
      setAllBidCustomer(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (getVehicleId) {
      handleViewBidder();
    }
  }, [getVehicleId]);

  const handleViewClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setViewModal(true);
  };

  const handleBidAddedbtn = (id) => {
    setViewBider(true);
    setGetVehicleId(id);
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

  return (
    <>
      {/* <Topbar />
      <Sidebar /> */}
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-3xl font-bold text-gray-800 block sm:hidden">
          Vehicle List
        </h2>
        <div className="flex justify-between items-center w-full gap-2">
          <h2 className="text-3xl font-bold text-gray-800 hidden lg:block">
            Vehicle List{" "}
          </h2>

          <div class="relative w-full max-w-md mt-4 lg:mt-0">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>

            <input
              type="text"
              placeholder="Search by car name..."
              onChange={(e) => setSearch(e.target.value)}
              class="w-full pl-10 pr-4 py-2 placeholder:text-xs lg:placeholder:text-lg rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => {
              setShowModal(true), dispatch(addYear(""));
              dispatch(addMake(""));
              dispatch(addModel(""));
              dispatch(addSeries(""));
            }}
            className="bg-[#191970] hover:bg-blue-900 text-white font-medium lg:py-2 py-1  px-4 lg:text-sm text-xs rounded shadow transition-all duration-200 mt-4"
          >
            Add Vehicle
          </button>
        </div>

        <div className="text-center mb-6"></div>

        {/* Vehicle Form Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-30  px-4">
            <div className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto p-6 rounded-lg relative">
              {/* Header */}
              <div className="flex justify-between items-center border-b pb-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add a New Vehicle
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-red-700   text-3xl"
                >
                  &times;
                </button>
              </div>

              {/* Form Starts */}
              <form onSubmit={handleSubmit} className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>

                  <Select onChange={handleSearchable} options={cityData} />

                  <div>
                    <label className=" block text-sm font-medium text-gray-700 my-1">
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
                      Vehicle Transmission Type{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      name="transmission"
                      value={vehicle?.transmission || ""}
                      onChange={handleChange}
                      className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    >
                      <option value={""}>
                        Please Select Transmission Type
                      </option>
                      <option value={"Automatic"}>Automatic</option>
                      <option value={"Manual"}>Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className=" block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Meter Reading
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
                      Vehicle Fuel Type <span className="text-red-500">*</span>
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
                      Vehicle Condition <span className="text-red-500">*</span>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Add Vehicle Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="buyNowPrice"
                      value={price}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Sirf digits aur max 9 digits allow karo
                        if (/^\d*$/.test(value) && value.length <= 9) {
                          setPrice(value);
                        }
                      }}
                      placeholder="Add Price"
                      className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    />

                    {/* Neeche number in words show karo */}
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
                            You can add maximum 5 images and first image will be
                            used as front on the card
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
                      className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
                    >
                      {loading ? "loading..." : "Submit Vehicle"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Car Selector Modal */}
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
        )}
        {/* Vehicle List Table */}

        <div className="max-w-7xl mx-auto space-y-4 px-2 sm:px-4">
          {allVehicles?.length > 0 ? (
            allVehicles.map((vehicle, index) => (
              <div key={index}>
                {/* ✅ Desktop: Card View */}
                <div className="hidden lg:flex flex-col lg:flex-row md:items-center md:justify-between border rounded-lg hover:shadow-md transition-all duration-200 p-3 gap-4">
                  {/* Left: Image */}
                  <div className="relative w-full md:w-40 h-40 md:h-24 flex-shrink-0 rounded-md overflow-hidden">
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

                  {/* Middle: Info */}
                  <div className="flex-1 px-0 md:px-4">
                    <h2 className="text-base font-bold text-gray-800">
                      {vehicle.make.charAt(0).toUpperCase() +
                        vehicle.make.slice(1)}{" "}
                      {vehicle.model.charAt(0).toUpperCase() +
                        vehicle.model.slice(1)}{" "}
                      {vehicle.series.charAt(0).toUpperCase() +
                        vehicle.series.slice(1)}{" "}
                      for sale | {vehicle.year}
                    </h2>
                    <p className="text-lg font-bold text-gray-800">
                      PKR {vehicle.buyNowPrice}
                    </p>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-3 py-1 bg-white border rounded-full text-xs text-gray-700 shadow-sm">
                        <b>Meter Reading:</b> {vehicle.mileage || "--"}
                      </span>

                      <span className="px-3 py-1 bg-white border rounded-full text-xs text-gray-700 shadow-sm">
                        <b>Color:</b>{" "}
                        {vehicle.color.charAt(0).toUpperCase() +
                          vehicle.color.slice(1) || "--"}
                      </span>
                      <span className="px-3 py-1 bg-white border rounded-full text-xs text-gray-700 shadow-sm">
                        <b>Transmission:</b>{" "}
                        {vehicle.transmission.charAt(0).toUpperCase() +
                          vehicle.transmission.slice(1) || "--"}
                      </span>
                      <span className="px-3 py-1 bg-white border rounded-full text-xs text-gray-700 shadow-sm">
                        <b>City:</b>{" "}
                        {vehicle?.cityName?.charAt(0)?.toUpperCase() +
                          vehicle?.cityName?.slice(1) || "--"}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="w-full md:w-56 text-left md:text-right">
                    <div className="flex flex-wrap md:flex-nowrap gap-2 justify-start md:justify-end mt-4 md:mt-12">
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setEditModalOpen(true);
                        }}
                        className="px-2 py-1 text-xs font-medium border border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-500 hover:text-white transition-all"
                      >
                        Edit
                      </button>

                      {vehicle.saleStatus === "upcoming" ||
                      vehicle.saleStatus === "sold" ? (
                        <button className="px-4 py-1 text-xs font-medium border border-green-500 text-green-600 rounded-md cursor-not-allowed">
                          Bid Added
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsOpenBid(true);
                          }}
                          className="px-2 py-1 text-xs font-medium border border-green-500 text-green-600 rounded-md hover:bg-green-500 hover:text-white transition-all"
                        >
                          Add Bid
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setViewModal(true);
                        }}
                        className="px-2 py-1 text-xs font-medium border border-indigo-700 text-indigo-700 rounded-md hover:bg-indigo-700 hover:text-white transition-all"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="px-2 py-1 text-xs font-medium border border-red-500 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* ✅ Mobile: List View */}
                <div className="md:block lg:hidden border-b py-3">
                  <div className="flex items-center gap-3">
                    {/* 🚗 Thumbnail Image */}
                    <div
                      className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setViewModal(true);
                      }}
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

                    {/* 📋 Vehicle Info */}
                    <div
                      className="flex-1"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setViewModal(true);
                      }}
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
                        {vehicle.year} •{" "}
                        {vehicle.fuelType.charAt(0).toUpperCase() +
                          vehicle.fuelType.slice(1)}{" "}
                        •{" "}
                        {vehicle.transmission.charAt(0).toUpperCase() +
                          vehicle.transmission.slice(1)}
                      </p>
                    </div>

                    {/* 🎛 Actions */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setEditModalOpen(true);
                        }}
                        className="px-2 py-1 text-[10px] font-medium border border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-500 hover:text-white transition-all"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="px-2 py-1 text-xs font-medium border border-red-500 text-red-600 rounded-md hover:bg-red-500 hover:text-white transition-all"
                      >
                        Delete
                      </button>
                      {vehicle.saleStatus === "upcoming" ||
                      vehicle.saleStatus === "sold" ? (
                        <button className="px-4 py-1 text-xs font-medium border border-green-500 text-green-600 rounded-md cursor-not-allowed">
                          Bid Added
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsOpenBid(true);
                          }}
                          className="px-2 py-1 text-xs font-medium border border-green-500 text-green-600 rounded-md hover:bg-green-500 hover:text-white transition-all"
                        >
                          Add Bid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">
              No vehicles found. Please add a vehicle.
            </p>
          )}
        </div>

        <div className="flex justify-between  mt-6">
          {/* Prev Button */}
          <button
            className={`bg-[#518ecb] text-white px-5 py-2 rounded hover:bg-[#518ecb] ${
              pageNo > 1 ? "block" : "hidden"
            }`}
            onClick={handlePrevPage}
          >
            ‹ Prev
          </button>

          {/* Next Button */}
          <div></div>
          <button
            className={`bg-[#518ecb] text-white px-5 py-2 rounded hover:bg-[#518ecb] ${
              allVehicles.length === 0 ? "hidden" : "block"
            }`}
            onClick={handleNextPage}
          >
            Next ›
          </button>
        </div>
      </div>

      <EditAdminVehicle
        open={editModalOpen}
        setOpen={setEditModalOpen}
        selectedVehicle={selectedVehicle}
        onVehicleUpdated={handleGetVehicles}
      />
      {viewModal ? (
        <ViewAdminCar
          handleClick={handleToggle}
          selectedVehicle={selectedVehicle}
        />
      ) : null}
      {isOpenBid && (
        <AdminAddBid
          selectedVehicle={selectedVehicle}
          setIsOpenBid={setIsOpenBid}
          getAllVehicles={handleGetVehicles}
        />
      )}

      <ToastContainer />
    </>
  );
}

export default AddAdminVehicle;
