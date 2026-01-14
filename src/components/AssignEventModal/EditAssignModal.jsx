import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { BASE_URL } from "../../components/Contant/URL";
import Swal from "sweetalert2";
import axios from "axios";
import Select from "react-select";
import moment from "moment";

export const EditAssignEvent = ({
  Open,
  setOpen,
  selectEvent,
  handleGetAssignEvent,
}) => {
  const [assignData, setAssignData] = useState({
    startTime: "",
    endTime: "",
  });

  console.log(selectEvent);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    try {
      // Use PUT for update instead of POST
      const res = await axios.put(
        `${BASE_URL}/admin/updateAssignedEvents/${selectEvent.id}`, // Assuming selectEvent has an id
        assignData
      );
      console.log(res.data);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Event updated successfully!",
      });
      closeModal();
      handleGetAssignEvent();
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
                  Update Assign Event
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
                      <input
                        name="vehicleId"
                        readOnly
                        value={`${selectEvent?.eventName}  `}
                        className=" w-full rounded border border-gray-500 p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={selectEvent?.eventDate}
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

                    <input
                      name="vehicleId"
                      readOnly
                      value={`${selectEvent?.make} | ${selectEvent?.model} | ${selectEvent?.series} | ${selectEvent?.year} `}
                      className=" w-full rounded border border-gray-500 p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-900"
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
                        value={assignData.startTime}
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
                        value={assignData.endTime}
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
                      Update Event
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
