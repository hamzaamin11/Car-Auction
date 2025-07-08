
import React, { useState } from "react";

export default function CarImageGallery({ images, carName, onCarNameClick }) {
  const [zoomedIndex, setZoomedIndex] = useState(0);

  return (
    <div>
      <div className="relative w-full h-64 md:h-80 bg-gray-100 rounded overflow-hidden mb-4 cursor-zoom-in">
        <img
          src={images[zoomedIndex]}
          alt={`${carName} - zoomed`}
          className="w-full h-full object-cover"
          onClick={() => {
            // Toggle zoom or implement modal zoom if you want
            // For now just alert
            alert("Zoomed image clicked!");
          }}
        />
        <span className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-sm">
          {zoomedIndex + 1} / {images.length}
        </span>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`${carName} thumb ${i + 1}`}
            className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
              i === zoomedIndex ? "border-blue-600" : "border-transparent"
            }`}
            onClick={() => setZoomedIndex(i)}
          />
        ))}
      </div>

      <h2
        className="mt-3 text-xl font-semibold text-blue-600 cursor-pointer hover:underline"
        onClick={onCarNameClick}
      >
        {carName}
      </h2>
    </div>
  );
}
