import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const AddVehicles = () => {
  const { user } = useAuth();
  const isCustomer = user?.role === "customer";

  const [isSellerBidModalOpen, setIsSellerBidModalOpen] = useState(false);
  const [sellerBidData, setSellerBidData] = useState({
    userId: "",
    vehicleId: "",
    sellerOffer: "",
    startTime: "",
    endTime: "",
    saleStatus: "pending",
  });

  const [isCustomerBidModalOpen, setIsCustomerBidModalOpen] = useState(false);
  const [customerBidData, setCustomerBidData] = useState({
    userId: "",
    vehicleId: "",
    maxBid: "",
    monsterBid: "",
  });

  const initialFields = {
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
    currentBid: "",
    buyNowPrice: "",
    certifyStatus: "",
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
  const [vehicles, setVehicles] = useState([]);
  const [auctionVehicles, setAuctionVehicles] = useState([]);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user?.id) {
      setVehicleData((prev) => ({ ...prev, userId: user?.id }));
    }
  }, [user]);

  useEffect(() => {
    fetchVehicles();
    fetchAuctionVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/seller/getVehicles");
      const data = await res.json();
      // Ensure we always set an array
      setVehicles(Array.isArray(data) ? data : []);
    } catch {
      setErrorMsg("Failed to fetch vehicles.");
      setVehicles([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchAuctionVehicles = async () => {
    try {
      const res = await fetch("http://localhost:3001/seller/getAuctionVehicle");
      if (!res.ok) throw new Error("Failed to fetch auction vehicles");
      const data = await res.json();
      setAuctionVehicles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(vehicleData).forEach(([key, val]) =>
      formData.append(key, val)
    );
    if (image) formData.append("image", image);

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:3001/seller/updateVehicle/${editId}`
      : `http://localhost:3001/seller/addVehicle`;

    try {
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Submission failed.");
      setSuccessMsg(editId ? "Vehicle updated." : "Vehicle added.");
      setVehicleData({ ...initialFields, userId: user?.id || "" });
      setImage(null);
      setImagePreview(null);
      setFormOpen(false);
      setEditId(null);
      fetchVehicles();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleEdit = (vehicle) => {
    setVehicleData(vehicle);
    setImagePreview(vehicle.image || null);
    setFormOpen(true);
    setEditId(vehicle.id);
  };

  const handleDelete = async (vehicleId) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      const res = await fetch(
        `http://localhost:3001/seller/deleteVehicle/${vehicleId}`,
        {
          method: "PATCH",
        }
      );
      if (!res.ok) throw new Error("Failed to delete vehicle");
      setSuccessMsg("Vehicle deleted.");
      fetchVehicles();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };
  const handleSubmitSellerBid = async (userId, bidData) => {
    try {
      const response = await fetch("http://localhost:3001/seller/createBid", {
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
      console.log("Seller bid created:", data);
      setIsSellerBidModalOpen(false);
    } catch (error) {
      console.error("Error submitting seller bid:", error);
    }
  };

  const handleCreateBid = async (vehicleId) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated.");
      }

      const bidData = {
        ...sellerBidData,

        userId: user?.id,

        vehicleId: vehicleId,
      };

      await handleSubmitSellerBid(user.id, bidData);

      alert("Bid created successfully.");
    } catch (error) {
      console.error("Error creating bid:", error);

      alert("Failed to create bid. Please try again.");
    }
  };
  /* const handleStartBidding = async (vehicleId) => {
  try {
    const response = await fetch('http://localhost:3001/seller/startBidding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vehicleId }),
    });

    if (!response.ok) {
      throw new Error('Failed to start bidding');
    }

    const result = await response.json();
    console.log("Bidding started:", result);
    alert("Bidding started successfully for vehicle ID: " + vehicleId);
  } catch (err) {
    console.error("Error starting bidding:", err);
    alert("Error: " + err.message);
  }
}; */

  const formatPKR = (amount) => {
    if (!amount || isNaN(amount)) return "—";
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  /* End Bidding */
  const handleEndBidding = async (bidId) => {
    try {
      const res = await fetch(
        `http://localhost:3001/seller/endBidding/${bidId}`,
        {
          method: "PUT",
        }
      );

      if (!res.ok) throw new Error("Failed to end bidding");

      alert(`Bidding ended for bid ID: ${bidId}`);
      fetchVehicles(); // Refresh data
    } catch (err) {
      console.error("End bidding error:", err);
      alert("Error: " + err.message);
    }
  };

  const end = new Date(sellerBidData.endTime);
  const now = new Date();
  const diff = end - now;

  if (diff > 0 && sellerBidData.id) {
    setTimeout(() => {
      handleEndBidding(sellerBidData.id); // Use bidId here too
    }, diff);
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800">
            Vehicle Dashboard
          </h1>
          {!isCustomer && (
            <button
              onClick={() => {
                setFormOpen(!formOpen);
                setVehicleData({ ...initialFields, userId: user?.id || "" });
                setImage(null);
                setImagePreview(null);
                setEditId(null);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="mt-4 md:mt-0 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {formOpen ? "Close Form" : "Add Vehicle"}
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

        {!isCustomer && formOpen && (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg p-6 rounded-lg mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {Object.keys(initialFields)
              .filter((key) => key !== "userId")
              .map((field) => (
                <input
                  key={field}
                  name={field}
                  value={vehicleData[field]}
                  onChange={handleChange}
                  placeholder={fieldLabels[field]}
                  className="border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required={["vin", "make", "model"].includes(field)}
                />
              ))}

            <div className="col-span-full">
              <label className="font-semibold text-gray-700 mb-1 block">
                Vehicle Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm file:px-4 file:py-2 file:bg-indigo-600 file:text-white file:rounded file:cursor-pointer"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 w-48 h-32 object-cover rounded"
                />
              )}
            </div>

            <button
              type="submit"
              className="col-span-full bg-indigo-600 text-white py-3 rounded font-semibold hover:bg-indigo-700"
            >
              {editId ? "Update Vehicle" : "Submit Vehicle"}
            </button>
          </form>
        )}

        <section className="space-y-4 mt-10">
          {loading ? (
            <p className="text-center text-indigo-600 font-semibold">
              Loading vehicles...
            </p>
          ) : vehicles.length === 0 ? (
            <p className="text-center text-gray-600">No vehicles found.</p>
          ) : (
            vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex flex-col sm:flex-row sm:items-center bg-white rounded-lg shadow px-4 py-3 gap-3 overflow-x-auto text-sm text-gray-700"
              >
                <div className="flex-shrink-0 w-full sm:w-auto sm:min-w-[120px]">
                  {vehicle.image ? (
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-28 h-20 object-cover rounded border"
                    />
                  ) : (
                    <div className="text-gray-400 italic">No Image</div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    <strong>VIN:</strong> {vehicle.vin || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Make:</strong> {vehicle.make || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Model:</strong> {vehicle.model || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Year:</strong> {vehicle.year || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Series:</strong> {vehicle.series || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Mileage:</strong> {vehicle.mileage || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Condition:</strong>{" "}
                    {vehicle.vehicleCondition || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Engine:</strong> {vehicle.engine || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Bid:</strong> {formatPKR(vehicle.currentBid)}
                  </span>{" "}
                  |
                  <span>
                    <strong>Buy Now:</strong> {formatPKR(vehicle.buyNowPrice)}
                  </span>
                  {!isCustomer ? (
                    <>
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="ml-3 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => {
                          setSellerBidData({
                            ...sellerBidData,
                            userId: user?.id,
                            vehicleId: vehicle.id,
                          });
                          setIsSellerBidModalOpen(true);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Seller Offer Bid
                      </button>

                      {/*
  <button
    onClick={() => handleStartBidding(vehicle.id)}
    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
  >
    Start Bidding
  </button>
*/}

                      {vehicle.bidId && (
                        <button
                          onClick={() => handleEndBidding(vehicle.bidId)} // ✅ bid.id used
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                        >
                          End Bidding
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setCustomerBidData({
                          userId: user?.id,
                          vehicleId: vehicle.id,
                          maxBid: "",
                          monsterBid: "",
                        });
                        setIsCustomerBidModalOpen(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Create Bid
                    </button>
                  )}
                  {isCustomerBidModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">
                          Place Your Bid
                        </h2>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                              const payload = {
                                ...customerBidData,
                                maxBid: customerBidData.maxBid
                                  ? Number(customerBidData.maxBid)
                                  : undefined,
                                monsterBid: customerBidData.monsterBid
                                  ? Number(customerBidData.monsterBid)
                                  : undefined,
                              };

                              const res = await fetch(
                                "http://localhost:3001/customer/startBidding",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(payload),
                                }
                              );

                              if (!res.ok)
                                throw new Error("Bid submission failed.");
                              alert("Bid submitted successfully!");
                              setIsCustomerBidModalOpen(false);
                            } catch (err) {
                              alert("Error: " + err.message);
                            }
                          }}
                        >
                          <input
                            type="text"
                            value={customerBidData.userId}
                            disabled
                            className="w-full border rounded px-2 py-1 mb-2"
                            placeholder="User ID"
                          />
                          <input
                            type="text"
                            value={customerBidData.vehicleId}
                            disabled
                            className="w-full border rounded px-2 py-1 mb-2"
                            placeholder="Vehicle ID"
                          />

                          <input
                            type="number"
                            value={customerBidData.maxBid}
                            onChange={(e) =>
                              setCustomerBidData({
                                ...customerBidData,
                                maxBid: e.target.value,
                              })
                            }
                            className="w-full border rounded px-2 py-1 mb-2"
                            placeholder="Max Bid (optional)"
                          />

                          <input
                            type="number"
                            value={customerBidData.monsterBid}
                            onChange={(e) =>
                              setCustomerBidData({
                                ...customerBidData,
                                monsterBid: e.target.value,
                              })
                            }
                            className="w-full border rounded px-2 py-1 mb-2"
                            placeholder="Monster Bid (optional)"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setIsCustomerBidModalOpen(false)}
                              className="px-4 py-2 bg-gray-300 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                              Submit Bid
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                  {isSellerBidModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">
                          Seller Offer Bid
                        </h2>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmitSellerBid(
                              sellerBidData.userId,
                              sellerBidData
                            );
                          }}
                        >
                          <div className="mb-2">
                            <label>User ID:</label>
                            <input
                              type="text"
                              name="userId"
                              value={sellerBidData.userId}
                              readOnly
                              className="input-field"
                            />
                          </div>
                          <div className="mb-2">
                            <label>Vehicle ID:</label>
                            <input
                              type="text"
                              value={sellerBidData.vehicleId}
                              disabled
                              className="w-full border rounded px-2 py-1"
                            />
                          </div>
                          <div className="mb-2">
                            <label>Seller Offer:</label>
                            <input
                              type="text"
                              value={sellerBidData.sellerOffer}
                              onChange={(e) =>
                                setSellerBidData({
                                  ...sellerBidData,
                                  sellerOffer: e.target.value,
                                })
                              }
                              className="w-full border rounded px-2 py-1"
                              required
                            />
                          </div>
                          <div className="mb-2">
                            <label>Start Time:</label>
                            <input
                              type="datetime-local"
                              value={sellerBidData.startTime}
                              onChange={(e) =>
                                setSellerBidData({
                                  ...sellerBidData,
                                  startTime: e.target.value,
                                })
                              }
                              className="w-full border rounded px-2 py-1"
                              required
                            />
                          </div>
                          <div className="mb-2">
                            <label>End Time:</label>
                            <input
                              type="datetime-local"
                              value={sellerBidData.endTime}
                              onChange={(e) =>
                                setSellerBidData({
                                  ...sellerBidData,
                                  endTime: e.target.value,
                                })
                              }
                              className="w-full border rounded px-2 py-1"
                              required
                            />
                          </div>
                          <div className="mb-2">
                            <label>Sale Status:</label>
                            <select
                              value={sellerBidData.saleStatus}
                              onChange={(e) =>
                                setSellerBidData({
                                  ...sellerBidData,
                                  saleStatus: e.target.value,
                                })
                              }
                              className="w-full border rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="sold">Sold</option>
                            </select>
                          </div>

                          <div className="flex justify-end gap-2 mt-4">
                            <button
                              type="button"
                              onClick={() => setIsSellerBidModalOpen(false)}
                              className="px-4 py-2 bg-gray-300 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800">
            Auction Vehicles
          </h2>
          {auctionVehicles.length === 0 ? (
            <p className="text-center text-gray-600">
              No auction vehicles available.
            </p>
          ) : (
            auctionVehicles.map((vehicle) => (
              <div
                key={vehicle.id || vehicle.vin}
                className="flex flex-col sm:flex-row sm:items-center bg-white rounded-lg shadow px-4 py-3 mb-4 gap-3 overflow-x-auto text-sm text-gray-700"
              >
                {vehicle.image ? (
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-28 h-20 object-cover rounded border flex-shrink-0"
                  />
                ) : (
                  <div className="text-gray-400 italic w-28 h-20 flex items-center justify-center border rounded">
                    No Image
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span>
                    <strong>VIN:</strong> {vehicle.vin || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Make:</strong> {vehicle.make || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Model:</strong> {vehicle.model || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Year:</strong> {vehicle.year || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Current Bid:</strong> ${vehicle.currentBid || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Buy Now Price:</strong> $
                    {vehicle.buyNowPrice || "—"}
                  </span>{" "}
                  |
                  <span>
                    <strong>Auction Date:</strong> {vehicle.auctionDate || "—"}
                  </span>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
};

export default AddVehicles;
