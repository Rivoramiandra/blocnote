import express from 'express';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;