import { Link } from "react-router-dom";

const Card = ({ icon, title, totalData, path }) => {
  return (
    <Link
      to={path}
      className="
        group relative
        flex flex-col items-center justify-center
        rounded-2xl shadow-lg
        bg-blue-50 border 
      border-[#191970] hover:shadow-xl
        transition-all duration-500 ease-in-out
        w-full h-48 sm:h-52 md:h-56
        b
      "
    >
      {/* Decorative Background Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#191970]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Icon */}
      <div className="bg-white p-4 rounded-full text-[#191970] flex items-center justify-center text-3xl sm:text-4xl mb-3">
        {icon}
      </div>

      {/* Text */}
      <div className="text-center z-10">
        <h3 className="text-sm sm:text-base font-extrabold text-blue-900">
          {title}
        </h3>
        <p className="text-2xl sm:text-3xl font-bold text-[#191970] mt-1">
          {totalData}
        </p>
      </div>
    </Link>
  );
};

export default Card;
