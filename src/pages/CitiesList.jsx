import { useEffect, useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import axios from "axios";
import { toast } from "react-toastify";
import { AddCityModal } from "../components/CityModal/AddCity";
import { EditCityModal } from "../components/CityModal/EditCity";
import CustomAdd from "../CustomAdd";
import CustomSearch from "../CustomSearch";

export const CitiesList = () => {
  const [isOpen, setIsOpen] = useState("");
  const [loading, setLoading] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [seleteCity, setSeleteCity] = useState();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const itemsPerRequest = 10;

  const handleToggleModal = (active) => setIsOpen((prev) => (prev === active ? "" : active));
  const handleEditBtn = (city) => {
    handleToggleModal("Edit");
    setSeleteCity(city);
  };

  // Fetch one page from backend
  const fetchPage = async (page, searchTerm = "") => {
    try {
      const res = await axios.get(`${BASE_URL}/getCitites`, {
        params: { search: searchTerm, page, limit: itemsPerRequest },
      });
      const data = res.data || [];
      if (data.length < itemsPerRequest) setHasMore(false);
      return data;
    } catch (err) {
      toast.error("Failed to load cities");
      return [];
    }
  };

  // Load cities — EXACT SAME LOGIC AS BRANDLIST (simple & perfect)
  const loadCities = async (reset = false) => {
    setLoading(true);
    const pageToLoad = reset ? 1 : Math.floor(allCities.length / itemsPerRequest) + 1;
    const newCities = await fetchPage(pageToLoad, search);

    if (reset) {
      setAllCities(newCities);
      setHasMore(newCities.length === itemsPerRequest);
    } else {
      setAllCities(prev => [...prev, ...newCities]);
    }
    setLoading(false);
  };

  // Reset on search or itemsPerPage change
  useEffect(() => {
    setAllCities([]);
    setHasMore(true);
    setCurrentPage(1);
    loadCities(true);
  }, [search, itemsPerPage]);

  // Auto-load next batch when needed
  useEffect(() => {
    const totalNeeded = currentPage * itemsPerPage;
    if (allCities.length < totalNeeded && hasMore && !loading) {
      loadCities(false);
    }
  }, [currentPage, itemsPerPage]);

  // PERFECT PAGINATION MATH — SAME AS BRANDLIST
  const totalItems = allCities.length + (hasMore ? 1 : 0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, allCities.length);
  const currentDisplay = allCities.slice(startIndex, endIndex);

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
    <div className="min-h-screen bg-gray-100 p-2 lg:p-6">
      {/* YOUR ORIGINAL HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800">
          Cities List 
        </h2>
        <div className="relative w-full max-w-md">
          <CustomSearch
            placeholder="Search By City Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CustomAdd text="Add City" onClick={() => handleToggleModal("Add")} />
      </div>

      {/* YOUR ORIGINAL TABLE */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-950 text-white text-base">
            <tr>
              <th className="py-3 px-6 text-left">SR#</th>
              <th className="py-3 px-6 text-center">City Name</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && allCities.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-10">Loading...</td></tr>
            ) : currentDisplay.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-10 text-gray-500">No cities found</td></tr>
            ) : (
              currentDisplay.map((city, idx) => (
                <tr key={city.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{startIndex + idx + 1}</td>
                  <td className="py-3 px-6 text-center capitalize">{city.cityName}</td>
                  <td className="py-3 px-6 text-center">
                    <CustomAdd text="Edit" variant="edit" onClick={() => handleEditBtn(city)} />
                  </td>
                </tr>
              ))
            )}
            {loading && allCities.length > 0 && (
              <tr><td colSpan="3" className="text-center py-4 text-blue-600">Loading more...</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ONLY THIS PART CHANGED — EXACT SAME PERFECT PAGINATION FROM BRANDLIST */}
      {allCities.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
            <div className="text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{endIndex}</span> of{" "}
              <span className="font-medium"></span> entries
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(1)} disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}>
                {"<<"}
              </button>
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}>
                {"<"}
              </button>

              {getPageNumbers().map(p => (
                <button key={p} onClick={() => goToPage(p)}
                  className={`px-3 py-1 rounded border ${currentPage === p ? "bg-blue-950 text-white" : "bg-white hover:bg-gray-50"}`}>
                  {p}
                </button>
              ))}

              <button onClick={() => goToPage(currentPage + 1)} disabled={!hasMore && currentPage >= totalPages}
                className={`px-3 py-1 rounded border ${(!hasMore && currentPage >= totalPages) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}>
                {">"}
              </button>
              <button onClick={() => goToPage(totalPages)} disabled={!hasMore && currentPage >= totalPages}
                className={`px-3 py-1 rounded border ${(!hasMore && currentPage >= totalPages) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}>
                {">>"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* You can add entries selector here later */}
            </div>
          </div>
        </div>
      )}

      {isOpen === "Add" && <AddCityModal handleClose={() => handleToggleModal("")} handleGetAllCities={() => loadCities(true)} />}
      {isOpen === "Edit" && <EditCityModal handleClose={() => handleToggleModal("")} seleteCity={seleteCity} handleGetAllCities={() => loadCities(true)} />}
    </div>
  );
};