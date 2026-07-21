import { Review } from '../models/review.model.js';
import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';

const createReview = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review a completed task' });
    }

    let reviewee;
    if (req.user._id.toString() === task.client.toString()) {
      reviewee = task.assignedFreelancer;
    } else if (
      task.assignedFreelancer &&
      req.user._id.toString() === task.assignedFreelancer.toString()
    ) {
      reviewee = task.client;
    } else {
      return res.status(403).json({ message: 'You are not part of this task' });
    }

    const existingReview = await Review.findOne({
      task: taskId,
      reviewer: req.user._id,
    });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this task' });
    }

    const review = await Review.create({
      task: taskId,
      reviewer: req.user._id,
      reviewee,
      rating,
      comment,
    });

    // Recalculate the reviewee's average rating
    const revieweeReviews = await Review.find({ reviewee });
    const avgRating =
      revieweeReviews.reduce((sum, r) => sum + r.rating, 0) / revieweeReviews.length;

    await User.findByIdAndUpdate(reviewee, { rating: avgRating });

    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId }).populate(
      'reviewer',
      'name avatar'
    );

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { createReview, getUserReviews };