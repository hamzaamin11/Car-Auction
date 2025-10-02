import { Link } from "react-router-dom";

const Card = ({ icon, title, totalData, path }) => {
  return (
    <Link
      to={path}
      className="
        rounded-xl p-4 sm:p-5 
        shadow-md border border-[#191970] 
        bg-gray-100 text-white 
        flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 
        hover:scale-105 transition-transform duration-500 active:scale-105
      "
    >
      {/* Icon */}
      <div className="bg-white p-2 sm:p-3 rounded-full text-[#191970] flex items-center justify-center text-lg sm:text-xl md:text-2xl">
        {icon}
      </div>

      {/* Text */}
      <div className="text-center sm:text-left">
        <h3 className="text-xs sm:text-sm md:text-base font-medium text-[#191970]">
          {title}
        </h3>
        <p className="text-base sm:text-xl md:text-2xl font-semibold mt-1 text-[#191970]">
          {totalData}
        </p>
      </div>
    </Link>
  );
};

export default Card;
