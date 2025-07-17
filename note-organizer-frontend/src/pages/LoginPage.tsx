import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/useAuth';

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await API.post('/users/login', { email, password });
      login(res.data.user, res.data.token);
      toast.success('Logged in successfully!');
      navigate('/notes');

} catch (err: unknown) {
  const error = err as AxiosErrorResponse;
  const msg = error.response?.data?.message || 'Login failed';
  toast.error(msg);
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Log In
        </button>
        <p className="text-center text-sm">
          Don’t have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
