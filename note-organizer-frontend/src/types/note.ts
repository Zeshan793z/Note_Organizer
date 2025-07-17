// export interface Note {
//   _id: string;
//   title: string;
//   content: string;
//   image?: string;
//   category?: string;
// }

// src/types/note.ts
export interface Note {
  _id: string;
  title: string;
  content: string;
  category?: string;
  image?: string;
  pin?: boolean;
  updatedAt: string;
}
