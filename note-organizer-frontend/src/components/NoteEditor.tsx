import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../utils/axios';
import { ALLOWED_CATEGORIES } from '../constants/categories';

export default function NoteEditor() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load note data
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await API.get(`/notes/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setCategory(res.data.category || '');
        if (res.data.image) {
          setImagePreview(`http://localhost:5000${res.data.image}`);
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error('Failed to load note');
        navigate('/notes');
      }
    };

    fetchNote();
  }, [id, navigate]);

  // Autosave logic
  useEffect(() => {
    if (!title.trim() && !content.trim()) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, 1500); // 1.5 seconds debounce
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, category]);

  const handleAutoSave = async () => {
    if (!title || !content || !category) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    if (newImage) formData.append('image', newImage);

    try {
      setSaving(true);
      await API.put(`/notes/${id}`, formData);
      setSaving(false);
      setLastSaved(new Date().toLocaleTimeString());
    } catch {
      setSaving(false);
      toast.error('Autosave failed');
    }
  };

  const handleManualUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAutoSave();
    toast.success('Note saved manually');
    navigate('/notes');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await API.delete(`/notes/${id}`);
      toast.success('Note deleted');
      navigate('/notes');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">✏️ Edit Note</h2>

      <div className="text-sm text-gray-500 mb-2">
        {saving ? 'Saving...' : lastSaved ? `Saved at ${lastSaved}` : ''}
      </div>

      <form onSubmit={handleManualUpdate} className="space-y-4">
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

        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setNewImage(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="preview"
            className="w-32 h-32 object-cover mt-2 rounded border"
          />
        )}

        <div className="flex gap-3">
          <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
            Save Now
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
