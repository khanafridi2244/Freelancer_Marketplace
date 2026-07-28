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
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <p className="text-fog">Log in as a client to post a task.</p>
      </div>
    );
  }

  if (user.role !== 'client') {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <p className="text-fog">Only clients can post tasks.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-slate border border-border rounded-md p-8 w-full max-w-lg"
      >
        <p className="font-mono text-xs text-signal uppercase tracking-widest mb-1">
          New contract
        </p>
        <h1 className="font-display text-2xl font-semibold text-paper mb-6">
          Post a Task
        </h1>

        {error && (
          <p className="bg-status-rejected/10 text-status-rejected text-sm p-2 rounded-md mb-4">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-fog text-sm mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors"
          />
        </div>

        <div className="mb-4">
          <label className="block text-fog text-sm mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-fog text-sm mb-1">Budget ($)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              min="1"
              className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-fog text-sm mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors font-mono"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-fog text-sm mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            placeholder="e.g. web-development"
            className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-signal hover:bg-signal-dark text-ink py-2 rounded-md font-medium transition-colors"
        >
          Post Task
        </button>
      </form>
    </div>
  );
}

export default PostTask;