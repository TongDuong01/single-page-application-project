import { Routes, Route, Link } from 'react-router-dom';
import Notes from './Notes';
import Settings from './Settings';
import PrivateNotes from './PrivateNotes';
import './App.css';

function App() {
  return (
    <div className="app min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">Ghi chú</Link>
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/">Trang chủ</Link>
            <Link className="nav-link" to="/settings">Cài đặt</Link>
            <Link className="nav-link" to="/private">Riêng tư</Link>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/private" element={<PrivateNotes />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
