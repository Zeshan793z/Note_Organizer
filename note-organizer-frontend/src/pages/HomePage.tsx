import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function HomePage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/notes');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">📝 Welcome to Note Organizer</h1>
      <div className="flex gap-4">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
        <button
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          onClick={() => navigate('/register')}
        >
          Register
        </button>
      </div>
    </div>
  );
}
