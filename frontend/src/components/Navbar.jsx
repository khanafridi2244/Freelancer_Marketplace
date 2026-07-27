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
    <nav className="bg-slate border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <Link to="/" className="font-display text-xl font-semibold text-paper tracking-tight">
        Freelance<span className="text-signal">Marketplace</span>
      </Link>

      <div className="flex items-center gap-5">
        {user ? (
          <>
            {user.role === 'client' && (
              <Link
                to="/post-task"
                className="text-fog hover:text-paper text-sm transition-colors"
              >
                Post Task
              </Link>
            )}
            <Link
              to={`/profile/${user.id}`}
              className="text-fog hover:text-paper text-sm transition-colors"
            >
              {user.name} <span className="text-signal">· {user.role}</span>
            </Link>
            <Link
              to="/dashboard"
              className="text-fog hover:text-paper text-sm transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="border border-border text-fog hover:text-paper hover:border-signal text-sm px-3 py-1.5 rounded-md transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-fog hover:text-paper text-sm transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-signal hover:bg-signal-dark text-ink text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
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