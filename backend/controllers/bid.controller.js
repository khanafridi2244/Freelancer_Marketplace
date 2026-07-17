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

export { createBid };