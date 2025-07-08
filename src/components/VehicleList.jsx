
import React from 'react';

const VehicleList = ({ vehicles }) => {
  if (vehicles.length === 0) {
    return <p className="text-center text-gray-600">No vehicles match your criteria.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {vehicles.map((vehicle, idx) => (
        <div key={idx} className="bg-white shadow rounded-lg overflow-hidden">
          <img src={vehicle.image} alt={vehicle.model} className="w-full h-56 object-contain bg-gray-100" />
          <div className="p-4">
            <h3 className="text-xl font-bold text-blue-700">{vehicle.make} {vehicle.model}</h3>
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              <li><strong>Year:</strong> {vehicle.year}</li>
              <li><strong>Transmission:</strong> {vehicle.transmission}</li>
              <li><strong>Mileage:</strong> {vehicle.mileage}</li>
              <li><strong>Fuel:</strong> {vehicle.fuel}</li>
              <li><strong>Color:</strong> {vehicle.color}</li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleList;
