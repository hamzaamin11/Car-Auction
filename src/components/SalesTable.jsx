import { useNavigate } from "react-router-dom";
const carBrands = [
  {
    name: "Audi Pricelist",
    image: "/images/Audi.png",
    link: "/audi",
    type: "Audi",
  },
  {
    name: "Baic Pricelist",
    image: "/images/baic.png",
    link: "/details",
    type: "Baic",
  },
  {
    name: "BAW Pricelist",
    image: "/images/BAW.png",
    link: "/details",
    type: "BAW",
  },
  {
    name: "BMW Pricelist",
    image: "/images/BMW.png",
    link: "/details",
    type: "BMW",
  },
  {
    name: "BYD Pricelist",
    image: "/images/BYD.png",
    link: "/details",
    type: "BYD",
  },
  {
    name: "Changan Pricelist",
    image: "/images/changan.png",
    link: "/details",
    type: "Changan",
  },
  {
    name: "Chery Pricelist",
    image: "/images/chery.png",
    link: "/details",
    type: "Chery",
  },
  {
    name: "Daehan Pricelist",
    image: "/images/Daehan.png",
    link: "/details",
    type: "Daehan",
  },
  {
    name: "Deepal Pricelist",
    image: "/images/Deepal.png",
    link: "/details",
    type: "Deepal",
  },
  {
    name: "DFSK Pricelist",
    image: "/images/DFSK.png",
    link: "/details",
    type: "DFSK",
  },
  {
    name: "Dongfeng Pricelist",
    image: "/images/Dongfeng.png",
    link: "/details",
    type: "Dongfeng",
  },
  {
    name: "GUGO Pricelist",
    image: "/images/gugo.png",
    link: "/details",
    type: "GUGO",
  },
  {
    name: "Haval Pricelist",
    image: "/images/haval.png",
    link: "/details",
    type: "Haval",
  },
  {
    name: "Honda Pricelist",
    image: "/images/Honda.png",
    link: "/details",
    type: "Honda",
  },
  {
    name: "Honri Pricelist",
    image: "/images/honri.png",
    link: "/details",
    type: "Honri",
  },
  {
    name: "Hyundai Pricelist",
    image: "/images/hyundai.png",
    link: "/details",
    type: "Hyundai",
  },
  {
    name: "Isuzu Pricelist",
    image: "/images/Isuzu.png",
    link: "/details",
    type: "Isuzu",
  },
  {
    name: "JAC Pricelist",
    image: "/images/jac.png",
    link: "/details",
    type: "JAC",
  },
  {
    name: "Jetour Pricelist",
    image: "/images/jetour.png",
    link: "/details",
    type: "Jetour",
  },
  {
    name: "JMC Pricelist",
    image: "/images/jmc.png",
    link: "/details",
    type: "JMC",
  },
  {
    name: "JW-Forland Pricelist",
    image: "/images/JW-Forland.png",
    link: "//details",
    type: "JW-Forland",
  },
  {
    name: "KIA Pricelist",
    image: "/images/kia.png",
    link: "/details",
    type: "KIA",
  },
  {
    name: "Mercedes Pricelist",
    image: "/images/mercedes.png",
    link: "/details",
    type: "Mercedes",
  },
  {
    name: "MG Pricelist",
    image: "/images/MG.png",
    link: "/details",
    type: "MG",
  },
  {
    name: "Peugeot Pricelist",
    image: "/images/peugeot.png",
    link: "/details",
    type: "Peugeot",
  },
  {
    name: "Porche Pricelist",
    image: "/images/porche.png",
    link: "/details",
    type: "Porche",
  },
  {
    name: "Prince Pricelist",
    image: "/images/prince.png",
    link: "/details",
    type: "Prince",
  },
  {
    name: "Proton Pricelist",
    image: "/images/proton.png",
    link: "/details",
    type: "Proton",
  },
  {
    name: "Seres Pricelist",
    image: "/images/seres.png",
    link: "/details",
    type: "Seres",
  },
  {
    name: "Tank Pricelist",
    image: "/images/tank.png",
    link: "/details",
    type: "Tank",
  },
  {
    name: "Tesla Pricelist",
    image: "/images/Tesla.png",
    link: "/details",
    type: "Tesla",
  },
  {
    name: "TOYOTA Pricelist",
    image: "/images/Tyota.png",
    link: "/details",
    type: "Toyota",
  },
];

const SalesTable = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#ededed] p-5">
      <h2 className="text-[#416eb7] text-2xl font-bold font-sans ml-3">
        New Car Prices in Pakistan
      </h2>
      <div className="flex flex-wrap -mx-2 mt-4">
        {carBrands.map((brand, index) => (
          <div
            onClick={() => navigate(`/carPrice/${brand.type}`)}
            key={index}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
          >
            <div className="bg-white rounded-sm p-3 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center">
              <img
                src={brand.image}
                alt={brand.name}
                className="w-28 h-20 object-contain mx-auto"
              />

              <div className="border-t border-[#ededed] mt-3 pt-2 w-full text-center">
                <span className="text-[#518ecb] hover:text-[#233D7B] text-sm font-semibold font-sans">
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

export default SalesTable;
