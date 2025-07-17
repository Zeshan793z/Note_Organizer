import { useEffect, useState } from 'react';
import API from '../utils/axios';
import { useNavigate } from 'react-router-dom';

interface Note {
  _id: string;
  title: string;
  content: string;
  category?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

const NoteList = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const params: Record<string, string | number>= {
          page,
          limit: 6,
        };

        if (search) params.search = search;
        if (category) params.category = category;

        const { data } = await API.get('/notes', { params });
        setNotes(data.notes);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };

    fetchNotes();
  }, [search, category, page]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-4 flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/notes/edit/${note._id}`)}
          >
            <h3 className="font-bold text-lg">{note.title}</h3>
            <p className="text-sm text-gray-700 line-clamp-3">{note.content}</p>
            <div className="text-xs text-gray-500 mt-2">{note.category}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NoteList;
