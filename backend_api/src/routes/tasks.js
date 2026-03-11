const express = require('express');
const tasksController = require('../controllers/tasks');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: CRUD and filtering for to-do tasks
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required: [id, title, completed, createdAt, updatedAt]
 *       properties:
 *         id:
 *           type: string
 *           description: Unique task id
 *           example: "b2d4d47e-1e9d-4f4b-9b4f-35b3f2d21a6c"
 *         title:
 *           type: string
 *           description: Task title
 *           example: "Buy milk"
 *         completed:
 *           type: boolean
 *           description: Completion status
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: List tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get('/', tasksController.list.bind(tasksController));

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Write retro UI"
 *     responses:
 *       201:
 *         description: Created task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 */
router.post('/', tasksController.create.bind(tasksController));

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Not found
 */
router.put('/:id', tasksController.update.bind(tasksController));

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Not found
 */
router.delete('/:id', tasksController.remove.bind(tasksController));

/**
 * @swagger
 * /tasks/{id}/toggle:
 *   patch:
 *     summary: Toggle completion
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Toggled task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Not found
 */
router.patch('/:id/toggle', tasksController.toggle.bind(tasksController));

/**
 * @swagger
 * /tasks/filter:
 *   get:
 *     summary: Filter tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [all, active, completed]
 *         description: Which tasks to return
 *     responses:
 *       200:
 *         description: Filtered list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid filter
 */
router.get('/filter', tasksController.filter.bind(tasksController));

/**
 * @swagger
 * /tasks/import:
 *   post:
 *     summary: Import tasks (replace server in-memory list)
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tasks]
 *             properties:
 *               tasks:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Import result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imported:
 *                   type: number
 *       400:
 *         description: Invalid input
 */
router.post('/import', tasksController.import.bind(tasksController));

/**
 * @swagger
 * /tasks/export:
 *   get:
 *     summary: Export tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Exported tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get('/export', tasksController.export.bind(tasksController));

module.exports = router;
