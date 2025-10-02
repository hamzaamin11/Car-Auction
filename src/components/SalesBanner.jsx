import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import bannerImage from "../../src/assets/copart2.jpg";
const SalesBanner = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat lg:h-[350px] h-[150px] md:h-[450px] flex items-center justify-center text-start"
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
          All Car Companies
        </h1>
      </div>
    </section>
  );
};

export default SalesBanner;
