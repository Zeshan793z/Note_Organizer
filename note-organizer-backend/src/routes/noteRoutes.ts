import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  createNote,
  getNotes,
  getSingleNote,
  updateNote,
  deleteNote,
  togglePin,
} from '../controllers/noteController';

const router = Router();

router.route('/').get(protect, getNotes).post(protect, createNote);
router
  .route('/:id')
  .get(protect, getSingleNote)
  .put(protect, updateNote)
  .delete(protect, deleteNote);
router.patch('/:id/pin', protect, togglePin);


export default router;
