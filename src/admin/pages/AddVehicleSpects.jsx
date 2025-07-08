import React, { useState, useEffect, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import VehicleContext from "../../context/VehicleContext"

const AddVehicleSpects = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    engineType: '',
    turboCharger: '',
    displacement: '',
    numberOfCylinders: '',
    driveTrain: '',
    cylinderConfiguration: '',
    horsePower: '',
    compressionRatio: '',
    torque: '',
    valvesPerCylinder: '',
    fuelSystem: '',
    valveMechanism: '',
    maxSpeed: '',
    transmissionType: '',
    gearbox: '',
    steeringType: '',
    minTurningRadius: '',
    powerAssisted: '',
    frontSuspension: '',
    rearSuspension: '',
    frontBrakes: '',
    rearBrakes: '',
    wheelType: '',
    tyreSize: '',
    wheelSize: '',
    spareTyre: '',
    pcd: '',
    spareTyreSize: '',
    mileageCity: '',
    mileageHighway: '',
    fuelTankCapacity: ''
  });

 const {getVehicles} = useContext(VehicleContext);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/admin/addVehicleSpecs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save specifications');
      }

      toast.success('Specifications saved successfully!');
      // Reset form after successful submission
      setFormData({
        vehicleId: '',
    engineType: '',
    turboCharger: '',
    displacement: '',
    numberOfCylinders: '',
    driveTrain: '',
    cylinderConfiguration: '',
    horsePower: '',
    compressionRatio: '',
    torque: '',
    valvesPerCylinder: '',
    fuelSystem: '',
    valveMechanism: '',
    maxSpeed: '',
    transmissionType: '',
    gearbox: '',
    steeringType: '',
    minTurningRadius: '',
    powerAssisted: '',
    frontSuspension: '',
    rearSuspension: '',
    frontBrakes: '',
    rearBrakes: '',
    wheelType: '',
    tyreSize: '',
    wheelSize: '',
    spareTyre: '',
    pcd: '',
    spareTyreSize: '',
    mileageCity: '',
    mileageHighway: '',
    fuelTankCapacity: ''

      });
    } catch (error) {
      toast.error(error.message);
      console.error('Error saving specifications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Form Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Add Vehicle Specifications</h2>
          <p className="text-blue-100">Enter detailed technical specifications</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle Selection */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Vehicle *
              </label>
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a vehicle</option>
                {getVehicles?.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.year}) - {vehicle.vin}
                  </option>
                ))}
              </select>
            </div>

            {/* Engine Specifications */}
            <div className="space-y-4 md:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Engine Specifications</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Engine Type</label>
                <input
                  type="text"
                  name="engineType"
                  value={formData.engineType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Turbo Charger</label>
                <input
                  type="text"
                  name="turboCharger"
                  value={formData.turboCharger}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Displacement (cc)</label>
                <input
                  type="text"
                  name="displacement"
                  value={formData.displacement}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Drive Train (cc)</label>
                <input
                  type="text"
                  name="driveTrain"
                  value={formData.driveTrain}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Cylinders</label>
                <input
                  type="number"
                  name="numberOfCylinders"
                  value={formData.numberOfCylinders}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cylinder Configuration</label>
                <input
                  type="text"
                  name="cylinderConfiguration"
                  value={formData.cylinderConfiguration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horse Power (HP)</label>
                <input
                  type="text"
                  name="horsePower"
                  value={formData.horsePower}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compression Ratio</label>
                <input
                  type="text"
                  name="compressionRatio"
                  value={formData.compressionRatio}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Performance & Transmission */}
            <div className="space-y-4 md:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Performance & Transmission</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Torque (Nm)</label>
                <input
                  type="text"
                  name="torque"
                  value={formData.torque}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valves Per Cylinder</label>
                <input
                  type="number"
                  name="valvesPerCylinder"
                  value={formData.valvesPerCylinder}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel System</label>
                <input
                  type="text"
                  name="fuelSystem"
                  value={formData.fuelSystem}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valve Mechanism</label>
                <input
                  type="text"
                  name="valveMechanism"
                  value={formData.valveMechanism}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Speed (km/h)</label>
                <input
                  type="text"
                  name="maxSpeed"
                  value={formData.maxSpeed}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission Type</label>
                <input
                  type="text"
                  name="transmissionType"
                  value={formData.transmissionType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gearbox</label>
                <input
                  type="text"
                  name="gearbox"
                  value={formData.gearbox}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Chassis & Suspension */}
            <div className="space-y-4 md:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Chassis & Suspension</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Steering Type</label>
                <input
                  type="text"
                  name="steeringType"
                  value={formData.steeringType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Turning Radius (m)</label>
                <input
                  type="text"
                  name="minTurningRadius"
                  value={formData.minTurningRadius}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Power Assisted</label>
                <select
                  name="powerAssisted"
                  value={formData.powerAssisted}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Front Suspension</label>
                <input
                  type="text"
                  name="frontSuspension"
                  value={formData.frontSuspension}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rear Suspension</label>
                <input
                  type="text"
                  name="rearSuspension"
                  value={formData.rearSuspension}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Front Brakes</label>
                <input
                  type="text"
                  name="frontBrakes"
                  value={formData.frontBrakes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rear Brakes</label>
                <input
                  type="text"
                  name="rearBrakes"
                  value={formData.rearBrakes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Wheels & Tires */}
            <div className="space-y-4 md:col-span-1">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Wheels & Tires</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wheel Type</label>
                <input
                  type="text"
                  name="wheelType"
                  value={formData.wheelType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tyre Size</label>
                <input
                  type="text"
                  name="tyreSize"
                  value={formData.tyreSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wheel Size</label>
                <input
                  type="text"
                  name="wheelSize"
                  value={formData.wheelSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spare Tyre</label>
                <select
                  name="spareTyre"
                  value={formData.spareTyre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Space Saver">Space Saver</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PCD</label>
                <input
                  type="text"
                  name="pcd"
                  value={formData.pcd}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spare Tyre Size</label>
                <input
                  type="text"
                  name="spareTyreSize"
                  value={formData.spareTyreSize}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Fuel Economy */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Fuel Economy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mileage City (km/l)</label>
                  <input
                    type="text"
                    name="mileageCity"
                    value={formData.mileageCity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mileage Highway (km/l)</label>
                  <input
                    type="text"
                    name="mileageHighway"
                    value={formData.mileageHighway}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Tank Capacity (liters)</label>
                  <input
                    type="text"
                    name="fuelTankCapacity"
                    value={formData.fuelTankCapacity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Save Specifications'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddVehicleSpects;