import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { BASE_URL } from "../components/Contant/URL";
import { AddSeries } from "./SeriesModal/AddSeries";
import { EditSeries } from "./SeriesModal/EditSeries";
import CustomAdd from "../CustomAdd";
import CustomSearch from "../CustomSearch";

export const SeriesList = () => {
  const [isOpen, setIsOpen] = useState("");
  const [loading, setLoading] = useState(false);
  const [allSeries, setAllSeries] = useState([]); // All loaded series
  const [hasMore, setHasMore] = useState(true);
  const [seleteSeries, setSeleteSeries] = useState();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const itemsPerRequest = 10; // Backend limit

  const handleToggleModal = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleEditBtn = (data) => {
    handleToggleModal("Edit");
    setSeleteSeries(data);
  };

  const handleDeleteSeries = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This series will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9333ea",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.patch(`${BASE_URL}/deleteSeries/${id}`);

      await Swal.fire({
        title: "Deleted!",
        text: "Series deleted successfully",
        icon: "success",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      loadSeries(true); // Refresh list
    } catch (error) {
      console.log(error);
      await Swal.fire({
        title: "Error",
        text: "Failed to delete series",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // Fetch one page
  const fetchPage = async (page, searchTerm = "") => {
    try {
      const res = await axios.get(`${BASE_URL}/getSeries`, {
        params: { search: searchTerm, page, limit: itemsPerRequest },
      });
      const data = res.data || [];
      if (data.length < itemsPerRequest) setHasMore(false);
      return data;
    } catch (error) {
      await Swal.fire({
        title: "Error",
        text: "Failed to load series",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
      return [];
    }
  };

  // Load data — EXACT SAME LOGIC AS BRANDLIST
  const loadSeries = async (reset = false) => {
    setLoading(true);
    const pageToLoad = reset
      ? 1
      : Math.floor(allSeries.length / itemsPerRequest) + 1;
    const newSeries = await fetchPage(pageToLoad, search);

    if (reset) {
      setAllSeries(newSeries);
      setHasMore(newSeries.length === itemsPerRequest);
    } else {
      setAllSeries((prev) => [...prev, ...newSeries]);
    }
    setLoading(false);
  };

  // Reset on search or itemsPerPage change
  useEffect(() => {
    setAllSeries([]);
    setHasMore(true);
    setCurrentPage(1);
    loadSeries(true);
  }, [search, itemsPerPage]);

  // Auto-load more when needed
  useEffect(() => {
    const needed = currentPage * itemsPerPage;
    if (allSeries.length < needed && hasMore && !loading) {
      loadSeries(false);
    }
  }, [currentPage, itemsPerPage]);

  // PERFECT PAGINATION MATH — SAME AS BRANDLIST
  const totalItems = allSeries.length + (hasMore ? 1 : 0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, allSeries.length);
  const currentDisplay = allSeries.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="max-h-screen bg-gray-100 lg:p-6 p-2">
      {/* YOUR ORIGINAL HEADER — UNTOUCHED */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6">
        <div className="md:hidden flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Vehicle Series List
          </h2>
          <div className="relative">
            <CustomSearch
              placeholder="Search By Car Model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CustomAdd
            text="Add Series"
            onClick={() => handleToggleModal("Add")}
          />
        </div>

        <div className="hidden md:flex justify-between items-center gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Series</h2>
          <div className="relative flex-1 max-w-md">
            <CustomSearch
              placeholder="Search By Car Model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CustomAdd
            text="Add Series"
            onClick={() => handleToggleModal("Add")}
          />
        </div>
      </div>

      {/* Desktop Table — YOUR ORIGINAL */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Sr</th>
              <th className="py-3 px-4 text-left">Make Name</th>
              <th className="py-3 px-4 text-left">Model Name</th>
              <th className="py-3 px-4 text-left">Model Series</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && allSeries.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : currentDisplay.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No series found
                </td>
              </tr>
            ) : (
              currentDisplay.map((series, index) => (
                <tr key={series._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{startIndex + index + 1}</td>
                  <td className="py-3 px-4">{series.brandName}</td>
                  <td className="py-3 px-4">{series.modelName}</td>
                  <td className="py-3 px-4">
                    {series.seriesName?.charAt(0).toUpperCase() +
                      series.seriesName?.slice(1)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <CustomAdd
                        text="Edit"
                        variant="edit"
                        onClick={() => handleEditBtn(series)}
                      />
                      <CustomAdd
                        text="Delete"
                        variant="delete"
                        onClick={() => handleDeleteSeries(series?.seriesId)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards — YOUR ORIGINAL */}
      <div className="md:hidden">
        {currentDisplay.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No series found</p>
        ) : (
          currentDisplay.map((series, index) => (
            <div
              key={series._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-4 hover:shadow-md"
            >
              <h4 className="font-bold text-lg text-gray-800 capitalize mb-2">
                {series.seriesName}
              </h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="font-semibold">Brand:</span>
                <span>{series.brandName}</span>
                <span className="font-semibold">Model:</span>
                <span>{series.modelName}</span>
              </div>
              <div className="flex gap-3 mt-4">
                <CustomAdd
                  text="Edit"
                  variant="edit"
                  onClick={() => handleEditBtn(series)}
                />
                <CustomAdd
                  text="Delete"
                  variant="delete"
                  onClick={() => handleDeleteSeries(series?.seriesId)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* PERFECT PAGINATION — SAME AS BRANDLIST */}
      {allSeries.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
            <div className="text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{endIndex}</span> entries
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {"<<"}
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {"<"}
              </button>

              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === page
                      ? "bg-blue-950 text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={!hasMore && currentPage >= totalPages}
                className={`px-3 py-1 rounded border ${
                  !hasMore && currentPage >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {">"}
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={!hasMore && currentPage >= totalPages}
                className={`px-3 py-1 rounded border ${
                  !hasMore && currentPage >= totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {">>"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isOpen === "Add" && (
        <AddSeries
          handleClose={() => handleToggleModal("")}
          handleGetAllSeries={() => loadSeries(true)}
        />
      )}
      {isOpen === "Edit" && (
        <EditSeries
          handleClose={() => handleToggleModal("")}
          seleteSeries={seleteSeries}
          handleGetAllSeries={() => loadSeries(true)}
        />
      )}
    </div>
  );
};
