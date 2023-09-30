import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';

function Home() {
  const [balance,setBalance]=useState(0)
  useEffect(()=>{
    window.electron.ipcRenderer.on('bill-balance',(_event,b:any)=>{
      console.log(b)
      setBalance(balance+b)}
      )
    window.electron.ipcRenderer.on('coin-balance',(_event,b:any)=>setBalance(balance+b))
  },[])
  return (
    <div className="buttons">
      <h1>Balance : {balance}</h1>
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
