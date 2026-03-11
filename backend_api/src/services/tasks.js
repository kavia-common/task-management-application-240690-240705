const { randomUUID } = require('crypto');

/**
 * In-memory tasks store.
 * Note: This is intentionally ephemeral (no DB). The frontend persists locally.
 */
class TasksService {
  constructor() {
    /** @type {Map<string, {id:string,title:string,completed:boolean,createdAt:string,updatedAt:string}>} */
    this._tasks = new Map();
  }

  /**
   * @param {any} task
   * @returns {boolean}
   */
  _isValidTaskShape(task) {
    return (
      task &&
      typeof task.id === 'string' &&
      typeof task.title === 'string' &&
      typeof task.completed === 'boolean' &&
      typeof task.createdAt === 'string' &&
      typeof task.updatedAt === 'string'
    );
  }

  /**
   * @returns {Array<object>}
   */
  list() {
    return Array.from(this._tasks.values()).sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt)
    );
  }

  /**
   * @param {'all'|'active'|'completed'} filter
   * @returns {Array<object>}
   */
  listByFilter(filter) {
    const all = this.list();
    if (filter === 'active') return all.filter((t) => !t.completed);
    if (filter === 'completed') return all.filter((t) => t.completed);
    return all;
  }

  /**
   * @param {string} title
   * @returns {object}
   */
  create(title) {
    const now = new Date().toISOString();
    const task = {
      id: randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    this._tasks.set(task.id, task);
    return task;
  }

  /**
   * @param {string} id
   * @returns {object|null}
   */
  get(id) {
    return this._tasks.get(id) || null;
  }

  /**
   * @param {string} id
   * @param {{title?:string, completed?:boolean}} updates
   * @returns {object|null}
   */
  update(id, updates) {
    const existing = this.get(id);
    if (!existing) return null;

    const next = {
      ...existing,
      ...(typeof updates.title === 'string' ? { title: updates.title.trim() } : {}),
      ...(typeof updates.completed === 'boolean' ? { completed: updates.completed } : {}),
      updatedAt: new Date().toISOString(),
    };

    this._tasks.set(id, next);
    return next;
  }

  /**
   * @param {string} id
   * @returns {object|null} deleted task
   */
  remove(id) {
    const existing = this.get(id);
    if (!existing) return null;
    this._tasks.delete(id);
    return existing;
  }

  /**
   * Replace all tasks (used by import endpoint).
   * @param {Array<any>} tasks
   * @returns {{imported:number}}
   */
  replaceAll(tasks) {
    const next = new Map();
    for (const t of tasks || []) {
      if (this._isValidTaskShape(t)) {
        next.set(t.id, t);
      }
    }
    this._tasks = next;
    return { imported: this._tasks.size };
  }

  /**
   * Export all tasks.
   * @returns {{tasks:Array<object>}}
   */
  exportAll() {
    return { tasks: this.list() };
  }
}

module.exports = new TasksService();
