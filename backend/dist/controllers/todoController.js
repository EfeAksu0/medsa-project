"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.toggleTodo = exports.createTodo = exports.getTodos = void 0;
const prisma_1 = require("../prisma");
const zod_1 = require("zod");
const todoSchema = zod_1.z.object({
    content: zod_1.z.string().min(1),
});
const getTodos = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const todos = await prisma_1.prisma.toDoItem.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(todos);
    }
    catch (error) {
        next(error);
    }
};
exports.getTodos = getTodos;
const createTodo = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { content } = todoSchema.parse(req.body);
        const todo = await prisma_1.prisma.toDoItem.create({
            data: {
                userId,
                content,
            }
        });
        res.status(201).json(todo);
    }
    catch (error) {
        next(error);
    }
};
exports.createTodo = createTodo;
const toggleTodo = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const todo = await prisma_1.prisma.toDoItem.findUnique({ where: { id } });
        if (!todo || todo.userId !== userId) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        const updated = await prisma_1.prisma.toDoItem.update({
            where: { id },
            data: { completed: !todo.completed }
        });
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
};
exports.toggleTodo = toggleTodo;
const deleteTodo = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const todo = await prisma_1.prisma.toDoItem.findUnique({ where: { id } });
        if (!todo || todo.userId !== userId) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        await prisma_1.prisma.toDoItem.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTodo = deleteTodo;
