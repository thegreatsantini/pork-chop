import express from 'express';
import { WebSocketServer } from 'ws';
import PoweredUP from 'node-poweredup';
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3001;

app.use('/stream', express.static(path.join(__dirname, 'public/stream')));

const ffmpeg = spawn('ffmpeg', [
  '-rtsp_transport', 'tcp',
  '-i', 'rtsp://admin:AslanBear@192.168.68.138:554/h264Preview_01_main',
  '-c:v', 'copy', // Copy video codec (no re-encoding = faster)
  '-f', 'hls',
  '-hls_time', '2',
  '-hls_list_size', '3',
  '-hls_flags', 'delete_segments+append_list',
  '-hls_segment_filename', 'public/stream/segment%03d.ts',
  'public/stream/stream.m3u8'
]);

ffmpeg.stderr.on('data', (data: any) => {
  console.log(`ffmpeg: ${data}`);
});

ffmpeg.on('close', (code: any) => {
  console.log(`ffmpeg exited with code ${code}`);
});


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