import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import generateToken from '../utils/generateToken';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ username, email, password });
  const typedUser = user as IUser;

  if (user) {
res.status(201).json({
  token: generateToken(typedUser._id.toString()),
  user: {
    _id: typedUser._id,
    name: typedUser.username,
    email: typedUser.email,
  },
});
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }) as IUser | null;

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

const typedUser = user as IUser;

res.status(200).json({
  token: generateToken(typedUser._id.toString()),
  user: {
    _id: typedUser._id,     
    name: typedUser.username,
    email: typedUser.email,
  },
});

});
