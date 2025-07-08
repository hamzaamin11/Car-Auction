import React from "react";

const CarColors = ({ selectedPrice }) => {
  const colors = [
    { name: "Ibis White", code: "#ffffff" },
    { name: "Mythos Black", code: "#000000" },
    { name: "Floret Silver", code: "#d0d2d1" },
    { name: "Daytona Gray", code: "#D7D2CE" },
    { name: "Arabian Blue", code: "#143B79" },
    { name: "Tango Red", code: "#AC0C2D" },
    { name: "Nano Gray", code: "#6B6967" },
  ];

  return (
    <section id="version-colors" className="py-10 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          {selectedPrice && selectedPrice?.model}{" "}
          {selectedPrice && selectedPrice?.make}{" "}
          {selectedPrice && selectedPrice?.engine} Colors
        </h2>
        <p className="text-gray-600 mb-6">
          {selectedPrice && selectedPrice?.model}{" "}
          {selectedPrice && selectedPrice?.make}{" "}
          {selectedPrice && selectedPrice?.engine} is available in 7 different
          colours - Ibis White, Mythos Black, Floret Silver, Daytona Gray,
          Arabian Blue, Tango Red, and Nano Gray
        </p>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 bg-white p-4 rounded-md">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-1 w-24"
            >
              <span
                className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
                style={{ backgroundColor: color.code }}
              ></span>
              <p className="text-xs text-gray-700 text-center">{color.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarColors;
