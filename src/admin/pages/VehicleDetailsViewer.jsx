import { useContext } from "react";
import VehicleContext from "../../context/VehicleContext";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  navigationStart,
  navigationSuccess,
} from "../../components/Redux/NavigationSlice";
import { RotateLoader } from "../../components/Loader/RotateLoader";

const Section = ({ title, children, highlight = false }) => (
  <div className={`${highlight ? "bg-blue-50 -mx-6 px-6 py-4" : ""}`}>
    <h3
      className={`font-semibold mb-3 ${
        highlight ? "text-blue-700" : "text-gray-700"
      }`}
    >
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const DataRow = ({ label, value, total = false }) => (
  <div
    className={`flex justify-between ${
      total ? "border-t pt-2 font-bold text-blue-700" : ""
    }`}
  >
    <span className="text-gray-600">{label}</span>
    <span>
      {value !== undefined && value !== null
        ? `PKR ${parseFloat(value).toLocaleString("en-PK", {
            minimumFractionDigits: 2,
          })}`
        : "N/A"}
    </span>
  </div>
);

const SpecRow = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-4">
    <span className="text-gray-500 col-span-1">{label}</span>
    <span className="font-medium col-span-2">
      {value !== undefined && value !== null ? value : "-"}
    </span>
  </div>
);

