import React from "react";
import { SpinnerLoader } from "./SpinnerLoader";

export const RotateLoader = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-white ">
      <SpinnerLoader />
      
    </div>
  );
};
