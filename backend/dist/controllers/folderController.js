"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFolder = exports.deleteFolder = exports.getFolders = exports.createFolder = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const createFolderSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
});
const createFolder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name } = createFolderSchema.parse(req.body);
        const folder = await prisma.journalFolder.create({
            data: {
                name,
                userId,
            },
        });
        res.status(201).json(folder);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        // Handle unique constraint violation
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Folder with this name already exists' });
        }
        console.error('Create folder error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createFolder = createFolder;
const getFolders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const folders = await prisma.journalFolder.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { entries: true }
                }
            }
        });
        res.json(folders);
    }
    catch (error) {
        console.error('Get folders error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getFolders = getFolders;
const deleteFolder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        if (typeof id !== 'string')
            return res.status(400).json({ message: 'Invalid ID' });
        const folder = await prisma.journalFolder.findUnique({ where: { id } });
        if (!folder)
            return res.status(404).json({ message: 'Folder not found' });
        if (folder.userId !== userId)
            return res.status(403).json({ message: 'Unauthorized' });
        // Option: Delete entries or move to root? 
        // For now, let's cascade delete entries (handled by database if cascading) or manually delete.
        // Since we didn't set onDelete Cascade in schema, we should probably delete entries or updating them.
        // Let's delete entries for now to be "clean".
        // Manually delete entries first to be safe
        await prisma.journalEntry.deleteMany({
            where: { folderId: id }
        });
        await prisma.journalFolder.delete({ where: { id } });
        res.json({ message: 'Folder deleted successfully' });
    }
    catch (error) {
        console.error('Delete folder error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.deleteFolder = deleteFolder;
const updateFolder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const { name } = createFolderSchema.parse(req.body);
        if (typeof id !== 'string')
            return res.status(400).json({ message: 'Invalid ID' });
        const folder = await prisma.journalFolder.findUnique({ where: { id } });
        if (!folder)
            return res.status(404).json({ message: 'Folder not found' });
        if (folder.userId !== userId)
            return res.status(403).json({ message: 'Unauthorized' });
        const updatedFolder = await prisma.journalFolder.update({
            where: { id },
            data: { name }
        });
        res.json(updatedFolder);
    }
    catch (error) {
        console.error('Update folder error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateFolder = updateFolder;
