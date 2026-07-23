import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-white text-xl font-bold">
        Freelance Marketplace
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-slate-300 text-sm">
              Hi, {user.name} ({user.role})
            </span>
            <Link to="/dashboard" className="text-slate-300 hover:text-white text-sm">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-300 hover:text-white text-sm">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;