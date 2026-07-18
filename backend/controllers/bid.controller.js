import { Bid } from '../models/bid.model.js';
import { Task } from '../models/task.model.js';

const createBid = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { proposedAmount, message } = req.body;

    if (!proposedAmount || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: 'Only freelancers can bid' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status !== 'open') {
      return res.status(400).json({ message: 'This task is not open for bidding' });
    }

    const existingBid = await Bid.findOne({
      task: taskId,
      freelancer: req.user._id,
    });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already bid on this task' });
    }

    const bid = await Bid.create({
      task: taskId,
      freelancer: req.user._id,
      proposedAmount,
      message,
    });

    return res.status(201).json(bid);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBidsForTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these bids' });
    }

    const bids = await Bid.find({ task: taskId }).populate(
      'freelancer',
      'name email rating skills'
    );

    return res.status(200).json(bids);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const acceptBid = async (req, res) => {
  try {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const task = await Task.findById(bid.task);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this bid' });
    }

    if (task.status !== 'open') {
      return res.status(400).json({ message: 'This task is no longer open' });
    }

    bid.status = 'accepted';
    await bid.save();

    task.status = 'in-progress';
    task.assignedFreelancer = bid.freelancer;
    await task.save();

    await Bid.updateMany(
      { task: task._id, _id: { $ne: bid._id }, status: 'pending' },
      { status: 'rejected' }
    );

    return res.status(200).json({ message: 'Bid accepted', task });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { createBid, getBidsForTask, acceptBid };