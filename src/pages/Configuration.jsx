import { useEffect, useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 kept & used
import { AddCityModal } from "../components/CityModal/AddCity";
import { EditCityModal } from "../components/CityModal/EditCity";
import CustomAdd from "../CustomAdd";
import CustomSearch from "../CustomSearch";
import { AddCommission } from "../components/CommissionModal/AddCommission";
import { EditCommission } from "../components/CommissionModal/EditCommission";

export const Configuration = () => {
  const [isOpen, setIsOpen] = useState("");
  const [seleteCommission, setSeleteCommission] = useState();
  const [search, setSearch] = useState("");
  const [allCommission, setAllCommission] = useState(null);
  let getCommission = allCommission?.data;

  const handleToggleModal = (active) =>
    setIsOpen((prev) => (prev === active ? "" : active));

  const handleGetCommission = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getcommission`);
      console.log(res.data);
      setAllCommission(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteCommission = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Are you sure to want delete this Commission?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#9333ea",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      const res = await axios.patch(
        `${BASE_URL}/deletecommission/${getCommission?.id}`,
      );

      await Swal.fire({
        title: "Deleted!",
        text: "City deleted successfully",
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
          Configure Commission
        </h2>
        <div className="relative w-full max-w-md">
          <CustomSearch
            placeholder="Search By commission..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CustomAdd text="Add %" onClick={() => handleToggleModal("Add")} />
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
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      ></path>
                    </svg>
                    Commission %
                  </div>
                </th>
                <th className="p-1 text-center text-sm font-semibold text-white">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-600">
              {getCommission ? (
                <tr className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="p-3 whitespace-nowrap">1</td>
                  <td className="p-1 text-center">
                    <div className="flex items-center justify-center">
                      <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold text-base">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        {getCommission?.commission}%
                      </span>
                    </div>
                  </td>
                  <td className="p-1">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => {
                          handleToggleModal("Edit");
                          setSeleteCommission(getCommission?.id);
                        }}
                        className="inline-flex items-center p-2   bg-blue-950 hover:bg-blue-900 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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
                        onClick={() => handleDeleteCommission(getCommission)}
                        className="inline-flex items-center p-2  bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg border border-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      >
                        <svg
                          className="w-4 h-4 "
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
              ) : (
                <tr>
                  <td colSpan="3" className="py-12">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Commission Set
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Configure your commission percentage to get started
                      </p>
                      <button
                        onClick={() => handleToggleModal("Add")}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          ></path>
                        </svg>
                        Add Commission
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen === "Add" && (
        <AddCommission
          handleClose={() => handleToggleModal("")}
          handleGetAllCommission={handleGetCommission}
        />
      )}
      {isOpen === "Edit" && (
        <EditCommission
          handleClose={() => handleToggleModal("")}
          seleteCommission={seleteCommission}
          handleGetAllCommission={handleGetCommission}
        />
      )}
    </div>
  );
};
