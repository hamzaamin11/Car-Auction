import { FaAngleRight } from "react-icons/fa";

import bannerImage from "../../src/assets/c5.jpg";

const FinderBanner = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-[350px] md:h-[450px] flex items-center justify-center text-center"
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white animate-fade-in">
          Vehicle Finders
        </h1>
        <span className="text-white mt-4 text-sm md:text-lg max-w-2xl mx-auto block text-center hover:text-[#FFDAB9] transition-colors duration-300">
          View All Vehicles <FaAngleRight className="inline-block ml-1" />
        </span>
      </div>
    </section>
  );
};

export default FinderBanner;
