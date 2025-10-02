import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import bannerImage from "../../src/assets/c4.jpg";
const MakeBanner = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat lg:h-[350px] h-[150px]  md:h-[450px] flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
          Search By Makess
        </h1>
      </div>
    </section>
  );
};

export default MakeBanner;
