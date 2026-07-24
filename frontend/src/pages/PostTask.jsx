import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../api/tasks.js';
import { useAuth } from '../context/useAuth.js';

function PostTask() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await createTask({
        title,
        description,
        budget: Number(budget),
        deadline,
        category,
      });
      navigate(`/tasks/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Log in as a client to post a task.</p>
      </div>
    );
  }

  if (user.role !== 'client') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Only clients can post tasks.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-white mb-6">Post a Task</h1>

        {error && (
          <p className="bg-red-500/10 text-red-400 text-sm p-2 rounded mb-4">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-slate-300 text-sm mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-slate-300 text-sm mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-slate-300 text-sm mb-1">Budget ($)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              min="1"
              className="w-full p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 text-sm mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            placeholder="e.g. web-development"
            className="w-full p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium transition"
        >
          Post Task
        </button>
      </form>
    </div>
  );
}

export default PostTask;