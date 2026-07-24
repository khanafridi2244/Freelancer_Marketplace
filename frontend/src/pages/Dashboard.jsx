import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../api/tasks.js';
import { getMyBids } from '../api/bids.js';
import { useAuth } from '../context/useAuth.js';

const statusColors = {
  open: 'bg-green-500/20 text-green-400',
  'in-progress': 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-gray-500/20 text-gray-400',
  cancelled: 'bg-red-500/20 text-red-400',
};

const bidStatusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  accepted: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
};

function Dashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user.role === 'client') {
          const response = await getTasks();
          const myTasks = response.data.filter(
            (task) => task.client?._id === user.id
          );
          setItems(myTasks);
        } else {
          const response = await getMyBids();
          setItems(response.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 px-6 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        {user.role === 'client' ? 'My Posted Tasks' : 'My Bids'}
      </h1>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-slate-400">
          {user.role === 'client'
            ? "You haven't posted any tasks yet."
            : "You haven't placed any bids yet."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.role === 'client'
            ? items.map((task) => (
                <Link
                  to={`/tasks/${task._id}`}
                  key={task._id}
                  className="bg-slate-800 rounded-lg p-5 hover:ring-1 hover:ring-blue-500 transition block"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-white font-semibold text-lg">
                      {task.title}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        statusColors[task.status] ||
                        'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="text-green-400 text-sm font-medium">
                    ${task.budget}
                  </p>
                </Link>
              ))
            : items.map((bid) => (
                <Link
                  to={`/tasks/${bid.task?._id}`}
                  key={bid._id}
                  className="bg-slate-800 rounded-lg p-5 hover:ring-1 hover:ring-blue-500 transition block"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-white font-semibold text-lg">
                      {bid.task?.title || 'Task removed'}
                    </h2>
                    <span
                      className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                        bidStatusColors[bid.status] ||
                        'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {bid.status}
                    </span>
                  </div>
                  <p className="text-green-400 text-sm font-medium">
                    Your bid: ${bid.proposedAmount}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">{bid.message}</p>
                </Link>
              ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;