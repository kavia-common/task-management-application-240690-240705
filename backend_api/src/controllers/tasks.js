const tasksService = require('../services/tasks');

class TasksController {
  /**
   * List all tasks.
   */
  list(req, res) {
    return res.status(200).json({ tasks: tasksService.list() });
  }

  /**
   * Create a new task.
   */
  create(req, res) {
    const { title } = req.body || {};
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        status: 'error',
        message: 'title is required',
      });
    }

    const task = tasksService.create(title);
    return res.status(201).json({ task });
  }

  /**
   * Update an existing task (title and/or completed).
   */
  update(req, res) {
    const { id } = req.params;
    const { title, completed } = req.body || {};

    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'title must be a non-empty string when provided',
      });
    }
    if (completed !== undefined && typeof completed !== 'boolean') {
      return res.status(400).json({
        status: 'error',
        message: 'completed must be a boolean when provided',
      });
    }

    const updated = tasksService.update(id, { title, completed });
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }
    return res.status(200).json({ task: updated });
  }

  /**
   * Toggle completion status for a task.
   */
  toggle(req, res) {
    const { id } = req.params;
    const existing = tasksService.get(id);
    if (!existing) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }
    const updated = tasksService.update(id, { completed: !existing.completed });
    return res.status(200).json({ task: updated });
  }

  /**
   * Delete a task.
   */
  remove(req, res) {
    const { id } = req.params;
    const deleted = tasksService.remove(id);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Task not found' });
    }
    return res.status(200).json({ task: deleted });
  }

  /**
   * Filter tasks by status.
   */
  filter(req, res) {
    const filter = String(req.query.status || 'all');
    if (!['all', 'active', 'completed'].includes(filter)) {
      return res.status(400).json({
        status: 'error',
        message: 'status must be one of \'all\' | \'active\' | \'completed\'',
      });
    }
    return res.status(200).json({ tasks: tasksService.listByFilter(filter) });
  }

  /**
   * Import tasks from client local storage (optional helper endpoint).
   */
  import(req, res) {
    const { tasks } = req.body || {};
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ status: 'error', message: 'tasks must be an array' });
    }
    const result = tasksService.replaceAll(tasks);
    return res.status(200).json(result);
  }

  /**
   * Export tasks (optional helper endpoint).
   */
  export(req, res) {
    return res.status(200).json(tasksService.exportAll());
  }
}

module.exports = new TasksController();
