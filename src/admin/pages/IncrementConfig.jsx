import { useEffect, useRef, useState } from "react";

import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 kept & used

import { BASE_URL } from "../../components/Contant/URL";
import CustomAdd from "../../CustomAdd";
import CustomSearch from "../../CustomSearch";
import { AddIncrement } from "../components/IncrementConfigModal/AddIncrement";
import { EditIncrement } from "../components/IncrementConfigModal/EditIncrement";

export const IncrementConfig = () => {
  const [isOpen, setIsOpen] = useState("");
  const [search, setSearch] = useState("");
  const [allIncrementalAmounts, setAllIncrementalAmounts] = useState([]);
  const incrementId = useRef();

  console.log(incrementId.current);

  const handleToggleModal = (active) =>
    setIsOpen((prev) => (prev === active ? "" : active));

  const handleGetCommission = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/listConfigureIncrements`);
      console.log(res.data);
      setAllIncrementalAmounts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCommission = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Are you sure to want delete this Increment?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#9333ea",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      const res = await axios.delete(
        `${BASE_URL}/admin/deleteConfigureIncrement/${id}`
      );

      await Swal.fire({
        title: "Deleted!",
        text: "Increment deleted successfully",
        icon: "success",
        confirmButtonColor: "#9333ea",
        timer: 2000,
        timerProgressBar: true,
      });
      handleGetCommission();
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Something went wrong",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  useEffect(() => {
    handleGetCommission();
  }, []);
  return (
    <div className="max-h-screen bg-gray-100 p-2 lg:p-6">
      {/* YOUR ORIGINAL HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800">
          Configure Increment
        </h2>
        <div className="relative w-full max-w-md">
          <CustomSearch
            placeholder="Search By Configuration Inc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CustomAdd text="Add Inc" onClick={() => handleToggleModal("Add")} />
      </div>

      {/* YOUR ORIGINAL TABLE */}
      <div className="bg-white rounded shadow-lg overflow-hidden border border-gray-600">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-blue-950">
                <th className="p-3 text-left text-sm font-semibold text-white">
                  Sr
                </th>
                <th className="p-1 text-left text-sm font-semibold text-white">
                  <div className="flex items-center justify-center">
                    Amount Increment
                  </div>
                </th>
                <th className="p-1 text-center text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-600">
              {allIncrementalAmounts.map((inc, index) => (
                <tr className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="p-3 whitespace-nowrap">{index + 1}</td>
                  <td className="p-1 text-center">
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center px-4 py-2 rounded-full   font-semibold text-base">
                        {inc?.amount} PKR
                      </span>
                    </div>
                  </td>
                  <td className="p-1">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => {
                          incrementId.current = inc?.id;
                          handleToggleModal("Edit");
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-950 hover:bg-blue-900 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCommission(
                            (incrementId.current = inc?.id)
                          )
                        }
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg border border-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen === "Add" && (
        <AddIncrement
          handleClose={() => handleToggleModal("")}
          handleGetAllCommission={handleGetCommission}
        />
      )}
      {isOpen === "Edit" && (
        <EditIncrement
          handleClose={() => handleToggleModal("")}
          handleGetAllCommission={handleGetCommission}
          incrementId={incrementId.current}
        />
      )}
    </div>
  );
};
