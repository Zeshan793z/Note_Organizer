import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import Note from '../models/Note';
import { AuthRequest } from '../types/AuthRequest';

// @route   POST /api/notes
// @access  Private
export const createNote = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, content, category } = req.body;

  if (!req.user) throw new Error('User not authenticated');

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  if (!['Work', 'Personal', 'Random'].includes(category)) {
    res.status(400);
    throw new Error('Invalid category');
  }

  const note = await Note.create({
    title,
    content,
    category,
    user: req.user._id,
    image: req.file ? `/uploads/${req.file.filename}` : undefined,
  });

  res.status(201).json(note);
});

// @route   GET /api/notes
// @access  Private
export const getNotes = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const search = req.query.search as string;
  const category = req.query.category as string;

  const searchFilter = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const categoryFilter = category ? { category } : {};
  const userFilter = { user: req.user!._id };

  const query = {
    ...userFilter,
    ...searchFilter,
    ...categoryFilter,
  };

  const total = await Note.countDocuments(query);

  const notes = await Note.find(query)
    .sort({ pin: -1, updatedAt: -1 }) 
    .skip(skip)
    .limit(limit);

  res.json({ notes, page, totalPages: Math.ceil(total / limit) });
});

// @route   GET /api/notes/:id
// @access  Private
export const getSingleNote = asyncHandler(async (req: AuthRequest, res: Response) => {
  const note = await Note.findById(req.params.id);
  if (!note || note.user.toString() !== req.user!._id.toString()) {
    res.status(403);
    throw new Error('Not authorized or not found');
  }
  res.json(note);
});

// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = asyncHandler(async (req: AuthRequest, res: Response) => {
  const note = await Note.findById(req.params.id);
  if (!note || note.user.toString() !== req.user!._id.toString()) {
    res.status(403);
    throw new Error('Not authorized or not found');
  }

  const { title, content, category } = req.body;
  note.title = title || note.title;
  note.content = content || note.content;
  note.category = category || note.category;
  if (req.file) note.image = `/uploads/${req.file.filename}`;

  const updated = await note.save();
  res.json(updated);
});

// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = asyncHandler(async (req: AuthRequest, res: Response) => {
  const note = await Note.findById(req.params.id);
  if (!note || note.user.toString() !== req.user!._id.toString()) {
    res.status(403);
    throw new Error('Not authorized or not found');
  }

  await note.deleteOne();
  res.json({ message: 'Note deleted successfully' });
});

// @route   PATCH /api/notes/:id/pin
// @access  Private
export const togglePin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const note = await Note.findById(req.params.id);
  if (!note || note.user.toString() !== req.user!._id.toString()) {
    res.status(403);
    throw new Error('Not authorized or note not found');
  }

  note.pin = !note.pin;
  const updated = await note.save();
  res.json(updated);
});
