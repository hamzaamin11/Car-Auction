import React from "react";

const VehicleCertificatePage = () => {
  const vehicle = {
    makeModel: "Honda Civic 2020",
  };

  // Yahan aap apne certificate image ka URL de sakte hain
  const certificateImageUrl =
    "https://via.placeholder.com/600x400.png?text=Certificate+Image+Here";

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
      {/* Vehicle Name */}
      <h1 className="text-3xl font-bold text-center mb-8">{vehicle.makeModel}</h1>

      {/* Certificate Image */}
      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <img
          src={certificateImageUrl}
          alt={`${vehicle.makeModel} Certificate`}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default VehicleCertificatePage;
