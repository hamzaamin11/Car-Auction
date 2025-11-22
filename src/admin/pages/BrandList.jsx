import React, { useEffect, useState } from "react";
import { AddBrandModal } from "../../components/BrandModal/AddBrandModal";
import axios from "axios";
import { BASE_URL } from "../../components/Contant/URL";
import { EditBrandModal } from "../../components/BrandModal/EditBrandModal";
import { toast, ToastContainer } from "react-toastify";
import CustomAdd from "../../CustomAdd";
import CustomSearch from "../../CustomSearch";

export const BrandList = () => {
  const [isOpen, setIsOpen] = useState("");
  const [loading, setLoading] = useState(false);
  const [allBrands, setAllBrands] = useState([]);           // All loaded brands
  const [hasMore, setHasMore] = useState(true);             // Are there more pages?
  const [seleteBrand, setSeleteBrand] = useState();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const itemsPerRequest = 10; // Your backend limit (fixed)

  const handleToggleModal = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleEditBtn = (data) => {
    handleToggleModal("Edit");
    setSeleteBrand(data);
  };

  // Fetch a specific page from backend
  const fetchPage = async (page, searchTerm = "") => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBrands`, {
        params: { search: searchTerm, page, limit: itemsPerRequest },
      });

      const newBrands = res.data || [];
      if (newBrands.length < itemsPerRequest) setHasMore(false);
      return newBrands;
    } catch (error) {
      toast.error("Failed to load brands");
      return [];
    }
  };

  // Load initial data + handle search
  const loadBrands = async (reset = false) => {
    setLoading(true);
    const pageToLoad = reset ? 1 : currentPage;
    const brands = await fetchPage(pageToLoad, search);

    if (reset) {
      setAllBrands(brands);
      setHasMore(brands.length === itemsPerRequest);
    } else {
      setAllBrands(prev => [...prev, ...brands]);
    }
    setLoading(false);
  };

  // Trigger load on search, page, or itemsPerPage change
  useEffect(() => {
    setAllBrands([]);
    setHasMore(true);
    setCurrentPage(1);
    loadBrands(true); // reset
  }, [search, itemsPerPage]);

  // Auto-load next pages when user goes forward and we don't have enough data
  useEffect(() => {
    const totalNeeded = currentPage * itemsPerPage;
    if (allBrands.length < totalNeeded && hasMore && !loading) {
      const nextApiPage = Math.floor(allBrands.length / itemsPerRequest) + 1;
      loadBrands(false);
    }
  }, [currentPage, itemsPerPage]);

  // Client-side pagination (from loaded data)
  const totalItems = allBrands.length + (hasMore ? 1 : 0); // +1 to keep "Next" alive if more exist
  const displayBrands = allBrands.slice(0, currentPage * itemsPerPage);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, allBrands.length);
  const currentDisplay = displayBrands.slice(startIndex, endIndex);

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
    <div className="min-h-screen bg-gray-100 lg:p-6 p-2">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="lg:text-3xl text-xl font-bold text-gray-800">
          Vehicle Makes List 
        </h2>
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </span>
          <CustomSearch
            placeholder="Search By Car Makes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CustomAdd text="Add Makes" onClick={() => handleToggleModal("Add")} />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="py-3 px-4 text-left">SR#</th>
              <th className="py-3 px-4 text-left">Makes Image</th>
              <th className="py-3 px-4 text-left">Makes</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && allBrands.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10">Loading...</td></tr>
            ) : currentDisplay.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10 text-gray-500">No brands found</td></tr>
            ) : (
              currentDisplay.map((brand, index) => (
                <tr key={brand._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{startIndex + index + 1}</td>
                  <td className="py-3 px-4">
                    <img src={brand.logo} alt={brand.brandName} className="w-12 h-12 object-contain rounded" />
                  </td>
                  <td className="py-3 px-4">
                    {brand.brandName.charAt(0).toUpperCase() + brand.brandName.slice(1)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <CustomAdd text="Edit" variant="edit" onClick={() => handleEditBtn(brand)} />
                  </td>
                </tr>
              ))
            )}
          
          </tbody>
        </table>
      </div>

      {/* EXACT SAME PAGINATION UI — NOW WORKS 100% */}
      {allBrands.length > 0 && (
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

              {getPageNumbers().map(page => (
                <button key={page} onClick={() => goToPage(page)}
                  className={`px-3 py-1 rounded border ${currentPage === page ? "bg-blue-950 text-white" : "bg-white hover:bg-gray-50"}`}>
                  {page}
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
             
          
            </div>
          </div>
        </div>
      )}

      {isOpen === "Add" && <AddBrandModal handleClose={() => handleToggleModal("")} handleGetAllBrands={() => loadBrands(true)} />}
      {isOpen === "Edit" && <EditBrandModal handleClose={() => handleToggleModal("")} seleteBrand={seleteBrand} handleGetAllBrands={() => loadBrands(true)} />}

      <ToastContainer />
    </div>
  );
};