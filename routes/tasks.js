import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ✅ Get tasks for a specific board (with sub-tasks)
router.get("/:boardId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ board: req.params.boardId })
      .lean() // plain objects
      .sort({ createdAt: -1 });

    res.json(tasks); // ✅ sub-tasks already embedded
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Create a new task for a board
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, status, board, date, subtasks } = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!board) return res.status(400).json({ message: "Board ID is required" });

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      board,
      user: req.user.id,
      date,
      subtasks: subtasks || [],
    });

    res.status(201).json(task); // ✅ returns full task with sub-tasks
  } catch (err) {
    console.error("❌ Task creation error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update a task (returns updated doc with sub-tasks)
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Delete a task
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;