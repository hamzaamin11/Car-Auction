
import React from 'react';

const vehicleDetails = {
  "Make": "Toyota",
  "Model": "Corolla X",
  "Year": "2022",
  "Transmission": "Automatic",
  "Fuel Type": "Petrol",
  "Mileage": "32,000 km",
  "Color": "Silver",
  "Registration": "LHR-9876",
  "Engine Capacity": "1800cc",
  "Owner": "First Owner",
};

const VehicleInfoTable = () => {
  return (
    <section className="bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-sm md:text-base">
          <tbody>
            {Object.entries(vehicleDetails).map(([key, value], idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-100 w-1/3">{key}</td>
                <td className="px-4 py-3 text-gray-800">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default VehicleInfoTable;
