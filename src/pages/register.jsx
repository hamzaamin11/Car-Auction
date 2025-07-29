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
  const { loader } = useSelector((state) => state?.navigateState);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("register"));
    }, 1000);
  }, []);

  if (loader) return <RotateLoader />;

  return (
    <>
      <RegistrationBanner />
      <RegistrationPage />
    </>
  );
};

export default register;
