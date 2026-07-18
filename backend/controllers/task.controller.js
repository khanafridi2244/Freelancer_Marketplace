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

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('client', 'name email');
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id).populate('client', 'name email');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, budget, deadline, category } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (budget !== undefined) task.budget = budget;
    if (deadline !== undefined) task.deadline = deadline;
    if (category !== undefined) task.category = category;

    const updatedTask = await task.save();

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to complete this task' });
    }

    if (task.status !== 'in-progress') {
      return res
        .status(400)
        .json({ message: 'Only in-progress tasks can be marked completed' });
    }

    task.status = 'completed';
    await task.save();

    return res.status(200).json({ message: 'Task marked as completed', task });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { 
  createTask, 
  getTasks, 
  getTaskById, 
  updateTask, 
  deleteTask, 
  completeTask 
  
};