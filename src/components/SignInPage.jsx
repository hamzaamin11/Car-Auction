import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "./Contant/URL";
import { useDispatch, useSelector } from "react-redux";
import { authSuccess } from "./Redux/UserSlice";
import axios from "axios";
import { RotateLoader } from "./Loader/RotateLoader";
import { toast, ToastContainer } from "react-toastify";
import { navigationStart, navigationSuccess } from "./Redux/NavigationSlice";
import LoginImage from "../../src/assets/c5.jpg";

const SignInPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);

  const [navLoader, setNavLoader] = useState(false);

  const { login } = useAuth(); // Using login from AuthContext

  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state?.auth);

  const { loader } = useSelector((state) => state?.navigateState);

  useEffect(() => {
    dispatch(navigationStart());
    setTimeout(() => {
      dispatch(navigationSuccess("login"));
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const res = await fetch("http://localhost:3001/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ ...formData }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       throw new Error(data.message || "Login failed");
  //     }

  //     if (!data.user) {
  //       throw new Error("User data not received");
  //     }

  //     // Extract role first from the response
  //     const userRole = data.user.role || "user";

  //     // Structure user data
  //     const userData = {
  //       id: data.user.id || data.user._id,
  //       email: data.user.email,
  //       role: userRole,
  //       name: data.user.name || formData.email.split("@")[0],
  //       token: data.token,
  //     };

  //     // Save to localStorage and AuthContext
  //     localStorage.setItem("user", JSON.stringify(userData));
  //     login(userData); // Only call once

  //     // Handle seller flag
  //     if (userRole === "seller") {
  //       localStorage.setItem("isSeller", "true");
  //     } else {
  //       localStorage.removeItem("isSeller");
  //     }

  //     // Redirect based on role
  //     const redirectPath = userRole === "admin" ? "/admin" : "/seller";
  //     navigate(redirectPath);
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     alert(err.message || "Login failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/login`, formData);
      dispatch(authSuccess(res.data));
      setLoading(false);
    } catch (error) {
      console.log(error?.response?.data?.message);
      setLoading(false);
      toast.error(error?.response?.data?.message);
    }
    setFormData({ email: "", password: "" });
  };

  if (currentUser?.role === "seller") return <Navigate to={"/seller"} />;
  if (currentUser?.role === "admin") return <Navigate to={"/admin"} />;
  if (currentUser?.role === "customer") return <Navigate to={"/"} />;

  if (loader) {
    return <RotateLoader />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${LoginImage})` }}
    >
      <div className=" bg-black/20 rounded-xl shadow-xl max-w-md w-full p-8 mx-4">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full p-3 rounded-lg border border-gray-300 bg-black text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-white">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Your password"
              className="w-full p-3 rounded-lg border border-gray-300 bg-black text-white placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-500" : "bg-[#518ecb] hover:bg-[#b73439]"
            } text-white font-bold py-3 rounded-lg shadow-lg transition`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-white">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-yellow-400 underline font-semibold"
          >
            Register here
          </Link>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default SignInPage;
