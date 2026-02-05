import express from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { createEntry, getEntries, getEntryById, deleteEntry, updateEntry } from '../controllers/journalController';
import { createFolder, getFolders, deleteFolder, updateFolder } from '../controllers/folderController';

const router = express.Router();

router.use(authenticate);

// Folders
router.post('/folders', createFolder);
router.get('/folders', getFolders);
router.delete('/folders/:id', deleteFolder);
router.put('/folders/:id', updateFolder);

// Entries
router.post('/', createEntry);
router.get('/', getEntries);
router.get('/:id', getEntryById);
router.delete('/:id', deleteEntry);
router.put('/:id', updateEntry);

export default router;
