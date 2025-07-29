import { Button } from "@headlessui/react";
import axios from "axios";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
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

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddLocation = () => {
    const newLocation = [...formData.location];

    newLocation.push(createLocation);

    setFormData((prevState) => ({ ...prevState, location: newLocation }));

    setCreateLocation("");

    toast.success("Location added successfully");
  };

  const handleRemoveLocation = (id) => {
    const newFilterLocation = formData.location.filter(
      (val, index) => id !== index
    );
    setFormData((prevState) => ({
      ...prevState,
      location: newFilterLocation,
    }));
    toast.success("location has been deleted");
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/seller/addCalenderEvent`,
        formData
      );
      setFormData(initialState);
      console.log(res.data);
      handleGetAllCalendar();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50  backdrop-blur-lg ">
      <div className=" bg-white p-10 mx-auto mt-16">
        <div className="text-xl sm:text-2xl font-bold text-[#233D7B] mb-6 leading-snug flex items-center justify-between ">
          <span>View Car</span>
          <MdClose
            size={24}
            className="text-rose-800 hover:cursor-pointer"
            title="close"
            onClick={handleToggleModal}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 my-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 my-1">
            Day
          </label>
          <input
            type="text"
            name="day"
            placeholder="Enter your day"
            value={formData.day}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 my-1">
            Auction Location
          </label>
          <span className="flex items-center gap-2">
            <input
              type="text"
              name="location"
              value={createLocation}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setCreateLocation(e.target.value)}
            />

            <span
              onClick={handleAddLocation}
              className="border p-2 rounded bg-green-500 text-white text-sm w-40 text-center hover:cursor-pointer"
            >
              Add location
            </span>
          </span>
        </div>
        <div className="w-28 mt-2 rounded flex gap-2">
          {formData.location?.map((location, index) => (
            <div
              key={index}
              className="border flex items-center justify-between px-2 py-1 rounded mb-1 bg-gray-100 text-sm text-gray-700"
            >
              <span>{location}</span>
              <button
                onClick={() => handleRemoveLocation(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center p-4">
          <Button
            onClick={handleSubmit}
            className={"bg-red-600 text-white p-2 rounded hover:cursor-pointer"}
          >
            Add Calendar
          </Button>
        </div>
      </div>
    </div>
  );
};
