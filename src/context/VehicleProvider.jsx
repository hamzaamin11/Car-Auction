import React, { useEffect, useState } from "react";
import VehicleContext from "./VehicleContext";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { BASE_URL } from "../components/Contant/URL";
import { RotateLoader } from "../components/Loader/RotateLoader";

function VehicleProvider({ children }) {
  const [getVehicles, setGetVehicles] = useState([]);
  const [vehiclePrices, setVehiclePrices] = useState(null);
  const [vehicleSpecs, setVehicleSpecs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  const resetVehicleDetails = () => {
    setVehiclePrices(null);
    setVehicleSpecs(null);
  };

  const getAllVehicles = async () => {
    try {
      const res = await fetch(`${BASE_URL}/seller/getVehicles`);
      const data = await res.json();
      setGetVehicles(data);
    } catch (err) {
      setError(err);
      toast.error("Failed to load vehicles");
    }
  };

  useEffect(() => {
    return () => {
      setVehiclePrices(null);
      setVehicleSpecs(null);
      setSelectedVehicleId(null);
    };
  }, []);

  const fetchVehicleData = async (vehicleId) => {
    if (!vehicleId) {
      setVehiclePrices(null);
      setVehicleSpecs(null);
      setSelectedVehicleId(null);
      return;
    }
    setSelectedVehicleId(vehicleId);
    setLoading(true);
    setError(null);

    try {
      const fetchData = async (endpoint) => {
        try {
          const res = await fetch(
            `${BASE_URL}/seller/${endpoint}?vehicleId=${vehicleId}`
          );
          if (!res.ok) return null;
          const data = await res.json();
          return Array.isArray(data) ? data[0] : data;
        } catch {
          return null;
        }
      };

      const [prices, specs] = await Promise.all([
        fetchData("getvehiclePrices"),
        fetchData("getvehicleSpecs"),
      ]);

      setVehiclePrices(prices);
      setVehicleSpecs(specs);
    } catch (err) {
      console.error("Vehicle selection error:", err);
      toast.error("Error loading vehicle details");
    } finally {
      setLoading(false);
    }
  };

  const delVehicle = async (id) => {
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
      const res = await fetch(`${BASE_URL}/seller/deleteVehicle/${id}`, {
        method: "PATCH",
      });

      if (res.ok) {
        toast.success("Vehicle deleted successfully!");
        getAllVehicles();
      } else {
        throw new Error("Failed to delete the vehicle");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAllVehicles();
  }, []);

  return (
    <VehicleContext.Provider
      value={{
        getVehicles,
        vehiclePrices,
        vehicleSpecs,
        loading,
        error,
        getAllVehicles,
        delVehicle,
        setSelectedVehicle: fetchVehicleData,
        setVehiclePrices,
        setVehicleSpecs,
        resetVehicleDetails,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

VehicleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default VehicleProvider;
