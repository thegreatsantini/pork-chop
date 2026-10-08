// ===== Pork Chop server patch: accept JSON motor commands =====
// Lets Python send {"type":"motor","port":"elbow","value":0.3}
// Keyboard-letter commands ('q', 'w', 'stop', ...) still work.

// 1) REPLACE your ws.on('message', ...) block with this:
  ws.on('message', (message) => {
    const raw = message.toString();
    console.log('Command:', raw);
    try {
      const msg = JSON.parse(raw);
      if (msg.type === 'motor') {
        setMotor(msg.port, msg.value);
        return;
      }
    } catch {
      // not JSON - fall through to letter commands
    }
    sendCmd(raw);
  });

// 2) ADD this function next to sendCmd:
const setMotor = (port: string, value: number) => {
  const motors: Record<string, TachoMotor | null> = { base, shoulder, elbow, pincher };
  const motor = motors[port];
  if (!motor) return;  // unknown joint or hub not ready
  const v = Math.max(-1, Math.min(1, Number(value) || 0));
  motor.setPower(Math.round(v * 100));  // LEGO power is -100..100
};
