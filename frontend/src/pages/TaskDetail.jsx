import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTaskById } from '../api/tasks.js';

const statusColors = {
  open: 'bg-green-500/20 text-green-400',
  'in-progress': 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-gray-500/20 text-gray-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await getTaskById(id);
        setTask(response.data);
      } catch (err) {
        console.error('Failed to fetch task:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading task...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Task not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <div className="max-w-2xl mx-auto bg-slate-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">{task.title}</h1>
          <span
            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
              statusColors[task.status] || 'bg-slate-500/20 text-slate-400'
            }`}
          >
            {task.status}
          </span>
        </div>

        <p className="text-slate-300 mb-6">{task.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <p className="text-slate-500">Budget</p>
            <p className="text-green-400 font-medium">${task.budget}</p>
          </div>
          <div>
            <p className="text-slate-500">Category</p>
            <p className="text-slate-200">{task.category}</p>
          </div>
          <div>
            <p className="text-slate-500">Deadline</p>
            <p className="text-slate-200">
              {new Date(task.deadline).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-slate-500">Posted by</p>
            <p className="text-slate-200">{task.client?.name || 'Unknown'}</p>
          </div>
        </div>

        <hr className="border-slate-700 mb-6" />

        {/* Bids section coming next */}
      </div>
    </div>
  );
}

export default TaskDetail;