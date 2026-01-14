import axios from "axios";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { BASE_URL } from "../Contant/URL";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
export const AdminAddBid = ({
  setIsOpenBid,
  selectedVehicle,
  getAllVehicles,
}) => {
  const initialState = {
    startTime: "",
    endTime: "",
    vehicleId: selectedVehicle?.id || selectedVehicle?.newVehicleId,
    userId: selectedVehicle?.userId,
    saleStatus: "pending",
  };

  const [viewImage, setViewImage] = useState();

  const [formData, setFormData] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // agar ye datetime-local hai to backend ke liye UTC ISO string bana do
    if (name === "startTime" || name === "endTime") {
      updatedValue = new Date(value).toISOString();
      // Example: "2025-09-01T13:00" -> "2025-09-01T08:00:00.000Z"
    }

    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  useEffect(() => {
    if (selectedVehicle?.images?.length > 0) {
      setViewImage(selectedVehicle.images[0]);
    }
  }, [selectedVehicle]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/seller/createBid`, formData);
      console.log("res", res.data);

      getAllVehicles();
      setIsOpenBid(false);

      // ✅ SweetAlert Success Message
      Swal.fire({
        title: "Success!",
        text: "Your bid has been added successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);

      // ❌ Optional: Show error alert too
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while adding your bid.",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-500 bg-black/30 backdrop-blur flex justify-center items-center">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow relative border">
        {/* Header */}
        <button
          onClick={() => setIsOpenBid(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
        >
          <MdClose size={24} />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-[#233D7B]">
          Add Auction Event
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Left Side */}
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 space-y-2">
              <p>
                <strong>Model:</strong> {selectedVehicle?.model}
              </p>
              <p>
                <strong>Make:</strong> {selectedVehicle?.make}
              </p>
              <p>
                <strong>Year:</strong> {selectedVehicle?.year}
              </p>
              <p>
                <strong>Color:</strong> {selectedVehicle?.color}
              </p>
              <p>
                <strong>Fuel:</strong> {selectedVehicle?.fuelType}
              </p>
              <p>
                <strong>Transmission:</strong> {selectedVehicle?.transmission}
              </p>
              <p>
                <strong>Body Style:</strong> {selectedVehicle?.bodyStyle}
              </p>
              <p>
                <strong>Location:</strong> {selectedVehicle?.cityName}
              </p>
              <p>
                <strong>Reserve Price:</strong> {selectedVehicle?.buyNowPrice}
              </p>
              <p>
                <strong>Condition:</strong> {selectedVehicle?.vehicleCondition}
              </p>
            </div>

            {/* Inputs */}

            <div className="space-y-3 mt-4">
              {/* Start Time */}
              <div>
                <label className="block text-xs mb-1 font-medium">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  min={moment().format("YYYY-MM-DDTHH:mm")} // 🚫 Disable past times
                  value={
                    formData.startTime
                      ? moment(formData.startTime).format("YYYY-MM-DDTHH:mm")
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-xs mb-1 font-medium">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  min={moment().format("YYYY-MM-DDTHH:mm")} // 🚫 Disable past times
                  value={
                    formData.endTime
                      ? moment(formData.endTime).format("YYYY-MM-DDTHH:mm")
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>

              {/* Submit */}
              <button
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();

                  const start = moment(formData.startTime);
                  const end = moment(formData.endTime);

                  // ✅ Validation checks
                  if (!start.isValid() || !end.isValid()) {
                    Swal.fire({
                      icon: "warning",
                      title: "Invalid Time",
                      text: "Please select both start and end times.",
                      confirmButtonColor: "#6366f1",
                    });
                    return;
                  }

                  if (end.isBefore(start)) {
                    Swal.fire({
                      icon: "warning",
                      title: "Invalid Time Range",
                      text: "End time cannot be before start time.",
                      confirmButtonColor: "#6366f1",
                    });
                    return;
                  }

                  // const diffMinutes = end.diff(start, "minutes");
                  // if (diffMinutes < 30) {
                  //   Swal.fire({
                  //     icon: "warning",
                  //     title: "Time Difference Too Short",
                  //     text: "There must be at least a 30-minute difference between start and end time.",
                  //     confirmButtonColor: "#6366f1",
                  //   });
                  //   return;
                  // }

                  // ✅ All good → proceed
                  handleBidSubmit(e);
                }}
                className="mt-2 w-full bg-blue-950 text-white py-2 rounded text-sm "
              >
                {loading ? "Loading..." : "Add Auction Event"}
              </button>
            </div>
          </div>

          {/* Right Side (Images) */}
          <div className="flex flex-col items-center">
            <img
              src={viewImage}
              alt="Car"
              className="rounded mb-4 w-full h-52 object-cover"
            />
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedVehicle?.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`car-${index}`}
                  onClick={() => setViewImage(image)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                    viewImage === image ? "border-blue-500" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};
