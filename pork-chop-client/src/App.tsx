import { useEffect, useRef, useState } from 'react'
import reactLogo from "/GitHub_Invertocat_White.png"
import bacon from '/canvas.png'
import './App.css'

function App() {
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const connect = () => {
    ws.current = new WebSocket('ws://localhost:3001');
    
    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Server says:', data);
    };
    
    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };
  };

  const sendCommand = (cmd: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(cmd);
    }
  };

  return (
    <>
    <div className='header'>
      <div>
          <img src={bacon} className="logo logo-spin" alt="Sizziling Bacon" />
      </div>
        </div>
      <h1>Beware The Pork-Chop!</h1>
      <div className="card">
        <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center',alignContent: 'center' }}>
          <button onClick={connect} disabled={!!connected}>
            {connected ? 'Connected' : 'Connect to Pork-Chop!'}
          </button>
          {connected && <p style={{position: 'absolute',top: -4, left:222, margin: '0 5px', color: 'lime' }}>✓</p>}
        </div>
        {true && (
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            alignItems: 'center'
          }}>
            <button onClick={() => sendCommand('w')}>Forward</button>
            <button onClick={() => sendCommand('s')}>Backward</button>
            <button onClick={() => sendCommand('q')}>Stop</button>
          </div>)}
      </div>
      <p className="footer">
            <img src={reactLogo} className="logo react" alt="React logo" />
      </p>
            </>
  )
}

export default App
