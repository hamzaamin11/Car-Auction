import { useDispatch, useSelector } from "react-redux";
import RegistrationBanner from "../components/RegistrationBanner";
import RegistrationPage from "../components/RegsitrationPage";
import { useEffect } from "react";
import {
  navigationStart,
  navigationSuccess,
} from "../components/Redux/NavigationSlice";
import { RotateLoader } from "../components/Loader/RotateLoader";

const register = () => {
  return (
    <>
      <RegistrationPage />
    </>
  );
};

export default register;
