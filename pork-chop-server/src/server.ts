import express from 'express';
import { WebSocketServer } from 'ws';
import PoweredUP from 'node-poweredup';
const app = express();
const port = 3001;

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

const poweredUP = new PoweredUP();
let hub: any = null;
let motor: any = null;

// Scan for hub on startup
poweredUP.on("discover", async (discoveredHub) => {
  console.log('Hub discovered!');
  await discoveredHub.connect();
  hub = discoveredHub;
  motor = await hub.waitForDeviceAtPort("A");
  console.log('Motor ready on port A');
});

poweredUP.scan();

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    const cmd = message.toString();
    console.log('Command:', cmd);
    
    if (!motor) {
      ws.send(JSON.stringify({ error: 'Motor not ready' }));
      return;
    }
    
    switch(cmd) {
      case 'w':
        motor.setPower(50);
        break;
      case 's':
        motor.setPower(-50);
        break;
      case 'q':
        motor.brake();
        break;
    }
    
    ws.send(JSON.stringify({ status: 'ok', command: cmd }));
  });
});