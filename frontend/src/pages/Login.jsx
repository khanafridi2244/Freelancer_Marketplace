import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/auth.js';
import { useAuth } from '../context/useAuth.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginUser({ email, password });
      login(response.data, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate border border-border rounded-md p-8 w-full max-w-md"
      >
        <p className="font-mono text-xs text-signal uppercase tracking-widest mb-1">
          Welcome back
        </p>
        <h1 className="font-display text-2xl font-semibold text-paper mb-6">
          Log in to your account
        </h1>

        {error && (
          <p className="bg-status-rejected/10 text-status-rejected text-sm p-2 rounded-md mb-4">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-fog text-sm mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-fog text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-signal hover:bg-signal-dark text-ink py-2 rounded-md font-medium transition-colors"
        >
          Login
        </button>

        <p className="text-fog text-sm text-center mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-signal hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;