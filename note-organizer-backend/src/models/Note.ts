import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  category: 'Work' | 'Personal' | 'Random'; 
  image?: string;
  pin?: boolean;
}

const NoteSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Random'],
      required: true,
    },
    image: { type: String },
    pin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INote>('Note', NoteSchema);
