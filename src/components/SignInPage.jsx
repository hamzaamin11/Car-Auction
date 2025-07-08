import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignInPage = () => {
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Using login from AuthContext
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!role) {
      alert('Please select a role');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.user) {
        throw new Error('User data not received');
      }

      // Structure user data for AuthContext
      const userData = {
        id: data.user.id || data.user._id, // Supports both SQL and MongoDB
        email: data.user.email,
        role: data.user.role || role,
        name: data.user.name || formData.email.split('@')[0], // Fallback to email prefix
        token: data.token // Optional: if using JWT
      };

      // Save to localStorage and AuthContext
      localStorage.setItem('user', JSON.stringify(userData));
      login(userData); // Updates global auth state

      if (role === 'seller') {
  localStorage.setItem("isSeller", "true");
} else {
  localStorage.removeItem("isSeller");
}
login(userData)
      // Redirect based on role
      const redirectPath = role === 'admin' ? '/admin' : '/seller';
      navigate(redirectPath);

    } catch (err) {
      console.error('Login error:', err);
      alert(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/signin.jpg')" }}
    >
      <div className="backdrop-blur-sm rounded-xl shadow-xl max-w-md w-full p-8 mx-4">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-white">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full p-3 rounded-lg border bg-black border-white text-white"
            >
              <option value="">Choose role</option>
              <option value="seller">Seller</option>
              <option value="customer">Customer</option>
              {/* <option value="admin">Admin</option> */}
            </select>
          </div>

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
            <label className="block mb-2 font-semibold text-white">Password</label>
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
              loading ? 'bg-gray-500' : 'bg-[#518ecb] hover:bg-[#b73439]'
            } text-white font-bold py-3 rounded-lg shadow-lg transition`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-white">
          Don't have an account?{' '}
          <Link to="/register" className="text-yellow-400 underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;