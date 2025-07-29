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

function AddAdminVehicle({ open, setOpen, onVehicleUpdated }) {
  const initialVehicleState = {
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
    currentBid: "",
    buyNowPrice: "",
    certifyStatus: "",
    image: [],
  };

  const { currentUser } = useSelector((state) => state?.auth);

  const { loader } = useSelector((state) => state?.navigateState);

  const [vehicle, setVehicle] = useState(initialVehicleState);

  const [isOpenBid, setIsOpenBid] = useState(false);

  console.log("vehicle", vehicle);

  const [viewBider, setViewBider] = useState(false);

  console.log(viewBider);

  const [getVehicleId, setGetVehicleId] = useState(null);

  const [allBidCustomer, setAllBidCustomer] = useState([]);

  console.log("getVehicleId", getVehicleId);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [viewModal, setViewModal] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);

  console.log("selectVehicle =>", selectedVehicle);

  const { getVehicles, delVehicle, getAllVehicles } =
    useContext(VehicleContext); // ✅ Ensure VehicleContext is imported

  const { user } = useAuth();

  const dispatch = useDispatch();

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

  const handleImage = (e) => {
    const files = Array.from(e.target.files); // get selected files as array
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (vehicle.image.length < 4) {
      return toast.error("Please Add Maximum 5 Images ");
    }

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

    const loadingToast = toast.loading("Submitting...");

    try {
      const res = await fetch(`${BASE_URL}/seller/addVehicle`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.update(loadingToast, {
          render: "Vehicle Added Successfully!",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
        setVehicle(initialVehicleState);
        getAllVehicles();
        setShowModal(false);
      } else {
        toast.update(loadingToast, {
          render: "Failed to add vehicle.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "An error occurred");
      console.log(error);
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
    getAllVehicles();
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

  if (loader) return <RotateLoader />;

  return (
    <>
      {/* <Topbar />
      <Sidebar /> */}
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            Vehicle List
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#191970] hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-full shadow"
          >
            + Add Vehicle
          </button>
        </div>

        <div className="text-center mb-6"></div>

        {/* Vehicle Form Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-30  px-4">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 rounded-lg relative">
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
              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div>
                  <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Identifition Number
                  </label>
                  <input
                    name="vin"
                    value={vehicle.vin}
                    onChange={handleChange}
                    placeholder="VIN"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    required
                    maxLength={17}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Year
                  </label>
                  <input
                    name="year"
                    type="date"
                    value={vehicle.year}
                    onChange={handleChange}
                    placeholder="Year"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>

                <div>
                  <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Manufactured By{" "}
                  </label>

                  <input
                    name="make"
                    value={vehicle.make}
                    onChange={handleChange}
                    placeholder="Make"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    required
                  />
                </div>

                <div>
                  <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Model
                  </label>

                  <input
                    name="model"
                    value={vehicle.model}
                    onChange={handleChange}
                    placeholder="Model"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Model Series
                  </label>
                  <input
                    name="series"
                    value={vehicle.series}
                    onChange={handleChange}
                    placeholder="Series"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Body Style
                  </label>
                  <input
                    name="bodyStyle"
                    value={vehicle.bodyStyle}
                    onChange={handleChange}
                    placeholder="Body Style"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>

                <div>
                  <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Engine Number
                  </label>
                  <input
                    name="engine"
                    value={vehicle.engine}
                    type="text"
                    onChange={handleChange}
                    placeholder="Engine"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Transmission Type
                  </label>

                  <select
                    name="transmission"
                    value={vehicle.transmission}
                    onChange={handleChange}
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  >
                    <option value={""} disabled selected>
                      Please Select Transmission Type
                    </option>
                    <option value={"Automatic"}>Automatic</option>
                    <option value={"Manual"}>Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Drive Type
                  </label>

                  <select
                    name="driveType"
                    value={vehicle.driveType}
                    onChange={handleChange}
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  >
                    <option value="" disabled selected>
                      Select Drive Type
                    </option>
                    <option value="fwd">FWD (Front-Wheel Drive)</option>
                    <option value="rwd">RWD (Rear-Wheel Drive)</option>
                    <option value="awd">AWD (All-Wheel Drive)</option>
                    <option value="4wd">4WD (Four-Wheel Drive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Fuel Type
                  </label>
                  <select
                    name="fuelType"
                    value={vehicle.fuelType}
                    onChange={handleChange}
                    placeholder="Fuel Type"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  >
                    <option value="" disabled selected>
                      Select Fuel Type
                    </option>
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
                    Vehicle Color
                  </label>

                  <input
                    name="color"
                    value={vehicle.color}
                    onChange={handleChange}
                    placeholder="Color"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>

                <div>
                  <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Mileage
                  </label>
                  <input
                    name="mileage"
                    type="number"
                    value={vehicle.mileage}
                    onChange={handleChange}
                    placeholder="Mileage"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Condition
                  </label>

                  <select
                    name="vehicleCondition"
                    value={vehicle.vehicleCondition}
                    onChange={handleChange}
                    placeholder="Vehicle Condition"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  >
                    <option value="" disabled selected>
                      Select Vehicle Condition
                    </option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="accidented">Accidented</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Available keys
                  </label>

                  <input
                    name="keysAvailable"
                    type="number"
                    value={vehicle.keysAvailable}
                    onChange={handleChange}
                    placeholder="Keys Available"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Location
                  </label>
                  <input
                    name="locationId"
                    value={vehicle.locationId}
                    onChange={handleChange}
                    placeholder="Location "
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Sale Status
                  </label>
                  <select
                    name="saleStatus"
                    value={vehicle.saleStatus}
                    onChange={handleChange}
                    placeholder="Sale Status"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  >
                    <option value="" disabled selected>
                      Please Select Status
                    </option>
                    <option value="live">Live</option>
                    <option value="book">Book</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div>
                  <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Current Date
                  </label>

                  <input
                    name="auctionDate"
                    type="date"
                    value={vehicle.auctionDate}
                    onChange={handleChange}
                    placeholder="Auction Date"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>

                <div>
                  <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Initial Bid
                  </label>

                  <input
                    name="currentBid"
                    value={vehicle.currentBid}
                    type="number"
                    onChange={handleChange}
                    placeholder="Current Bid"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>

                <div>
                  <label className=" block text-sm font-medium text-gray-700 mb-1">
                    Add Vehicle Price
                  </label>
                  <input
                    name="buyNowPrice"
                    value={vehicle.buyNowPrice}
                    onChange={handleChange}
                    placeholder="Add Price"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certified Status
                  </label>

                  <select
                    name="certifyStatus"
                    value={vehicle.certifyStatus}
                    onChange={handleChange}
                    placeholder="Certify Status"
                    className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  >
                    <option value="" disabled selected>
                      Please Select Certify Status
                    </option>
                    <option value="certified">Certified</option>
                    <option value="nonCertified">NonCertified</option>
                  </select>
                </div>

                {/* Image Upload */}

                {/* Submit Button */}
                <div className="col-span-1 sm:col-span-2 flex justify-center  mt-4">
                  <label className="font-medium pt-1 w-70 text-gray-700 mb-1 block">
                    Vehicle Image
                  </label>
                  <input
                    type="file"
                    multiple
                    name="image"
                    onChange={handleImage}
                    className="w-full text-sm file:px-4 file:py-2 file:bg-indigo-600 file:text-white file:rounded file:cursor-pointer"
                  />
                  <button
                    type="submit"
                    className="  bg-indigo-600 text-white px-2 w-full rounded hover:bg-indigo-700"
                  >
                    Submit Vehicle
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Vehicle List Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#191970] text-white">
              <tr>
                <th className="py-3 px-4 text-left">SR#</th>
                <th className="py-3 px-4 text-left">Make</th>
                <th className="py-3 px-4 text-left">Model</th>
                <th className="py-3 px-4 text-left">Year</th>
                <th className="py-3 px-4 text-left">Series</th>
                <th className="py-3 px-4 text-left">Mileage</th>
                <th className="py-3 px-4 text-left">Buy Now Price</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {getVehicles?.length > 0 ? (
                getVehicles.map((vehicle, index) => (
                  <tr key={index} className="border-t">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{vehicle.make}</td>
                    <td className="py-3 px-4">{vehicle.model}</td>
                    <td className="py-3 px-4">{vehicle.year}</td>
                    <td className="py-3 px-4">{vehicle.series}</td>
                    <td className="py-3 px-4">{vehicle.mileage}</td>
                    <td className="py-3 px-4">{vehicle.buyNowPrice}</td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setEditModalOpen(true);
                        }}
                        className="px-3 py-1 text-sm border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition hover:cursor-pointer"
                      >
                        Edit
                      </button>

                      {vehicle.saleStatus === "upcoming" ? (
                        <button
                          onClick={() => handleBidAddedbtn(vehicle.id)}
                          className="px-3 py-1 text-sm border w-24 border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition hover:cursor-not-allowed"
                        >
                          Bid Added
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setIsOpenBid(true);
                          }}
                          className="px-3 py-1 text-sm border w-24 border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition hover:cursor-pointer"
                        >
                          Add Bid
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setViewModal(true);
                        }}
                        className="px-3 py-1 text-sm border border-[#191970] text-[#191970] rounded hover:bg-[#191970] hover:text-white transition hover:cursor-pointer"
                      >
                        View
                      </button>

                      <button
                        onClick={() => delVehicle(vehicle.id)}
                        className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition hover:cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No vehicles found. Please add a vehicle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditAdminVehicle
        open={editModalOpen}
        setOpen={setEditModalOpen}
        selectedVehicle={selectedVehicle}
        onVehicleUpdated={getAllVehicles} // Your data refresh function
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
          getAllVehicles={getAllVehicles}
        />
      )}

      {viewBider ? (
        <BidderModal
          allBidCustomer={allBidCustomer}
          handleClose={() => handleViewBidClose()}
        />
      ) : null}

      <ToastContainer />
    </>
  );
}

export default AddAdminVehicle;
