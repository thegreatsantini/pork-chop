import express from 'express';
import { WebSocketServer } from 'ws';
import PoweredUP, { Hub, TachoMotor } from "node-poweredup";
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
import fs from 'fs';
import * as readline from 'readline';


// Enable keypress events on the standard input stream
readline.emitKeypressEvents(process.stdin);

// Set the terminal to raw mode so we catch keystrokes instantly
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

// Resume the stream to start listening
process.stdin.resume();
process.stdin.setEncoding('utf8');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3001;

// const streamPath = path.join(__dirname, 'public/stream/stream.m3u8');
// const streamDir = path.join(__dirname, 'public/stream');

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

// const ffmpeg = spawn('ffmpeg', [
  // '-rtsp_transport', 'tcp',
  // '-i', 'rtsp://admin:AslanBear@192.168.68.138:554/h264Preview_01_main',
  // '-c:v', 'copy',
  // '-f', 'hls',
  // '-hls_time', '2',
  // '-hls_list_size', '3',
  // '-hls_flags', 'delete_segments+append_list',
  // '-hls_segment_filename', `${streamDir}/segment%03d.ts`,
  // `${streamDir}/stream.m3u8`
// ]);

// Make sure directory exists
// if (!fs.existsSync(streamDir)) {
//   fs.mkdirSync(streamDir, { recursive: true });
// }
// console.log('ffmpeg will write to:', streamDir);

// ffmpeg.stderr.on('data', (data: any) => {
  // console.log(`ffmpeg: ${data}`);
// });

// ffmpeg.on('close', (code: any) => {
  // console.log(`ffmpeg exited with code ${code}`);
// });


const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

const poweredUP = new PoweredUP();
let hub: Hub | null = null;
let base: TachoMotor | null = null;
let elbow: TachoMotor | null = null;
let shoulder: TachoMotor | null = null;
let pincher: TachoMotor | null = null;

// Scan for hub on startup
poweredUP.on("discover", async (discoveredHub) => {
  console.log('Hub discovered!');
  await discoveredHub.connect();
  hub = discoveredHub;
  if (hub) {
    base = await hub.waitForDeviceAtPort("A") as TachoMotor;
    console.log('Hub ready on port A')

    elbow = await hub.waitForDeviceAtPort("B") as TachoMotor;
    console.log('Elbow ready on port B');

    pincher = await hub.waitForDeviceAtPort("C") as TachoMotor;
    console.log('Pincher ready on port C');

    shoulder = await hub.waitForDeviceAtPort("D") as TachoMotor;
    console.log('Shoulder ready on port D');
  }
});

poweredUP.scan();
let activeSocket : WebSocketServer | null  = null
wss.on('connection', (ws: WebSocketServer) => {
  activeSocket = ws;
  console.log('Client connected');

  ws.on('message', (message) => {
    const cmd = message.toString();
    console.log('Command:', cmd);
    sendCmd(cmd)
  });
});

const sendCmd = (cmd:string) => {
  if ( !activeSocket || !base || !shoulder || !elbow || !pincher) {
      return;
    }

    switch (cmd) {
      case 'q':
        base.setPower(50);
        break;
      case 'e':
        base.setPower(-50);
        break;
      case 'w':
        shoulder.setPower(50);
        break;
      case 's':
        shoulder.setPower(-50);
        break;
      case 'a':
        pincher.setPower(50);
        break;
      case 'd':
        pincher.setPower(-50);
        break;
        case 'r':
        elbow.setPower(50);
        break;
      case 'f':
        elbow.setPower(-50);
        break;
      case 'stop':
        base.setPower(0);
        shoulder.setPower(0);
        elbow.setPower(0);
        pincher.setPower(0)
        break;
    }
}

console.log('Listening for keyboard inputs... Press Ctrl+C to exit.');

// Listen for the keypress event
process.stdin.on('keypress', (str, key) => {
    // Standard Ctrl+C exit handler
    if (key.ctrl && key.name === 'c') {
        process.exit();
    }

    console.log(`You pressed the "${str}" key`);
    console.log('Key details:', key);
});