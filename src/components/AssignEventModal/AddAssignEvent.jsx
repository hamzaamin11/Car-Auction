import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { BASE_URL } from "../../components/Contant/URL";
import Swal from "sweetalert2"; // SweetAlert2 imported
import axios from "axios";
import Select from "react-select";

export const AddAssignEvent = ({ Open, setOpen, handleGetAssignEvent }) => {
  const [assignData, setAssignData] = useState({
    eventId: "",
    date: "",
    vehicleId: "",
    startTime: "",
    endTime: "",
  });

  console.log("assign=>", assignData);

  const [allEvents, setAllEvents] = useState([]);
  const [selectDate, setSelectDate] = useState(null);
  const [allvehicles, setAllVehicles] = useState([]);

  console.log("=>>event", selectDate);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (selectDate?.eventDate) {
      setAssignData((prev) => ({
        ...prev,
        date: selectDate.eventDate,
      }));
    }
  }, [selectDate]);

  const handleEventChange = (name, selectedOption) => {
    setAssignData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const eventOptions = [
    { value: "", label: "Choose the event" },
    ...allEvents.map((event) => ({
      value: event.id,
      label: event.eventName,
    })),
  ];

  const vehicleOptions = [
    { value: "", label: "Select the Vehicle" },
    ...allvehicles.map((vehicle) => ({
      value: vehicle?.id,
      label: `${vehicle?.make} | ${vehicle?.model} | ${vehicle?.series} | ${vehicle?.year}`,
    })),
  ];

  const handleGetEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getEventNames`);
      setAllEvents(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetEventDate = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/admin/getEventDateById/${assignData.eventId}`
      );
      console.log(res.data);
      setSelectDate(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllVehicles = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getVehicleNames`);
      console.log(res.data);
      setAllVehicles(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}/admin/createAssignedEvents`,
        assignData
      );
      console.log(res.data);
      setOpen();
      handleGetAssignEvent();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Event Assign successfully!",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message,
      });
    }
  };

  useEffect(() => {
    handleGetEvents();
    handleGetAllVehicles();
  }, []);

  useEffect(() => {
    if (assignData.eventId) handleGetEventDate();
  }, [assignData.eventId]);

  const closeModal = () => setOpen(false);

  return (
    <Transition appear show={!!Open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 bg-black/20"
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0  backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto top-20 ">
          <div className="flex min-h-full items-center justify-center p-4 text-center ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl border transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl flex flex-row justify-between items-center font-bold leading-6 mb-4"
                >
                  Assign Event
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center cursor-pointer rounded-md text-sm font-medium text-white"
                      onClick={closeModal}
                    >
                      <MdClose size={24} className="text-red-600" />
                    </button>
                  </div>
                </Dialog.Title>

                <form onSubmit={handleSubmitEvent}>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Event Name
                      </label>

                      <Select
                        name="eventId"
                        options={eventOptions}
                        isSearchable={true}
                        placeholder="Select event..."
                        onChange={(selected) =>
                          handleEventChange("eventId", selected)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={selectDate?.eventDate}
                        readOnly
                        onChange={handleChange}
                        className=" w-full rounded border border-gray-500 p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 ">
                      Vehicle Name
                    </label>

                    <Select
                      name="vehicleId"
                      options={vehicleOptions}
                      isSearchable={true}
                      placeholder="Select Vehicle..."
                      onChange={(selected) =>
                        handleEventChange("vehicleId", selected)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        name="startTime"
                        value={assignData?.startTime}
                        onChange={handleChange}
                        className="mt-1 w-full rounded border border-gray-500 p-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <input
                        type="time"
                        name="endTime"
                        value={assignData?.endTime}
                        onChange={handleChange}
                        className="mt-1 w-full rounded border border-gray-500 p-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center pt-3">
                    <button
                      type="submit"
                      className="px-2 flex justify-center text-sm bg-blue-950 text-white py-2 rounded shadow-md hover:scale-105 transition-transform duration-300  hover:cursor-pointer"
                    >
                      Add Event
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
