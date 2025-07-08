import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock } from 'react-icons/fa';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin', email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        localStorage.setItem('adminName', data.user.name);
        localStorage.setItem('adminId', data.user.id);
        localStorage.setItem('adminRole', data.user.role);
        localStorage.setItem('isAdmin', 'true'); // ✅ Required for auth
        navigate('/admin');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
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
          {error && <p className="text-red-300 text-center">{error}</p>}

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
          &copy; {new Date().getFullYear()} Chaudhry Cars Auction Admin Panel
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
