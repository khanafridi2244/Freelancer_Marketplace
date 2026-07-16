import { Task } from '../models/task.model.js';

const createTask = async (req, res) => {
  try {
    const { title, description, budget, deadline, category } = req.body;

    if (!title || !description || !budget || !deadline || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Only clients can post tasks' });
    }

    const task = await Task.create({
      title,
      description,
      budget,
      deadline,
      category,
      client: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { createTask };