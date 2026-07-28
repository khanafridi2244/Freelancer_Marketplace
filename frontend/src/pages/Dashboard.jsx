import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../api/tasks.js';
import { getMyBids } from '../api/bids.js';
import { useAuth } from '../context/useAuth.js';

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

const bidStripe = {
  pending: 'border-l-status-progress',
  accepted: 'border-l-status-open',
  rejected: 'border-l-status-rejected',
};

const bidText = {
  pending: 'text-status-progress',
  accepted: 'text-status-open',
  rejected: 'text-status-rejected',
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
          setItems(response.data.filter((task) => task.client?._id === user.id));
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
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <p className="text-fog">Log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] px-6 py-10 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs text-signal uppercase tracking-widest mb-1">
          {user.role === 'client' ? 'Your contracts' : 'Your proposals'}
        </p>
        <h1 className="font-display text-3xl font-semibold text-paper">
          {user.role === 'client' ? 'My Posted Tasks' : 'My Bids'}
        </h1>
      </div>

      {loading ? (
        <p className="text-fog font-mono text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-fog">
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
                  className={`bg-slate border-l-4 ${
                    statusStripe[task.status] || 'border-l-border'
                  } border-y border-r border-border rounded-md p-5 hover:bg-slate-2 transition-colors block`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="font-display text-lg font-semibold text-paper">
                      {task.title}
                    </h2>
                    <span
                      className={`text-[11px] font-mono uppercase tracking-wide ml-2 ${
                        statusText[task.status] || 'text-fog'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="ledger-amount text-signal text-sm">${task.budget}</p>
                </Link>
              ))
            : items.map((bid) => (
                <Link
                  to={`/tasks/${bid.task?._id}`}
                  key={bid._id}
                  className={`bg-slate border-l-4 ${
                    bidStripe[bid.status] || 'border-l-border'
                  } border-y border-r border-border rounded-md p-5 hover:bg-slate-2 transition-colors block`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="font-display text-lg font-semibold text-paper">
                      {bid.task?.title || 'Task removed'}
                    </h2>
                    <span
                      className={`text-[11px] font-mono uppercase tracking-wide ml-2 ${
                        bidText[bid.status] || 'text-fog'
                      }`}
                    >
                      {bid.status}
                    </span>
                  </div>
                  <p className="ledger-amount text-signal text-sm mb-1">
                    ${bid.proposedAmount}
                  </p>
                  <p className="text-fog text-sm">{bid.message}</p>
                </Link>
              ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;