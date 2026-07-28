import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getTaskById, completeTask } from '../api/tasks.js';
import { createBid, getBidsForTask, acceptBid } from '../api/bids.js';
import { createReview } from '../api/reviews.js';
import { useAuth } from '../context/useAuth.js';

const statusText = {
  open: 'text-status-open',
  'in-progress': 'text-status-progress',
  completed: 'text-status-completed',
  cancelled: 'text-status-rejected',
};

const bidStatusText = {
  pending: 'text-status-progress',
  accepted: 'text-status-open',
  rejected: 'text-status-rejected',
};

function TaskDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const [proposedAmount, setProposedAmount] = useState('');
  const [message, setMessage] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState(false);

  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchTask = useCallback(async () => {
    try {
      const response = await getTaskById(id);
      setTask(response.data);
    } catch (err) {
      console.error('Failed to fetch task:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const isOwningClient =
    user && task && user.role === 'client' && task.client?._id === user.id;

  const isAssignedFreelancer =
    user && task && user.role === 'freelancer' && task.assignedFreelancer === user.id;

  const isPartOfTask = isOwningClient || isAssignedFreelancer;

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!isOwningClient) {
      setBidsLoading(false);
      return;
    }

    const fetchBids = async () => {
      setBidsLoading(true);
      try {
        const response = await getBidsForTask(id);
        setBids(response.data);
      } catch (err) {
        console.error('Failed to fetch bids:', err);
      } finally {
        setBidsLoading(false);
      }
    };

    fetchBids();
  }, [isOwningClient, id, task]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidError('');

    try {
      await createBid(id, { proposedAmount, message });
      setBidSuccess(true);
      setProposedAmount('');
      setMessage('');
    } catch (err) {
      setBidError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleAccept = async (bidId) => {
    try {
      await acceptBid(bidId);
      await fetchTask();
      const response = await getBidsForTask(id);
      setBids(response.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleComplete = async () => {
    try {
      await completeTask(id);
      await fetchTask();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');

    try {
      await createReview(id, { rating: Number(rating), comment });
      setReviewSuccess(true);
      setComment('');
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <p className="text-fog font-mono text-sm">Loading task…</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-[calc(100vh-73px)] flex items-center justify-center">
        <p className="text-fog">Task not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-73px)] px-6 py-10">
      <div className="max-w-2xl mx-auto bg-slate border border-border rounded-md p-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="font-display text-2xl font-semibold text-paper">
            {task.title}
          </h1>
          <span
            className={`text-[11px] font-mono uppercase tracking-wide whitespace-nowrap ml-3 ${
              statusText[task.status] || 'text-fog'
            }`}
          >
            {task.status}
          </span>
        </div>

        <p className="text-paper/80 mb-6 leading-relaxed">{task.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6 border-y border-border py-4">
          <div>
            <p className="text-fog text-xs uppercase tracking-wide mb-1">Budget</p>
            <p className="ledger-amount text-signal">${task.budget}</p>
          </div>
          <div>
            <p className="text-fog text-xs uppercase tracking-wide mb-1">Category</p>
            <p className="text-paper">{task.category}</p>
          </div>
          <div>
            <p className="text-fog text-xs uppercase tracking-wide mb-1">Deadline</p>
            <p className="text-paper font-mono text-sm">
              {new Date(task.deadline).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-fog text-xs uppercase tracking-wide mb-1">Posted by</p>
            <p className="text-paper">{task.client?.name || 'Unknown'}</p>
          </div>
        </div>

        {/* Bidding section (freelancer side) */}
        {!isOwningClient && (
          <>
            {bidSuccess ? (
              <p className="bg-status-open/10 text-status-open text-sm p-3 rounded-md">
                Your bid was submitted successfully!
              </p>
            ) : !user ? (
              <p className="text-fog text-sm">
                Log in as a freelancer to bid on this task.
              </p>
            ) : user.role !== 'freelancer' ? (
              <p className="text-fog text-sm">Only freelancers can bid on tasks.</p>
            ) : task.status !== 'open' ? (
              <p className="text-fog text-sm">
                This task is no longer accepting bids.
              </p>
            ) : (
              <form onSubmit={handleBidSubmit}>
                <h3 className="font-display text-lg font-semibold text-paper mb-3">
                  Submit a Bid
                </h3>

                {bidError && (
                  <p className="bg-status-rejected/10 text-status-rejected text-sm p-2 rounded-md mb-3">
                    {bidError}
                  </p>
                )}

                <div className="mb-3">
                  <label className="block text-fog text-sm mb-1">
                    Proposed Amount ($)
                  </label>
                  <input
                    type="number"
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(e.target.value)}
                    required
                    className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors font-mono"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-fog text-sm mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-signal hover:bg-signal-dark text-ink px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Submit Bid
                </button>
              </form>
            )}
          </>
        )}

        {/* Bids section (owning client side) */}
        {isOwningClient && (
          <div>
            <h3 className="font-display text-lg font-semibold text-paper mb-3">
              Bids
            </h3>

            {bidsLoading ? (
              <p className="text-fog text-sm font-mono">Loading bids…</p>
            ) : bids.length === 0 ? (
              <p className="text-fog text-sm">No bids yet.</p>
            ) : (
              <div className="space-y-3">
                {bids.map((bid) => (
                  <div
                    key={bid._id}
                    className="bg-slate-2 border border-border rounded-md p-4 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-paper font-medium">
                          {bid.freelancer?.name || 'Unknown'}
                        </p>
                        <span
                          className={`text-[11px] font-mono uppercase tracking-wide ${
                            bidStatusText[bid.status] || 'text-fog'
                          }`}
                        >
                          {bid.status}
                        </span>
                      </div>
                      <p className="ledger-amount text-signal text-sm mb-1">
                        ${bid.proposedAmount}
                      </p>
                      <p className="text-paper/70 text-sm">{bid.message}</p>
                    </div>

                    {bid.status === 'pending' && task.status === 'open' && (
                      <button
                        onClick={() => handleAccept(bid._id)}
                        className="bg-status-open/20 hover:bg-status-open/30 text-status-open text-sm px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mark complete */}
        {isOwningClient && task.status === 'in-progress' && (
          <div className="mt-6">
            <button
              onClick={handleComplete}
              className="bg-signal hover:bg-signal-dark text-ink px-4 py-2 rounded-md font-medium transition-colors"
            >
              Mark Task as Completed
            </button>
          </div>
        )}

        {/* Review form */}
        {isPartOfTask && task.status === 'completed' && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-display text-lg font-semibold text-paper mb-3">
              Leave a Review
            </h3>

            {reviewSuccess ? (
              <p className="bg-status-open/10 text-status-open text-sm p-3 rounded-md">
                Review submitted, thank you!
              </p>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                {reviewError && (
                  <p className="bg-status-rejected/10 text-status-rejected text-sm p-2 rounded-md mb-3">
                    {reviewError}
                  </p>
                )}

                <div className="mb-3">
                  <label className="block text-fog text-sm mb-1">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} star{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-fog text-sm mb-1">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={3}
                    className="w-full p-2 rounded-md bg-slate-2 border border-border text-paper outline-none focus:border-signal transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-signal hover:bg-signal-dark text-ink px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetail;