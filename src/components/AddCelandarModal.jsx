import { Button } from "@headlessui/react";
import axios from "axios";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import { BASE_URL } from "./Contant/URL";

export const AddCelandarModal = ({
  handleToggleModal,
  handleGetAllCalendar,
}) => {
  const initialState = {
    date: "",
    day: "",
    location: [],
  };

  const [formData, setFormData] = useState(initialState);
  const [createLocation, setCreateLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddLocation = () => {
    if (!createLocation.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Empty Location",
        text: "Please enter a location name before adding.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const newLocation = [...formData.location, createLocation.trim()];
    setFormData((prev) => ({ ...prev, location: newLocation }));
    setCreateLocation("");

    Swal.fire({
      icon: "success",
      title: "Added!",
      text: "Location added successfully",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const handleRemoveLocation = (index) => {
    const newLocations = formData.location.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, location: newLocations }));

    Swal.fire({
      icon: "success",
      title: "Removed!",
      text: "Location has been deleted",
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const handleSubmit = async () => {
    if (!formData.date || !formData.day || formData.location.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in Date, Day, and add at least one Location.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/seller/addCalenderEvent`, formData);

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Calendar event added successfully!",
        confirmButtonColor: "#10b981",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      setFormData(initialState);
      handleGetAllCalendar();
      handleToggleModal(); // Close modal on success
    } catch (error) {
      console.error("Error adding calendar event:", error);
      const msg = error.response?.data?.message || "Failed to add calendar event.";

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: msg,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (formData.date || formData.day || formData.location.length > 0) {
      Swal.fire({
        title: "Discard changes?",
        text: "You have unsaved changes. Are you sure you want to close?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, discard",
      }).then((result) => {
        if (result.isConfirmed) {
          handleToggleModal();
        }
      });
    } else {
      handleToggleModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-lg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-2xl font-bold text-[#233D7B] mb-6 flex items-center justify-between">
          <span>Add Calendar Event</span>
          <MdClose
            size={28}
            className="text-rose-600 hover:text-rose-800 cursor-pointer transition"
            onClick={handleClose}
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Day */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Day</label>
          <input
            type="text"
            name="day"
            placeholder="e.g. Monday"
            value={formData.day}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Location Input + Add Button */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">Auction Location</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={createLocation}
              onChange={(e) => setCreateLocation(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddLocation()}
              placeholder="Enter location"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
            <button
              onClick={handleAddLocation}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition whitespace-nowrap"
            >
              Add Location
            </button>
          </div>
        </div>

        {/* Location Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {formData.location.map((loc, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200"
            >
              <span>{loc}</span>
              <button
                onClick={() => handleRemoveLocation(index)}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#233D7B] hover:bg-blue-900 text-white font-bold py-3 px-10 rounded-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding...
              </>
            ) : (
              "Add Calendar Event"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};