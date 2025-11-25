import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { navigationStart, navigationSuccess } from "./Redux/NavigationSlice";
import { RotateLoader } from "./Loader/RotateLoader";
const carBrands = [
  {
    name: "Audi  ",
    image: "/images/Audi.png",
    link: "/audi",
    type: "Audi",
  },
  {
    name: "Baic  ",
    image: "/images/baic.png",
    link: "/details",
    type: "Baic",
  },
  {
    name: "BAW  ",
    image: "/images/BAW.png",
    link: "/details",
    type: "BAW",
  },
  {
    name: "BMW ",
    image: "/images/BMW.png",
    link: "/details",
    type: "BMW",
  },
  {
    name: "BYD  ",
    image: "/images/BYD.png",
    link: "/details",
    type: "BYD",
  },
  {
    name: "Changan  ",
    image: "/images/changan.png",
    link: "/details",
    type: "Changan",
  },
  {
    name: "Chery  ",
    image: "/images/chery.png",
    link: "/details",
    type: "Chery",
  },
  {
    name: "Daehan  ",
    image: "/images/Daehan.png",
    link: "/details",
    type: "Daehan",
  },
  {
    name: "Deepal  ",
    image: "/images/Deepal.png",
    link: "/details",
    type: "Deepal",
  },
  {
    name: "DFSK  ",
    image: "/images/DFSK.png",
    link: "/details",
    type: "DFSK",
  },
  {
    name: "Dongfeng ",
    image: "/images/Dongfeng.png",
    link: "/details",
    type: "Dongfeng",
  },
  {
    name: "GUGO  ",
    image: "/images/gugo.png",
    link: "/details",
    type: "GUGO",
  },
  {
    name: "Haval  ",
    image: "/images/haval.png",
    link: "/details",
    type: "Haval",
  },
  {
    name: "Honda  ",
    image: "/images/Honda.png",
    link: "/details",
    type: "Honda",
  },
  {
    name: "Honri  ",
    image: "/images/honri.png",
    link: "/details",
    type: "Honri",
  },
  {
    name: "Hyundai  ",
    image: "/images/hyundai.png",
    link: "/details",
    type: "Hyundai",
  },
  {
    name: "Isuzu ",
    image: "/images/Isuzu.png",
    link: "/details",
    type: "Isuzu",
  },
  {
    name: "JAC ",
    image: "/images/jac.png",
    link: "/details",
    type: "JAC",
  },
  {
    name: "Jetour  ",
    image: "/images/jetour.png",
    link: "/details",
    type: "Jetour",
  },
  {
    name: "JMC  ",
    image: "/images/jmc.png",
    link: "/details",
    type: "JMC",
  },
  {
    name: "JW-Forland  ",
    image: "/images/JW-Forland.png",
    link: "//details",
    type: "JW-Forland",
  },
  {
    name: "KIA ",
    image: "/images/kia.png",
    link: "/details",
    type: "KIA",
  },
  {
    name: "Mercedes  ",
    image: "/images/mercedes.png",
    link: "/details",
    type: "Mercedes",
  },
  {
    name: "MG ",
    image: "/images/MG.png",
    link: "/details",
    type: "MG",
  },
  {
    name: "Peugeot ",
    image: "/images/peugeot.png",
    link: "/details",
    type: "Peugeot",
  },
  {
    name: "Porche  ",
    image: "/images/porche.png",
    link: "/details",
    type: "Porche",
  },
  {
    name: "Prince ",
    image: "/images/prince.png",
    link: "/details",
    type: "Prince",
  },
  {
    name: "Proton ",
    image: "/images/proton.png",
    link: "/details",
    type: "Proton",
  },
  {
    name: "Seres",
    image: "/images/seres.png",
    link: "/details",
    type: "Seres",
  },
  {
    name: "Suzuki ",
    image: "/Public/images/suzuki.png",
    link: "/details",
    type: "Suzuki",
  },
  {
    name: "TANK  ",
    image: "/images/tank.png",
    link: "/details",
    type: "Tank",
  },
  {
    name: "TESLA  ",
    image: "/images/Tesla.png",
    link: "/details",
    type: "Tesla",
  },
  {
    name: "TOYOTA ",
    image: "/images/Tyota.png",
    link: "/details",
    type: "Toyota",
  },
];

const papularBrands = [
  {
    name: "Changan  ",
    image: "/images/changan.png",
    link: "/details",
    type: "Changan",
  },
  {
    name: "Honda  ",
    image: "/images/Honda.png",
    link: "/details",
    type: "Honda",
  },
  {
    name: "Hyundai  ",
    image: "/images/hyundai.png",
    link: "/details",
    type: "Hyundai",
  },
  {
    name: "KIA ",
    image: "/images/kia.png",
    link: "/details",
    type: "KIA",
  },
  {
    name: "MG ",
    image: "/images/MG.png",
    link: "/details",
    type: "MG",
  },
  {
    name: "Suzuki ",
    image: "/Public/images/suzuki.png",
    link: "/details",
    type: "Suzuki",
  },
  {
    name: "TOYOTA ",
    image: "/images/Tyota.png",
    link: "/details",
    type: "Toyota",
  },
  {
    name: "Proton ",
    image: "/images/proton.png",
    link: "/details",
    type: "Proton",
  },
];

const SalesTable = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gradient-to-b from-[#f9f9f9] to-[#ededed] p-6">
      <h2 className="text-black text-3xl font-bold font-sans mb-6 text-center">
        Explore Car Makes in Pakistan
      </h2>
      <div className="bg-gray-200/50 p-4">
        <h1 className="text-xl p-2 font-bold text-blue-950">
          Search by Popular Makes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {papularBrands?.map((brand, index) => (
            <div
              key={index}
              onClick={() => navigate(`/carPrice/${brand.type}`)}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl 
                       transition-all duration-300 cursor-pointer border border-gray-100 
                       hover:border-blue-950 flex flex-col items-center p-5"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-24 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
              />

              <div className="mt-3 w-full text-center">
                <span
                  className="inline-block text-black font-bold group-hover:text-white 
                           text-sm  px-3 py-1 rounded-md 
                           transition-all duration-300 
                           group-hover:bg-blue-950"
                >
                  {brand.name.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-200/50 p-4 my-5">
        <h1 className="text-xl p-2 font-bold text-blue-950">All other Makes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {carBrands?.map((brand, index) => (
            <div
              key={index}
              onClick={() => navigate(`/carPrice/${brand.type}`)}
              className=" bg-white rounded shadow-md hover:shadow-xl 
                       transition-all duration-300 cursor-pointer border border-gray-100 
                       hover:border-blue-950 flex items-center justify-center px-10"
            >
              <img
                src={brand.image}
                alt={brand.name}
                className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
              />

              <div className="py-2 w-full text-center">
                <span
                  className="inline-block text-blue-950 font-bold group-hover:text-white 
                           text-sm  px-3 py-1 rounded-md 
                           transition-all duration-300 
                           group-hover:bg-blue-950"
                >
                  {brand.name.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesTable;
