const Schedule = require("../models/Schedule");

// ==========================================
// CREATE SCHEDULE
// ==========================================
exports.createSchedule = async (req, res) => {
  try {
    const { date, tasks } = req.body || {};

    if (!date || !Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: "Date and tasks array are required"
      });
    }

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const existing = await Schedule.findOne({
      userId: req.user._id,
      date: selectedDate
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Schedule already exists for this date"
      });
    }

    const schedule = await Schedule.create({
      userId: req.user._id,
      date: selectedDate,
      tasks
    });

    res.status(201).json({
      success: true,
      schedule
    });

  } catch (error) {
    console.error("Create Schedule Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create schedule"
    });
  }
};

// ==========================================
// GET ALL SCHEDULES
// ==========================================
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      userId: req.user._id
    }).sort({ date: 1 });

    res.json({
      success: true,
      count: schedules.length,
      schedules
    });

  } catch (error) {
    console.error("Get Schedule Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch schedules"
    });
  }
};

// ==========================================
// GET TODAY SCHEDULE
// ==========================================
exports.getTodaySchedule = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const schedule = await Schedule.findOne({
      userId: req.user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    res.json({
      success: true,
      schedule
    });

  } catch (error) {
    console.error("Get Today Schedule Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's schedule"
    });
  }
};

// ==========================================
// UPDATE FULL SCHEDULE
// ==========================================
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    if (req.body?.tasks) {
      schedule.tasks = req.body.tasks;
    }

    if (req.body?.date) {
      const newDate = new Date(req.body.date);
      newDate.setHours(0, 0, 0, 0);
      schedule.date = newDate;
    }

    await schedule.save();

    res.json({
      success: true,
      schedule
    });

  } catch (error) {
    console.error("Update Schedule Error:", error);
    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};

// ==========================================
// DELETE SCHEDULE
// ==========================================
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    res.json({
      success: true,
      message: "Schedule deleted successfully"
    });

  } catch (error) {
    console.error("Delete Schedule Error:", error);
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
};

// ==========================================
// ADD NEW TASK
// ==========================================
exports.addTask = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { title, startTime, endTime, category, icon } = req.body || {};

    if (!title || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Title, startTime and endTime are required"
      });
    }

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    schedule.tasks.push({
      title,
      startTime,
      endTime,
      category: category || "Study",
      icon: icon || "📌",
      completed: false
    });

    await schedule.save();

    res.json({
      success: true,
      message: "Task added successfully",
      schedule
    });

  } catch (error) {
    console.error("Add Task Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add task"
    });
  }
};

// ==========================================
// TOGGLE TASK COMPLETION
// ==========================================
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const { scheduleId, taskId } = req.params;

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    const task = schedule.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    task.completed = !task.completed;

    await schedule.save();

    res.json({
      success: true,
      message: "Task completion updated",
      task
    });

  } catch (error) {
    console.error("Toggle Task Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle task"
    });
  }
};

// ==========================================
// EDIT TASK
// ==========================================
exports.editTask = async (req, res) => {
  try {
    const { scheduleId, taskId } = req.params;
    const { title, startTime, endTime, category, icon } = req.body || {};

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    const task = schedule.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    if (title !== undefined) task.title = title;
    if (startTime !== undefined) task.startTime = startTime;
    if (endTime !== undefined) task.endTime = endTime;
    if (category !== undefined) task.category = category;
    if (icon !== undefined) task.icon = icon;

    await schedule.save();

    res.json({
      success: true,
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    console.error("Edit Task Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to edit task"
    });
  }
};

// ==========================================
// DELETE TASK
// ==========================================
exports.deleteTask = async (req, res) => {
  try {
    const { scheduleId, taskId } = req.params;

    const schedule = await Schedule.findOne({
      _id: scheduleId,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found"
      });
    }

    const task = schedule.tasks.id(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    task.deleteOne();
    await schedule.save();

    res.json({
      success: true,
      message: "Task deleted successfully",
      schedule
    });

  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task"
    });
  }
};