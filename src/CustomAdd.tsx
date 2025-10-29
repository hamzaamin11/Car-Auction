import React from "react";

interface CustomButtonProps {
  text: string; // Button label (Add, Edit, Delete, View)
  onClick: () => void; // Click handler
  variant?: "add" | "edit" | "delete" | "view"; // Button type
  className?: string; // Optional extra styling
}

const CustomAdd: React.FC<CustomButtonProps> = ({
  text,
  onClick,
  variant = "add",
  className = "",
}) => {
  // Base styling for all buttons
  const baseClasses =
    "rounded-md shadow transition duration-200 hover:cursor-pointer font-bold";

  // Styles depending on variant type
  const variantClasses =
    variant === "add"
      ? "bg-blue-950 text-white w-full lg:w-36 py-2 px-6 "
      : variant === "edit"
      ? "border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white px-3 py-2 sm:py-1 text-xs sm:text-sm w-full sm:w-auto"
      : variant === "delete"
      ? "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-3 py-2 sm:py-1 text-xs sm:text-sm w-full sm:w-auto"
      : "border border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white px-3 py-2 sm:py-1 text-xs sm:text-sm w-full sm:w-auto"; // view

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`}>
      {text}
    </button>
  );
};

export default CustomAdd;