const VehicleDetailsViewer = () => {
  const {
    getVehicles,
    vehiclePrices,
    vehicleSpecs,
    loading,
    error,
    setSelectedVehicle,
    setVehiclePrices,
    setVehicleSpecs,
    getAllVehicles,
  } = useContext(VehicleContext);

  const { loader } = useSelector((state) => state.navigateState);

  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setVehiclePrices(null);
    setVehicleSpecs(null);
  }, [location.pathname, setVehiclePrices, setVehicleSpecs]);

  const filteredVehicles = getVehicles.filter((vehicle) =>
    `${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.vin}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleVehicleSelect = (e) => {
    const vehicleId = e.target.value;
    setSelectedVehicle(vehicleId);
  };

  useEffect(() => {
    getAllVehicles();

    dispatch(navigationStart());

    setTimeout(() => {
      dispatch(navigationSuccess("view detail"));
    }, 1000);
  }, []);

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (loader) return <RotateLoader />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Searchable Dropdown */}
      <div className="mb-8 bg-white p-4 rounded-lg mt-6 shadow-md sticky top-0 z-10">
        <div className="relative max-w-2xl mx-auto ">
          <h1 className="text-3xl text-blue-600 font-bold mb-4">
            View Complete Vehicle Details
          </h1>
          {/* <input
            type="text"
            placeholder="🔍 Search vehicles (make, model, year, VIN)..."
            className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
          <select
            onChange={handleVehicleSelect}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a vehicle...</option>
            {filteredVehicles?.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.year}) • VIN:{" "}
                {vehicle.vin}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading vehicle details...</p>
        </div>
      )}

      {/* No Vehicle Selected */}
      {!loading &&
        !vehiclePrices &&
        !vehicleSpecs &&
        getVehicles.length > 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-xl">
              Select a vehicle to view details
            </p>
          </div>
        )}

      {/* No Vehicles Available */}
      {!loading && getVehicles.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-xl">No vehicles available</p>
        </div>
      )}

      {/* Data Display */}
      {!loading && (vehiclePrices || vehicleSpecs) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 animate-fade-in">
          {/* PRICING CARD */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                Complete Pricing Breakdown
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {vehiclePrices ? (
                <>
                  <Section title="Base Pricing">
                    <DataRow
                      label="Ex-Factory Price"
                      value={vehiclePrices.exFactoryPrice}
                    />
                  </Section>

                  <Section title="Taxes">
                    <DataRow
                      label="Withholding Tax (Filer)"
                      value={vehiclePrices.withholdingTaxFiler}
                    />
                    <DataRow
                      label="Withholding Tax (Non-Filer)"
                      value={vehiclePrices.withholdingTaxNonFiler}
                    />
                    <DataRow
                      label="Income Tax (Filer)"
                      value={vehiclePrices.incomeTaxFiler}
                    />
                    <DataRow label="Token Tax" value={vehiclePrices.tokenTax} />
                  </Section>

                  <Section title="Fees">
                    <DataRow
                      label="Registration Fee"
                      value={vehiclePrices.registrationFee}
                    />
                    <DataRow
                      label="Registration Book"
                      value={vehiclePrices.registrationBook}
                    />
                    <DataRow
                      label="Scanning & Archiving"
                      value={vehiclePrices.scanningArchivingFee}
                    />
                    <DataRow
                      label="Sticker Fee"
                      value={vehiclePrices.stickerFee}
                    />
                    <DataRow
                      label="Number Plate Charges"
                      value={vehiclePrices.numberPlateCharges}
                    />
                  </Section>

                  <Section title="Totals" highlight>
                    <DataRow
                      label="Pay Order Price (Filer)"
                      value={vehiclePrices.payorderPriceFiler}
                    />
                    <DataRow
                      label="Pay Order Price (Non-Filer)"
                      value={vehiclePrices.payorderPriceNonFiler}
                    />
                    <DataRow
                      label="Total Price (Filer)"
                      value={vehiclePrices.totalPriceFiler}
                      total
                    />
                    <DataRow
                      label="Total Price (Non-Filer)"
                      value={vehiclePrices.totalPriceNonFiler}
                      total
                    />
                  </Section>
                </>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Pricing information not available
                </div>
              )}
            </div>
          </div>

          {/* SPECS CARD */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                Technical Specifications
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {vehicleSpecs ? (
                <>
                  <Section title="Engine">
                    <SpecRow
                      label="Engine Type"
                      value={vehicleSpecs.engineType}
                    />
                    <SpecRow
                      label="Turbo Charger"
                      value={vehicleSpecs.turboCharger}
                    />
                    <SpecRow
                      label="Displacement"
                      value={vehicleSpecs.displacement}
                    />
                    <SpecRow
                      label="Cylinders"
                      value={`${vehicleSpecs.numberOfCylinders} (${vehicleSpecs.cylinderConfiguration})`}
                    />
                    <SpecRow
                      label="Horse Power"
                      value={vehicleSpecs.horsePower}
                    />
                    <SpecRow label="Torque" value={vehicleSpecs.torque} />
                    <SpecRow
                      label="Compression Ratio"
                      value={vehicleSpecs.compressionRatio}
                    />
                    <SpecRow
                      label="Valves/Cylinder"
                      value={vehicleSpecs.valvesPerCylinder}
                    />
                    <SpecRow
                      label="Fuel System"
                      value={vehicleSpecs.fuelSystem}
                    />
                    <SpecRow
                      label="Valve Mechanism"
                      value={vehicleSpecs.valveMechanism}
                    />
                  </Section>

                  <Section title="Performance">
                    <SpecRow label="Max Speed" value={vehicleSpecs.maxSpeed} />
                    <SpecRow
                      label="Transmission"
                      value={vehicleSpecs.transmissionType}
                    />
                    <SpecRow label="Gearbox" value={vehicleSpecs.gearbox} />
                    <SpecRow
                      label="Drive Train"
                      value={vehicleSpecs.driveTrain}
                    />
                  </Section>

                  <Section title="Chassis">
                    <SpecRow
                      label="Steering Type"
                      value={vehicleSpecs.steeringType}
                    />
                    <SpecRow
                      label="Turning Radius"
                      value={vehicleSpecs.minTurningRadius}
                    />
                    <SpecRow
                      label="Power Assisted"
                      value={vehicleSpecs.powerAssisted}
                    />
                    <SpecRow
                      label="Front Suspension"
                      value={vehicleSpecs.frontSuspension}
                    />
                    <SpecRow
                      label="Rear Suspension"
                      value={vehicleSpecs.rearSuspension}
                    />
                    <SpecRow
                      label="Front Brakes"
                      value={vehicleSpecs.frontBrakes}
                    />
                    <SpecRow
                      label="Rear Brakes"
                      value={vehicleSpecs.rearBrakes}
                    />
                  </Section>

                  <Section title="Wheels & Tires">
                    <SpecRow
                      label="Wheel Type"
                      value={vehicleSpecs.wheelType}
                    />
                    <SpecRow label="Tire Size" value={vehicleSpecs.tyreSize} />
                    <SpecRow
                      label="Wheel Size"
                      value={vehicleSpecs.wheelSize}
                    />
                    <SpecRow
                      label="Spare Tire"
                      value={`${vehicleSpecs.spareTyre} (${vehicleSpecs.spareTyreSize})`}
                    />
                    <SpecRow label="PCD" value={vehicleSpecs.pcd} />
                  </Section>

                  <Section title="Fuel Economy">
                    <SpecRow
                      label="City Mileage"
                      value={vehicleSpecs.mileageCity}
                    />
                    <SpecRow
                      label="Highway Mileage"
                      value={vehicleSpecs.mileageHighway}
                    />
                    <SpecRow
                      label="Fuel Tank Capacity"
                      value={vehicleSpecs.fuelTankCapacity}
                    />
                  </Section>
                </>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  Specifications not available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetailsViewer;
