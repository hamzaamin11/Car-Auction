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
import CustomAdd from "../CustomAdd";
import CustomSearch from "../CustomSearch";
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
    console.log("id =>", id);
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
      await Swal.fire({
        title: "delete!",
        text: "The series has been delete successfully.",
        icon: "delete",
        confirmButtonColor: "#9333ea",
      });
    } catch (error) {
      console.log(error);
      await Swal.fire({
        title: "error!",
        text: "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  // Handle search change and reset page to 1
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPageNo(1); // Reset to first page when searching
  };

  useEffect(() => {
    handleGetAllSeries();
  }, [search, pageNo]);

  return (
    <div className="min-h-screen bg-gray-100 lg:p-6 p-2">
      {/* Header Section */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-3">
        {/* Mobile Layout - Stack everything */}
        <div className="md:hidden flex flex-col gap-3">
          <h2 className="lg:text-3xl text-xl font-bold text-gray-800 text-center">
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
              onChange={handleSearchChange}
              value={search}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => handleToggleModal("Add")}
            className="w-full bg-blue-950 text-white font-bold py-2 px-4 rounded-md shadow transition duration-200"
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
           <CustomSearch
  placeholder="Search By Car Model..."
  value={search}
  onChange={handleSearchChange}
/>

          </div>
                <CustomAdd text="Add Series" onClick={() => handleToggleModal("Add")} />
        </div>
      </div>

      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-blue-950 text-white">
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
              <tr key={series._id} className="border-b ">
                <td className="py-2 px-4">{(pageNo - 1) * 10 + index + 1}</td>
                <td className="py-2 px-4">{series.brandName}</td>
                <td className="py-2 px-4">{series.modelName}</td>
                <td className="py-2 px-4">
                  {series.seriesName.charAt(0).toUpperCase() +
                    series.seriesName.slice(1)}
                </td>
                <td className="py-2 px-4 flex gap-2 justify-center">
                <CustomAdd
  text="Edit"
  variant="edit"
  onClick={() => handleEditBtn(series)}
/>
                 <CustomAdd
  text="Delete"
  variant="delete"
  onClick={() => handleDeleteBrand(series?.seriesId)}
/>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Hidden on Desktop */}

      {allSeries?.length > 0 ? (
        allSeries.map((series, index) => (
          <div
            key={series._id}
            className=" flex-col block md:hidden bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-200 mb-3"
          >
            {/* Header Row */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-3">
              <h4 className="font-bold text-gray-800  capitalize">
                {series.seriesName}
              </h4>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-2 gap-y-1 text-sm">
              <div className="text-gray-800 font-bold">Brand</div>
              <div className="text-gray-800 px-2">
                {series.brandName}
              </div>

              <div className="text-gray-800 font-bold">Model</div>
              <div className="text-gray-800 px-2 ">
                {series.modelName}
              </div>

              <div className="text-gray-800 font-bold">Series</div>
              <div className="text-gray-800 px-2">
                {series.seriesName}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
          <CustomAdd text="Edit" variant="edit" onClick={() => handleEditBtn(series)} />
  <CustomAdd text="Delete" variant="delete" onClick={() => handleDeleteBrand(series?.seriesId)} />
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 text-sm py-6">
          No series available.
        </p>
      )}

    

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 sm:mt-6 gap-2">
        <button
          className={`bg-blue-950 text-white px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base font-medium transition  ${
            pageNo > 1 ? "block" : "invisible"
          }`}
          onClick={handlePrevPage}
        >
          ‹ Prev
        </button>

        <button
          className={`bg-blue-950 text-white px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base font-medium transition  ${
            allSeries.length === 10 ? "block" : "hidden"
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