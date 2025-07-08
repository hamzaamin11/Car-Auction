
import React from "react";

const vehicleMakes = [
  {
    name: "Abarth",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/abarth.jpg",
    link: "/vehicle-search-make/abarth/?intcmp=web_Pakistan_landingpage_popularmakes_abarth",
  },
  {
    name: "Alfa Romeo",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/alfa.jpg",
    link: "/vehicle-search-make/alfaromeo/?intcmp=web_Pakistan_landingpage_popularmakes_alfaromeo",
  },
  {
    name: "Audi",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/audi.jpg",
    link: "/vehicle-search-make/audi?intcmp=web_Pakistan_landingpage_popularmakes_audi",
  },
  {
    name: "BMW",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/bmw.jpg",
    link: "/vehicle-search-make/bmw?intcmp=web_Pakistan_landingpage_popularmakes_bmw",
  },
  {
    name: "CUPRA",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/cupra.jpg",
    link: "/lotSearchResults/?free=true&query=cupra?intcmp=web_Pakistan_landingpage_popularmakes_cupra",
  },
  {
    name: "Citroen",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/citroen.jpg",
    link: "/vehicle-search-make/citroen?intcmp=web_Pakistan_landingpage_popularmakes_citreon",
  },
  {
    name: "Volvo",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/volvo.jpg",
    link: "/vehicle-search-make/volvo?intcmp=web_Pakistan_landingpage_popularmakes_volvo",
  },
  {
    name: "DS AUTOMOBILES",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/ds.jpg",
    link: "/vehicle-search-make/ds?intcmp=web_Pakistan_landingpage_popularmakes_ds",
  },
  {
    name: "Dacia",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/dacia.jpg",
    link: "/vehicle-search-make/dacia?intcmp=web_Pakistan_landingpage_popularmakes_dacia",
  },
  {
    name: "Fiat",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/fiat.jpg",
    link: "/vehicle-search-make/fiat?intcmp=web_Pakistan_landingpage_popularmakes_fiat",
  },
  {
    name: "Ford",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/ford.jpg",
    link: "/vehicle-search-make/ford?intcmp=web_Pakistan_landingpage_popularmakes_ford",
  },
  {
    name: "Honda",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/honda.jpg",
    link: "/vehicle-search-make/honda?intcmp=web_Pakistan_landingpage_popularmakes_honda",
  },
  {
    name: "Hyundai",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/hyundai.jpg",
    link: "/vehicle-search-make/hyundai?intcmp=web_Pakistan_landingpage_popularmakes_hyundai",
  },
  {
    name: "Isuzu",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/isuzu.jpg",
    link: "/vehicle-search-make/isuzu?intcmp=web_Pakistan_landingpage_popularmakes_isuzu",
  },
  {
    name: "Jaguar",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/jag.jpg",
    link: "/vehicle-search-make/jag?intcmp=web_Pakistan_landingpage_popularmakes_jag",
  },
  {
    name: "Jeep",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/jeep.jpg",
    link: "/vehicle-search-make/jeep?intcmp=web_Pakistan_landingpage_popularmakes_jeep",
  },
  {
    name: "Kia",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/kia.jpg",
    link: "/vehicle-search-make/kia?intcmp=web_Pakistan_landingpage_popularmakes_kia",
  },
  {
    name: "Lamborghini",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/lambo.jpg",
    link: "/vehicle-search-make/lambo?intcmp=web_Pakistan_landingpage_popularmakes_lambo",
  },
  {
    name: "MINI",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/mini.jpg",
    link: "/vehicle-search-make/mini?intcmp=web_Pakistan_landingpage_popularmakes_mini",
  },
  {
    name: "LandRover",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/landrover.jpg",
    link: "/vehicle-search-make/landrover?intcmp=web_Pakistan_landingpage_popularmakes_landrover",
  },
  {
    name: "Lexus",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/lexus.jpg",
    link: "/vehicle-search-make/lexus?intcmp=web_Pakistan_landingpage_popularmakes_lexus",
  },
  {
    name: "MG",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/mg.jpg",
    link: "/vehicle-search-make/mg?intcmp=web_Pakistan_landingpage_popularmakes_mg",
  },
  {
    name: "Maserati",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/maserati.jpg",
    link: "/vehicle-search-make/maserati?intcmp=web_Pakistan_landingpage_popularmakes_maserati",
  },
  {
    name: "Mazda",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/mazda.jpg",
    link: "/vehicle-search-make/mazda?intcmp=web_Pakistan_landingpage_popularmakes_mazda",
  },
  {
    name: "Ssangyong",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/ssangyong.jpg",
    link: "/vehicle-search-make/ssangyong?intcmp=web_Pakistan_landingpage_popularmakes_ssangyong"
  },
  {
    name: "SuzPakistani",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/suzPakistani.jpg",
    link: "/vehicle-search-make/suzPakistani?intcmp=web_Pakistan_landingpage_popularmakes_suzPakistani",
  },

  {
    name: "Toyota",
    image: "https://www.copart.co.Pakistan/content/Pakistan/en/images/popular-vehicles/toyota.jpg",
    link: "/vehicle-search-make/toyota?intcmp=web_Pakistan_landingpage_popularmakes_toyota",
  },
  

];

const VehicleMakesGrid = () => {
  return (
    <div className="w-full bg-[#ededed] p-6 mt-5">
      <h2 className="text-[20px] font-bold font-sans text-[#416eb7] ml-3">All other makes</h2>
      <div className="flex flex-wrap justify-start mt-4">
        {vehicleMakes.map((make, index) => (
          <div
            key={index}
            className="w-full sm:w-[48%] md:w-[30%] lg:w-[21%] m-2 p-6 bg-white rounded shadow-sm"
          >
            <div className="flex items-center">
              <div className="w-1/5">
                <a href={make.link}>
                  <img src={make.image} alt={make.name} className="w-full" />
                </a>
              </div>
              <div className="w-4/5 pl-3">
                <p className="text-blue-700 text-sm font-bold font-sans">
                  <a href={make.link}>{make.name}</a>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleMakesGrid;
