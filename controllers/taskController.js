import Task from "../models/Task.js";

// ✅ Create Task
export const createTask = async (req, res) => {
  console.log("🟢 /api/tasks POST reached");
  console.log("📩 Body received:", req.body);
  console.log("👤 User from auth:", req.user);

  try {
    const { title, description, status, board, date, subtasks } = req.body;

    if (!title) return res.status(400).json({ message: "Title required" });
    if (!board) return res.status(400).json({ message: "Board required" });

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      user: req.user.id,
      board,
      date,
      subtasks: subtasks || [],
    });

    // ✅ Return the **saved** task (sub-tasks embedded)
    return res.status(201).json(task);
  } catch (err) {
    console.error("❌ Create task error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

 

// ✅ Get all Tasks (for logged-in user)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id || req.userId })
      .lean()
      .sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Task (returns updated doc with sub-tasks)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ success: true, task: updatedTask });
  } catch (err) {
    console.error("❌ Error updating task:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    console.error("❌ Error deleting task:", err);
    res.status(500).json({ message: err.message });
  }
};