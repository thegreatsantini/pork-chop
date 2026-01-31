import express from 'express';
import { WebSocketServer } from 'ws';
import PoweredUP from 'node-poweredup';
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3001;

const streamPath = path.join(__dirname, 'public/stream/stream.m3u8');
const streamDir = path.join(__dirname, 'public/stream');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.get('/test', (req, res) => {
  res.send('Server is alive');
});

app.get('/stream-debug', (req, res) => {
  const streamPath = "/Users/lsantini/Code/Timmy/pork-chop-server/src/public/stream" //path.join(__dirname, 'public/stream/stream.m3u8');
  res.json({
    exists: fs.existsSync(streamPath),
    path: streamPath,
    files: fs.readdirSync(path.join(__dirname, 'public/stream'))
  });
});
app.use('/stream', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(path.join(__dirname, 'public/stream')));

const ffmpeg = spawn('ffmpeg', [
  '-rtsp_transport', 'tcp',
  '-i', 'rtsp://admin:AslanBear@192.168.68.138:554/h264Preview_01_main',
  '-c:v', 'copy',
  '-f', 'hls',
  '-hls_time', '2',
  '-hls_list_size', '3',
  '-hls_flags', 'delete_segments+append_list',
  '-hls_segment_filename', `${streamDir}/segment%03d.ts`,
  `${streamDir}/stream.m3u8`
]);

// Make sure directory exists
if (!fs.existsSync(streamDir)) {
  fs.mkdirSync(streamDir, { recursive: true });
}
console.log('ffmpeg will write to:', streamDir);

ffmpeg.stderr.on('data', (data: any) => {
  // console.log(`ffmpeg: ${data}`);
});

ffmpeg.on('close', (code: any) => {
  // console.log(`ffmpeg exited with code ${code}`);
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

    switch (cmd) {
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