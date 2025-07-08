
import React, { useState } from 'react';

const images = [
  '/card1slide1.jpg',
  '/card1slide2.jpg',
  '/card1slide3.jpg',
  '/card1slide4.jpg',
];

const VehicleImageGallery = () => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <section className="py-8 px-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Vehicle Image Gallery</h2>

      {/* Main Image Display */}
      <div className="mb-4 border rounded-md bg-gray-100 shadow-md">
        <img
          src={mainImage}
          alt="Vehicle"
          className="w-full max-h-[500px] object-contain mx-auto rounded-md transition-all duration-300"
        />
      </div>

     
      <div className="flex gap-4 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Thumbnail ${idx}`}
            className={`h-20 w-28 object-cover rounded cursor-pointer transition-all duration-200 border-2 ${
              mainImage === img ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-300'
            }`}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>
    </section>
  );
};

export default VehicleImageGallery;
