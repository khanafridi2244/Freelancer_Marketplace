import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../api/tasks.js';

const statusStripe = {
  open: 'border-l-status-open',
  'in-progress': 'border-l-status-progress',
  completed: 'border-l-status-completed',
  cancelled: 'border-l-status-rejected',
};

const statusText = {
  open: 'text-status-open',
  'in-progress': 'text-status-progress',
  completed: 'text-status-completed',
  cancelled: 'text-status-rejected',
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-fog font-mono text-sm">Loading tasks…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs text-signal uppercase tracking-widest mb-1">
          Open contracts
        </p>
        <h1 className="font-display text-3xl font-semibold text-paper">
          Browse Tasks
        </h1>
      </div>

      {tasks.length === 0 ? (
        <p className="text-fog">No tasks posted yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <Link
              to={`/tasks/${task._id}`}
              key={task._id}
              className={`bg-slate border-l-4 ${
                statusStripe[task.status] || 'border-l-border'
              } border-y border-r border-border rounded-md p-5 hover:bg-slate-2 transition-colors block`}
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="font-display text-lg font-semibold text-paper leading-snug">
                  {task.title}
                </h2>
                <span
                  className={`text-[11px] font-mono uppercase tracking-wide whitespace-nowrap ml-2 ${
                    statusText[task.status] || 'text-fog'
                  }`}
                >
                  {task.status}
                </span>
              </div>

              <p className="text-fog text-sm mb-4 line-clamp-2">
                {task.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="ledger-amount text-signal">${task.budget}</span>
                <span className="text-fog text-xs">{task.category}</span>
              </div>

              <p className="text-fog text-xs mt-3 border-t border-border pt-3">
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