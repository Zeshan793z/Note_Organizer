import { Routes, Route, Navigate } from 'react-router-dom';
import NotesPage from './pages/NotesPage';
import NoteForm from './components/NoteForm';
import NoteEditor from './components/NoteEditor';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/notes"
          element={<PrivateRoute><NotesPage /></PrivateRoute>}
        />
        <Route
          path="/create"
          element={<PrivateRoute><NoteForm /></PrivateRoute>}
        />
        <Route
          path="/notes/edit/:id"
          element={<PrivateRoute><NoteEditor /></PrivateRoute>}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
