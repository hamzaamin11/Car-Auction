import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { navigationStart, navigationSuccess } from "./Redux/NavigationSlice";
import { RotateLoader } from "./Loader/RotateLoader";
const carBrands = [
  {
    name: "Audi Car Listings",
    image: "/images/Audi.png",
    link: "/audi",
    type: "Audi",
  },
  {
    name: "Baic Car Listings",
    image: "/images/baic.png",
    link: "/details",
    type: "Baic",
  },
  {
    name: "BAW Car Listingst",
    image: "/images/BAW.png",
    link: "/details",
    type: "BAW",
  },
  {
    name: "BMW Car Listings",
    image: "/images/BMW.png",
    link: "/details",
    type: "BMW",
  },
  {
    name: "BYD Car Listings",
    image: "/images/BYD.png",
    link: "/details",
    type: "BYD",
  },
  {
    name: "Changan Car Listings",
    image: "/images/changan.png",
    link: "/details",
    type: "Changan",
  },
  {
    name: "Chery Car Listings",
    image: "/images/chery.png",
    link: "/details",
    type: "Chery",
  },
  {
    name: "Daehan Car Listings",
    image: "/images/Daehan.png",
    link: "/details",
    type: "Daehan",
  },
  {
    name: "Deepal Car Listings",
    image: "/images/Deepal.png",
    link: "/details",
    type: "Deepal",
  },
  {
    name: "DFSK PCar Listings",
    image: "/images/DFSK.png",
    link: "/details",
    type: "DFSK",
  },
  {
    name: "Dongfeng Car Listings",
    image: "/images/Dongfeng.png",
    link: "/details",
    type: "Dongfeng",
  },
  {
    name: "GUGO PCar Listingst",
    image: "/images/gugo.png",
    link: "/details",
    type: "GUGO",
  },
  {
    name: "Haval Car Listings",
    image: "/images/haval.png",
    link: "/details",
    type: "Haval",
  },
  {
    name: "Honda Car Listings",
    image: "/images/Honda.png",
    link: "/details",
    type: "Honda",
  },
  {
    name: "Honri Car Listings",
    image: "/images/honri.png",
    link: "/details",
    type: "Honri",
  },
  {
    name: "Hyundai Car Listings",
    image: "/images/hyundai.png",
    link: "/details",
    type: "Hyundai",
  },
  {
    name: "Isuzu Car Listings",
    image: "/images/Isuzu.png",
    link: "/details",
    type: "Isuzu",
  },
  {
    name: "JAC Car Listings",
    image: "/images/jac.png",
    link: "/details",
    type: "JAC",
  },
  {
    name: "Jetour Car Listings",
    image: "/images/jetour.png",
    link: "/details",
    type: "Jetour",
  },
  {
    name: "JMC Car Listings",
    image: "/images/jmc.png",
    link: "/details",
    type: "JMC",
  },
  {
    name: "JW-Forland Car Listings",
    image: "/images/JW-Forland.png",
    link: "//details",
    type: "JW-Forland",
  },
  {
    name: "KIA Car Listings",
    image: "/images/kia.png",
    link: "/details",
    type: "KIA",
  },
  {
    name: "Mercedes Car Listings",
    image: "/images/mercedes.png",
    link: "/details",
    type: "Mercedes",
  },
  {
    name: "MG Car Listings",
    image: "/images/MG.png",
    link: "/details",
    type: "MG",
  },
  {
    name: "Peugeot Car Listings",
    image: "/images/peugeot.png",
    link: "/details",
    type: "Peugeot",
  },
  {
    name: "Porche Car Listings",
    image: "/images/porche.png",
    link: "/details",
    type: "Porche",
  },
  {
    name: "Prince Car Listings",
    image: "/images/prince.png",
    link: "/details",
    type: "Prince",
  },
  {
    name: "Proton Car Listings",
    image: "/images/proton.png",
    link: "/details",
    type: "Proton",
  },
  {
    name: "Seres Car Listings",
    image: "/images/seres.png",
    link: "/details",
    type: "Seres",
  },
  {
    name: "TANK Car Listings",
    image: "/images/tank.png",
    link: "/details",
    type: "Tank",
  },
  {
    name: "TESLA Car Listings",
    image: "/images/Tesla.png",
    link: "/details",
    type: "Tesla",
  },
  {
    name: "TOYOTA Car Listings",
    image: "/images/Tyota.png",
    link: "/details",
    type: "Toyota",
  },
];

const SalesTable = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gradient-to-b from-[#f9f9f9] to-[#ededed] p-6">
      <h2 className="text-[#233D7B] text-3xl font-bold font-sans mb-6 text-center">
        Explore Car Brands in Pakistan
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {carBrands.map((brand, index) => (
          <div
            key={index}
            onClick={() => navigate(`/carPrice/${brand.type}`)}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl 
                       transition-all duration-300 cursor-pointer border border-gray-100 
                       hover:border-[#518ecb] flex flex-col items-center p-5"
          >
            <img
              src={brand.image}
              alt={brand.name}
              className="w-24 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
            />

            <div className="mt-3 w-full text-center">
              <span
                className="inline-block text-[#416eb7] group-hover:text-white 
                           text-sm font-semibold px-3 py-1 rounded-md 
                           transition-all duration-300 
                           group-hover:bg-[#416eb7]"
              >
                {brand.name.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesTable;
