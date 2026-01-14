import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { BASE_URL } from "../../components/Contant/URL";
import Swal from "sweetalert2"; // SweetAlert2 imported
import axios from "axios";

const currentDate = new Date().toISOString().split("T")[0];

const intialState = {
  eventName: "",
  eventDate: currentDate,
};

export const AddEvent = ({ Open, setOpen, handleGetEvent }) => {
  const [eventData, setEventData] = useState(intialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/admin/createEvent`, eventData);
      console.log(res.data);
      handleGetEvent();
      setOpen();
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Event Added successfully!",
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
                  Add Event
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center cursor-pointer rounded-md text-sm font-medium text-white"
                      onClick={closeModal}
                    >
                      <MdClose size={24} className="text-rose-600" />
                    </button>
                  </div>
                </Dialog.Title>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Event Name
                      </label>
                      <input
                        type="text"
                        name="eventName"
                        value={eventData.eventName}
                        onChange={handleChange}
                        className="mt-1 w-full rounded border border-gray-500 p-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
                        placeholder="Enter Event Name..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        name="eventDate"
                        value={eventData.eventDate}
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
