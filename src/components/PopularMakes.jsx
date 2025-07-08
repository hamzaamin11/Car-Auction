import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const carBrands = [
  {
    name: "Audi",
    image:
      "https://www.copart.co.uk/content/uk/en/images/popular-vehicles/audi.jpg",
    link: "/details",
  },
  {
    name: "BMW",
    image:
      "https://www.copart.co.uk/content/uk/en/images/popular-vehicles/bmw.jpg",
    link: "/details",
  },
  {
    name: "Mercedes-Benz",
    image:
      "https://www.copart.co.uk/content/uk/en/images/popular-vehicles/merc.jpg",
    link: "/details",
  },
  {
    name: "Ford",
    image:
      "https://www.copart.co.uk/content/uk/en/images/popular-vehicles/ford.jpg",
    link: "/details",
  },
  {
    name: "Nissan",
    image:
      "https://www.copart.co.uk/content/uk/en/images/popular-vehicles/nissan.jpg",
    link: "/details",
  },
  {
    name: "Toyota",
    image:
      "https://www.copart.co.uk/content/uk/en/images/popular-vehicles/toyota.jpg",
    link: "/details",
  },
  {
    name: "Vauxhall",
    image:
      "https://www.copart.co.uk/content/uk/en/images/popular-vehicles/vauxhall.jpg",
    link: "/details",
  },
  {
    name: "Volkswagen",
    image:
      "https://www.copart.co.uk/content/uk/en/images/popular-vehicles/vw.jpg",
    link: "/details",
  },
];

const PopularMakes = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#ededed] p-5">
      <h2 className="text-[#416eb7] text-2xl font-bold font-sans ml-3">
        Search by Popular Makes
      </h2>

      <div className="flex flex-wrap -mx-2 mt-4">
        {carBrands.map((brand, index) => (
          <div
            onClick={() => navigate(`/details/${brand?.name}`)}
            key={index}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
          >
            <div className="bg-white rounded-sm p-3 shadow-sm hover:shadow-md transition-shadow duration-300">
              <img src={brand.image} alt={brand.name} className="w-full" />

              <div className="border-t border-[#ededed] mt-3 pt-2">
                <span className="text-gray-600 text-lg font-bold font-sans">
                  {brand.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularMakes;
