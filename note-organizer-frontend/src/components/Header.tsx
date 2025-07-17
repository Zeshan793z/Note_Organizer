import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  const showHeader = !['/', '/login', '/register'].includes(location.pathname);

  if (!showHeader) return null;

  return (
    <header className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1
        onClick={() => navigate('/notes')}
        className="text-xl font-bold cursor-pointer"
      >
        📝 Note Organizer
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">
          👤 {user?.name || 'Guest'}
        </span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
