// ArmControl.tsx
import { useState, useRef, useCallback } from 'react'
import { Cluster } from './components/layout'
import "./Temp.css"
import { usePorkChop } from './components'
// ── Types ─────────────────────────────────────────────────────────────────

type JointName = 'base' | 'shoulder' | 'elbow' | 'pincher'
type ControlMode = 'momentary' | 'latched'

interface JointState {
  angle: number
}

interface ArmControlProps {
  onCommand?: (joint: JointName, delta: number) => void
  joints?: Record<JointName, JointState>
  connected?: boolean
}

// ── Joint config ──────────────────────────────────────────────────────────

const JOINT_CONFIG = [
  { name: 'base' as JointName, label: 'Base', axis: 'horizontal', values: { left: 'q', right: 'e' } },
  { name: 'shoulder' as JointName, label: 'Shoulder', axis: 'vertical', values: { left: 'w', right: 's' } },
  { name: 'elbow' as JointName, label: 'Elbow', axis: 'vertical', values: { left: 'r', right: 'f' } },
  { name: 'pincher' as JointName, label: 'Pincher', axis: 'horizontal', values: { left: 'a', right: 'd' } },
]

const STEP = 5
const INTERVAL_MS = 100

// ── JointCard ─────────────────────────────────────────────────────────────

interface JointCardProps {
  label: string
  name: JointName
  angle: number
  axis: 'horizontal' | 'vertical'
  mode: ControlMode
  disabled: boolean
  onPress: (joint: string, delta: number) => void
  onRelease: (joint: string) => void
  values: { left: string, right: string }
}

function JointCard({ label, values, angle, axis, disabled, onPress, onRelease }: JointCardProps) {
  const isHorizontal = axis === 'horizontal'

  const btnA = isHorizontal
    ? { label: '◄', delta: -STEP, title: 'Rotate left' }
    : { label: '▲', delta: STEP, title: 'Up' }

  const btnB = isHorizontal
    ? { label: '►', delta: STEP, title: 'Rotate right' }
    : { label: '▼', delta: -STEP, title: 'Down' }

  const btnGroupClass = isHorizontal ? 'joint-btn-group--h' : 'joint-btn-group--v'

  return (
    <div className="joint-card">
      <div className="joint-card__label">{label}</div>
      <div className="joint-card__readout">
        {angle}<span className="joint-card__unit">°</span>
      </div>
      <div className={`joint-btn-group ${btnGroupClass}`}>
        <button
          className="joint-btn"
          title={btnA.title}
          disabled={disabled}
          onPointerDown={() => onPress(values.left, btnA.delta)}
          onPointerUp={() => onRelease('')}
          onPointerLeave={() => onRelease('')}
        >
          {btnA.label}
        </button>
        <button
          className="joint-btn"
          title={btnB.title}
          disabled={disabled}
          onPointerDown={() => onPress(values.right, btnB.delta)}
          onPointerUp={() => onRelease('')}
          onPointerLeave={() => onRelease('')}
        >
          {btnB.label}
        </button>
      </div>
    </div>
  )
}

// ── ArmControl ────────────────────────────────────────────────────────────

export function ArmControl({
  joints = { base: { angle: 0 }, shoulder: { angle: 0 }, elbow: { angle: 0 }, pincher: { angle: 0 } },

}: ArmControlProps) {
  const [mode, setMode] = useState<ControlMode>('momentary')
  const { connect, connected, sendCommand } = usePorkChop();

  const clearAll = useCallback(() => {
    
    
  }, [])

  const handlePress = useCallback((joint: string) => {
    if (!connected) return
        sendCommand?.(joint)
  }, [connected, mode, sendCommand])

  const handleRelease = useCallback((joint: string) => {
    console.log('REALSED')
  }, [])

  const handleEStop = useCallback(() => {
    clearAll()
    sendCommand('stop')
  }, [clearAll])

  const handleModeChange = useCallback((m: ControlMode) => {
    clearAll()
    setMode(m)
  }, [clearAll])

  return (
    <div className="arm-control">

      {/* ── Header ── */}
      <div className="arm-control__header">
        <span className="arm-control__title">PORKCHOP</span>

        <Cluster gap="sm">
          <div className="arm-status">
            <span className={`arm-status__dot ${connected ? 'arm-status__dot--on' : ''}`} />
            <span className="arm-status__text">{connected ? 'Connected' : 'Disconnected'}</span>
          </div>

          {/* <div className="mode-toggle">
            <button
              className={`mode-toggle__btn ${mode === 'momentary' ? 'mode-toggle__btn--active' : ''}`}
              onClick={() => handleModeChange('momentary')}
            >
              Momentary
            </button>
            <button
              className={`mode-toggle__btn ${mode === 'latched' ? 'mode-toggle__btn--active' : ''}`}
              onClick={() => handleModeChange('latched')}
            >
              Latched
            </button>
          </div> */}

          <button className="estop-btn estop-btn--sm" onClick={connect}>
            Connect
          </button>
        </Cluster>
      </div>

      {/* ── Joint cards ── */}
      <div className="arm-control__body">
        <div className="joints-grid">
          {JOINT_CONFIG.map(joint => (
            <JointCard
              key={joint.name}
              name={joint.name}
              values={joint.values}
              label={joint.label}
              angle={joints[joint.name].angle}
              axis={joint.axis as "horizontal" | "vertical"}
              mode={mode}
              disabled={!connected}
              onPress={handlePress}
              onRelease={handleRelease}
            />
          ))}
        </div>

        {/* ── Big E-Stop ── */}
        <button className="estop-btn estop-btn--lg" onClick={handleEStop}>
          ⬛ E-STOP
        </button>
      </div>

    </div>
  )
}
