import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../api/tasks.js';

const statusColors = {
  open: 'bg-green-500/20 text-green-400',
  'in-progress': 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-gray-500/20 text-gray-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Browse Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-slate-400">No tasks yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Link
              to={`/tasks/${task._id}`}
              key={task._id}
              className="bg-slate-800 rounded-lg p-5 hover:bg-slate-750 hover:ring-1 hover:ring-blue-500 transition block"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-white font-semibold text-lg">{task.title}</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                    statusColors[task.status] || 'bg-slate-500/20 text-slate-400'
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                {task.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-green-400 font-medium">${task.budget}</span>
                <span className="text-slate-500">{task.category}</span>
              </div>

              <p className="text-slate-500 text-xs mt-3">
                Posted by {task.client?.name || 'Unknown'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;