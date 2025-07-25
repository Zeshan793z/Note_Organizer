import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
