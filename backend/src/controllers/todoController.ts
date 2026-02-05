
import { Response, NextFunction } from 'express';
import { prisma } from '../prisma';
import { AuthRequest } from '../middleware/authMiddleware';
import { z } from 'zod';

const todoSchema = z.object({
    content: z.string().min(1),
});

export const getTodos = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const todos = await prisma.toDoItem.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(todos);
    } catch (error) {
        next(error);
    }
};

export const createTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { content } = todoSchema.parse(req.body);

        const todo = await prisma.toDoItem.create({
            data: {
                userId,
                content,
            }
        });
        res.status(201).json(todo);
    } catch (error) {
        next(error);
    }
};

export const toggleTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const id = req.params.id as string;

        const todo = await prisma.toDoItem.findUnique({ where: { id } });
        if (!todo || todo.userId !== userId) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        const updated = await prisma.toDoItem.update({
            where: { id },
            data: { completed: !todo.completed }
        });
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

export const deleteTodo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const id = req.params.id as string;

        const todo = await prisma.toDoItem.findUnique({ where: { id } });
        if (!todo || todo.userId !== userId) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        await prisma.toDoItem.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
