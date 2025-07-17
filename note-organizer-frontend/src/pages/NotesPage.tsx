import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../utils/axios';
import type { Note } from '../types/note';
import {
  ALLOWED_CATEGORIES,
  CATEGORY_COLORS
} from '../constants/categories';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const page = Number(searchParams.get('page') || 1);
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get('/notes', {
          params: { page, search, category },
        });
        setNotes(res.data.notes);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };

    fetchNotes();
  }, [page, search, category]);

  const togglePin = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation(); // Prevent redirect
    try {
      const res = await API.patch(`/notes/${noteId}/pin`);
      setNotes((prev) =>
        prev.map((note) => (note._id === res.data._id ? res.data : note))
      );
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">📒 Your Notes</h2>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <input
          type="text"
          placeholder="Search notes..."
          className="border rounded px-4 py-2 w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded px-4 py-2 w-full sm:w-64"
          value={category}
          onChange={(e) =>
            setSearchParams({ page: '1', search, category: e.target.value })
          }
        >
          <option value="">All Categories</option>
          {ALLOWED_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Note Grid */}
      {notes.length === 0 ? (
        <p className="text-center text-gray-500">No notes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              onClick={() => navigate(`/notes/edit/${note._id}`)}
              className="relative border rounded-lg p-4 shadow bg-white cursor-pointer hover:bg-gray-50 transition"
            >
              {/* Pin Toggle Button */}
              <button
                onClick={(e) => togglePin(e, note._id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-blue-600 text-lg"
                title={note.pin ? 'Unpin Note' : 'Pin Note'}
              >
                {note.pin ? '📌' : '📍'}
              </button>

              <h3 className="font-semibold text-lg text-blue-800">
                {note.title}
              </h3>

              <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                {note.content.slice(0, 150)}...
              </p>

              {note.image && (
                <img
                  src={`http://localhost:5000${note.image}`}
                  alt={note.title}
                  className="mt-3 w-full h-40 object-cover rounded"
                />
              )}

              {/* Category Badge */}
              {note.category && (
                <div className="text-xs mt-3">
                  <span
                    className="inline-block px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: CATEGORY_COLORS[note.category] || '#999',
                      color: '#fff',
                    }}
                  >
                    {note.category}
                  </span>
                </div>
              )}

              {/* Timestamp */}
              {note.updatedAt && (
                <div className="text-xs text-gray-400 mt-1">
                  Last edited: {new Date(note.updatedAt).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSearchParams({ page: String(idx + 1), search, category })}
              className={`px-4 py-2 rounded border ${
                page === idx + 1
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* Floating Create Button */}
      <button
        onClick={() => navigate('/create')}
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg transition duration-200"
      >
        ➕ New Note
      </button>
    </div>
  );
}
