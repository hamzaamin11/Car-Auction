import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import bannerImage from "../../src/assets/c4.jpg";
const MakeBanner = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-[350px] md:h-[450px] flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
          Search By Make
        </h1>
        <Link
          to="/AllVehicles"
          className="text-white mt-4 text-sm md:text-lg max-w-2xl mx-auto block text-center hover:text-[#FFDAB9] transition-colors duration-300"
        >
          Search Vehicles By Make <FaAngleRight className="inline-block ml-1" />
        </Link>
      </div>
    </section>
  );
};

export default MakeBanner;
