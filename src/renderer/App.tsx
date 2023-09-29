import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function Home() {
  return (
    <div className="buttons">
      <h1>Balance : </h1>
      <button
        type="button"
        onClick={() => window.electron.ipcRenderer.sendMessage('start')}
      >
        START
      </button>
      <button
        type="button"
        onClick={() => window.electron.ipcRenderer.sendMessage('stop')}
      >
        STOP
      </button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
