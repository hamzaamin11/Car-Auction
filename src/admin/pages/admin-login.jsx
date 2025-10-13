import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { authSuccess, authFailure } from "../../components/Redux/UserSlice";
import { BASE_URL } from "../../components/Contant/URL";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("Login response:", data); // Debug log

      if (response.ok && data.id) {
        // ✅ Backend returns flat object, not nested in 'user'
        const userData = {
          id: data.id,
          email: data.email,
          role: data.role,
          name: data.name,
          contact: data.contact,
          cnic: data.cnic,
          address: data.address,
          postcode: data.postcode,
          image: data.image, // ✅ Store Cloudinary URL
          imageUrl: data.imageUrl, // ✅ Also store imageUrl
          token: data.token,
          date: data.date,
          username: data.username,
          gender: data.gender,
          country: data.country,
          dateOfBirth: data.dateOfBirth,
          city: data.city,
        };

        console.log("Storing user data:", userData); // Debug log

        // ✅ Store in Redux
        dispatch(authSuccess(userData));

        // ✅ Also store in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", data.role === "admin" ? "true" : "false");

        // Navigate based on role
        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        const errorMsg = data.message || "Login failed";
        setError(errorMsg);
        dispatch(authFailure(errorMsg));
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = "Something went wrong. Please try again.";
      setError(errorMsg);
      dispatch(authFailure(errorMsg));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/admin.jpg')" }}
    >
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <FaUserShield className="text-white text-5xl mx-auto mb-3" />
          <h2 className="text-3xl font-extrabold text-white">Admin Login</h2>
          <p className="text-white text-sm opacity-80">
            Secure access for administrators only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded p-3">
              <p className="text-red-100 text-center text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-white mb-1">Email Address</label>
            <div className="flex items-center border border-white/30 bg-white/10 rounded px-3 py-2">
              <FaUserShield className="text-white/70 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent outline-none text-white placeholder-white/60"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-white mb-1">Password</label>
            <div className="flex items-center border border-white/30 bg-white/10 rounded px-3 py-2">
              <FaLock className="text-white/70 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent outline-none text-white placeholder-white/60"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Login Now
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/80">
          &copy; {new Date().getFullYear()} WheelBidz Admin Panel
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;