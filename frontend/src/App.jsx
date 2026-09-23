import { Routes, Route, Link } from 'react-router-dom';

import Notes from './Notes';
import Settings from './Settings';
import PrivateNotes from './PrivateNotes';
import './App.css'

function App() {
  return (
    <div className="app">

      <aside>
        <h2>Ghi chú</h2>

        <nav>
          <Link to="/">Trang chủ</Link>
          <Link to="/settings">Cài đặt</Link>
          <Link to="/private">Vùng kín</Link>
        </nav>
      </aside>

      <main>
        <Routes>
          <Route path="/" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/private" element={<PrivateNotes />} />
        </Routes>
      </main>

    </div>
  );
}

export default App