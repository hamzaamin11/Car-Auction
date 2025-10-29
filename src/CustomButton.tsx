import React from "react";

interface CustomButtonProps {
  text: string;
  type?: "button" | "submit" | "reset"; // optional, default: submit
  className?: string;
  onClick?: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  type = "submit",
  className = "",
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-blue-950 text-white font-semibold py-3 rounded-lg shadow-md  text-sm ${className}`}
    >
      {text}
    </button>
  );
};

export default CustomButton;
