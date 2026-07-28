import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth.js';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await registerUser({ name, email, password, role });
      navigate('/login');
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
          Get started
        </p>
        <h1 className="font-display text-2xl font-semibold text-paper mb-6">
          Create an account
        </h1>

        {error && (
          <p className="bg-status-rejected/10 text-status-rejected text-sm p-2 rounded-md mb-4">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-fog text-sm mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors"
          />
        </div>

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

        <div className="mb-4">
          <label className="block text-fog text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-fog text-sm mb-1">I am a</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors"
          >
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-signal hover:bg-signal-dark text-ink py-2 rounded-md font-medium transition-colors"
        >
          Register
        </button>

        <p className="text-fog text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-signal hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;