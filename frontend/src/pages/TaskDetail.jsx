import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getTaskById, completeTask } from '../api/tasks.js';
import { createBid, getBidsForTask, acceptBid } from '../api/bids.js';
import { createReview } from '../api/reviews.js';
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

        {/* Bidding section (freelancer side) */}
        {!isOwningClient && (
          <>
            {bidSuccess ? (
              <p className="bg-green-500/10 text-green-400 text-sm p-3 rounded">
                Your bid was submitted successfully!
              </p>
            ) : !user ? (
              <p className="text-slate-400 text-sm">
                Log in as a freelancer to bid on this task.
              </p>
            ) : user.role !== 'freelancer' ? (
              <p className="text-slate-400 text-sm">
                Only freelancers can bid on tasks.
              </p>
            ) : task.status !== 'open' ? (
              <p className="text-slate-400 text-sm">
                This task is no longer accepting bids.
              </p>
            ) : (
              <form onSubmit={handleBidSubmit}>
                <h3 className="text-white font-semibold mb-3">Submit a Bid</h3>

                {bidError && (
                  <p className="bg-red-500/10 text-red-400 text-sm p-2 rounded mb-3">
                    {bidError}
                  </p>
                )}

                <div className="mb-3">
                  <label className="block text-slate-300 text-sm mb-1">
                    Proposed Amount ($)
                  </label>
                  <input
                    type="number"
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(e.target.value)}
                    required
                    className="w-full p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-slate-300 text-sm mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition"
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
            <h3 className="text-white font-semibold mb-3">Bids</h3>

            {bidsLoading ? (
              <p className="text-slate-400 text-sm">Loading bids...</p>
            ) : bids.length === 0 ? (
              <p className="text-slate-400 text-sm">No bids yet.</p>
            ) : (
              <div className="space-y-3">
                {bids.map((bid) => (
                  <div
                    key={bid._id}
                    className="bg-slate-700 rounded-lg p-4 flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium">
                          {bid.freelancer?.name || 'Unknown'}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            bidStatusColors[bid.status] ||
                            'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {bid.status}
                        </span>
                      </div>
                      <p className="text-green-400 text-sm mb-1">
                        ${bid.proposedAmount}
                      </p>
                      <p className="text-slate-300 text-sm">{bid.message}</p>
                    </div>

                    {bid.status === 'pending' && task.status === 'open' && (
                      <button
                        onClick={() => handleAccept(bid._id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1.5 rounded transition whitespace-nowrap"
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

        {/* Mark complete (owning client, in-progress task) */}
        {isOwningClient && task.status === 'in-progress' && (
          <div className="mt-6">
            <button
              onClick={handleComplete}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition"
            >
              Mark Task as Completed
            </button>
          </div>
        )}

        {/* Review form (completed task, either party) */}
        {isPartOfTask && task.status === 'completed' && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-white font-semibold mb-3">Leave a Review</h3>

            {reviewSuccess ? (
              <p className="bg-green-500/10 text-green-400 text-sm p-3 rounded">
                Review submitted, thank you!
              </p>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                {reviewError && (
                  <p className="bg-red-500/10 text-red-400 text-sm p-2 rounded mb-3">
                    {reviewError}
                  </p>
                )}

                <div className="mb-3">
                  <label className="block text-slate-300 text-sm mb-1">
                    Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} star{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-slate-300 text-sm mb-1">
                    Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={3}
                    className="w-full p-2 rounded bg-slate-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition"
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