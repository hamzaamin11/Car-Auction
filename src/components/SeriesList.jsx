import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../components/Contant/URL";
import { RotateLoader } from "../components/Loader/RotateLoader";
import { AddModel } from "../components/ModelModal/AddModel";
import { EditModal } from "../components/ModelModal/EditModal";
import { AddSeries } from "./SeriesModal/AddSeries";
import { EditSeries } from "./SeriesModal/EditSeries";
import Swal from "sweetalert2";

export const SeriesList = () => {
  const [isOpen, setIsOpen] = useState("");
  const [loading, setLoading] = useState(false);
  const [allSeries, setAllSeries] = useState([]);
  const [seleteSeries, setSeleteSeries] = useState();
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);

  const handleNextPage = () => {
    setPageNo(pageNo + 1);
  };

  const handlePrevPage = () => {
    setPageNo(pageNo > 1 ? pageNo - 1 : 1);
  };

  const handleToggleModal = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleEditBtn = (data) => {
    handleToggleModal("Edit");
    setSeleteSeries(data);
  };

  const handleGetAllSeries = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getSeries`, {
        params: {
          search: search,
          page: pageNo,
          limit: 10,
        },
      });
      setAllSeries(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBrand = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This vehicle will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;
    try {
      const res = await axios.patch(`${BASE_URL}/deleteSeries/${id}`);
      console.log(res.data);
      handleGetAllSeries();
      toast.success("Series has been deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllSeries();
  }, [search, pageNo]);

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Mobile Layout - Stack everything */}
        <div className="md:hidden flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Vehicle Series List
          </h2>
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search By Car Model..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => handleToggleModal("Add")}
            className="w-full bg-[#191970] hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-md shadow transition duration-200"
          >
            Add Series
          </button>
        </div>

        {/* Desktop Layout - Title, Search in middle, Button on right */}
        <div className="hidden md:flex justify-between items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800 whitespace-nowrap">
            Vehicle Series List
          </h2>
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search By Car Model..."
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => handleToggleModal("Add")}
            className="bg-[#191970] hover:bg-blue-900 text-white font-bold py-2 px-6 rounded-md shadow transition duration-200 whitespace-nowrap"
          >
            Add Series
          </button>
        </div>
      </div>

      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#191970] text-white">
            <tr>
              <th className="py-3 px-4 text-left">SR#</th>
              <th className="py-3 px-4 text-left">Make Name</th>
              <th className="py-3 px-4 text-left">Model Name</th>
              <th className="py-3 px-4 text-left">Model Series</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allSeries?.map((series, index) => (
              <tr key={series._id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{series.brandName}</td>
                <td className="py-2 px-4">{series.modelName}</td>
                <td className="py-2 px-4">
                  {series.seriesName.charAt(0).toUpperCase() +
                    series.seriesName.slice(1)}
                </td>
                <td className="py-2 px-4 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEditBtn(series)}
                    className="px-3 py-1 text-sm border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(series?.id)}
                    className="px-3 py-1 text-sm border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Hidden on Desktop */}
      <div className="md:hidden space-y-3">
        {allSeries?.map((series) => (
          <div
            key={series._id}
            className="bg-white rounded-lg shadow-md p-4 space-y-3"
          >
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">Make Name</span>
                <span className="text-sm font-semibold text-gray-800">
                  {series.brandName}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">Model Name</span>
                <span className="text-sm font-semibold text-gray-800">
                  {series.modelName}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">Model Series</span>
                <span className="text-sm font-semibold text-gray-800">
                  {series.seriesName.charAt(0).toUpperCase() +
                    series.seriesName.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleEditBtn(series)}
                className="flex-1 px-3 py-2 text-sm border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white transition font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteBrand(series?.id)}
                className="flex-1 px-3 py-2 text-sm border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {allSeries.length === 0 && (
        <div className="flex justify-center items-center text-gray-500 py-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm sm:text-base">No series found</p>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 sm:mt-6 gap-2">
        <button
          className={`bg-blue-950 text-white px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base font-medium transition hover:bg-blue-900 ${
            pageNo > 1 ? "block" : "invisible"
          }`}
          onClick={handlePrevPage}
        >
          ‹ Prev
        </button>
        
        <span className="text-sm text-gray-600 font-medium">
          Page {pageNo}
        </span>
        
        <button
          className={`bg-blue-950 text-white px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base font-medium transition hover:bg-blue-900 ${
            allSeries.length === 0 ? "invisible" : "block"
          }`}
          onClick={handleNextPage}
        >
          Next ›
        </button>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
      
      {isOpen === "Add" && (
        <AddSeries
          handleClose={() => handleToggleModal("")}
          handleGetAllSeries={handleGetAllSeries}
        />
      )}
      {isOpen === "Edit" && (
        <EditSeries
          handleClose={() => handleToggleModal("")}
          seleteSeries={seleteSeries}
          handleGetAllSeries={handleGetAllSeries}
        />
      )}
    </div>
  );
};