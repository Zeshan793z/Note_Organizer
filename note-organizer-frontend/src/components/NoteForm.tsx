import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { ALLOWED_CATEGORIES } from '../constants/categories';

export default function NoteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [noteId, setNoteId] = useState<string | null>(null);

  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  //  Auto-save on input change
  useEffect(() => {
    if (!title && !content && !category) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, 1000); // 1.5s debounce

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, category]);

  const handleAutoSave = async () => {
    if (!title || !content || !category) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    if (image) formData.append('image', image);

    try {
      setSaving(true);
      if (!noteId) {
        // Create new note
        const res = await API.post('/notes', formData);
        setNoteId(res.data._id);
        toast.success('Note auto-saved');
      } else {
        // Update the same draft note
        await API.put(`/notes/${noteId}`, formData);
        toast.success('Note updated');
      }
      setLastSaved(new Date().toLocaleTimeString());
      setSaving(false);
    } catch (err) {
      console.error(err);
      toast.error('Autosave failed');
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !category) {
      toast.error('Title, content and category are required');
      return;
    }

    if (!noteId) {
      toast.error('Autosave not completed yet');
      return;
    }

    toast.success('Note created');
    navigate('/notes');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">📝 Create New Note</h2>

      <div className="text-sm text-gray-500 mb-2">
        {saving ? 'Saving...' : lastSaved ? `Saved at ${lastSaved}` : ''}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          className="w-full border p-2 rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <select
          className="w-full border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {ALLOWED_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileRef}
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-24 h-24 object-cover rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={!noteId}
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          Save Note
        </button>
      </form>
    </div>
  );
}
