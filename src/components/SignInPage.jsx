import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "./Contant/URL";
import { useDispatch, useSelector } from "react-redux";
import { authSuccess } from "./Redux/UserSlice";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import LoginImage from "../../src/assets/copart1.jpg";
import { FaEnvelope, FaGoogle, FaPhoneAlt } from "react-icons/fa";
import googleIcon from "../../src/assets/google.png";
import PhoneModal from "./PhoneModal";
import { EmailLoginModal } from "./EmailLoginModal";
import { EmailSignUpModal } from "./EmailSignUpModal";
import CustomButton from "../CustomButton";
const SignInPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isOPen, setIsOpen] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.auth);
  const { login } = useAuth(); // AuthContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleModal = (active) => {
    setIsOpen((prev) => (prev === active ? "" : active));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/login`, formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch(authSuccess(res.data));
      login(res.data);
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      setFormData({ email: "", password: "" });
    }
  };

  const handleAuthGoogle = () => {
    window.location.href = `${BASE_URL}/google`;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      const userData = { token };
      localStorage.setItem("user", JSON.stringify(userData));
      dispatch(authSuccess(userData));
      login(userData);
      navigate("/");
    }
  }, [dispatch, login, navigate]);

  if (currentUser?.role === "seller")
    return <Navigate to={"/seller/dashboard"} />;
  if (currentUser?.role === "admin") return <Navigate to={"/admin"} />;
  if (currentUser?.role === "customer") return <Navigate to={"/"} />;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${LoginImage})` }}
    >
      {/* Form Box */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sign In
        </h2>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block mb-1 font-semibold text-gray-800">
              Email / Phone Number
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter Email or Phone Number"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-800">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter Password"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <CustomButton text="Sign In" />
        </form>

        {/* Divider */}
        <p className="text-gray-800 text-center my-2">or</p>

        {/* Auth Options */}
        <div className="space-y-2">
          {/* Google */}
          <button
            onClick={handleAuthGoogle}
            className="w-full flex items-center gap-3 py-3 rounded-lg shadow-md transition border border-gray-500 text-gray-800 font-semibold hover:scale-105 duration-500 hover:cursor-pointer"
          >
            {/* Google Icon */}
            <img
              src={googleIcon}
              alt="google"
              className="h-7 w-7 object-cover pl-3"
            />

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-gray-400"></div>

            {/* Text */}
            <span className="flex-1 text-center">Continue with Google</span>
          </button>

          {/* Register with Email */}
          <button
            onClick={() => handleToggleModal("email")}
            className="w-full flex items-center gap-3 py-3 rounded-lg shadow-md transition border border-gray-500 text-gray-800 font-semibold  hover:scale-105 duration-500 hover:cursor-pointer"
          >
            {/* Email Icon */}
            <FaEnvelope className="text-lg ml-3" />

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-gray-400"></div>

            {/* Text */}
            <span className="flex-1 text-center">Register with Email</span>
          </button>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-gray-700">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-950 hover:underline font-medium "
          >
            Register here
          </Link>
        </p>
      </div>

      {isOPen === "email" && (
        <EmailSignUpModal handleModal={() => handleToggleModal("")} />
      )}

      <ToastContainer />
    </div>
  );
};

export default SignInPage;
