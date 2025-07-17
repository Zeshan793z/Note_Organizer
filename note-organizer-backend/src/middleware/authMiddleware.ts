import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, {IUser} from '../models/User';

interface AuthenticatedUser {
  _id: string;
  name?: string;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      _id: user._id.toString(),
      name: user.username,
      email: user.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token failed or expired' });
  }
};
