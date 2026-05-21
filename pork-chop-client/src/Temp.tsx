// ArmControl.tsx
import { useState, useRef, useCallback } from 'react'
import { Cluster, Stack } from './components/layout'
import "./Temp.css"
import { usePorkChop } from './components'
// ── Types ─────────────────────────────────────────────────────────────────

type JointName = 'base' | 'shoulder' | 'elbow'
type ControlMode = 'momentary' | 'latched'

interface JointState {
  angle: number
}

interface ArmControlProps {
  onCommand?: (joint: JointName, delta: number) => void
  onEStop?: () => void
  joints?: Record<JointName, JointState>
  connected?: boolean
}

// ── Joint config ──────────────────────────────────────────────────────────

const JOINT_CONFIG = [
  { name: 'base' as JointName, label: 'Base', axis: 'horizontal' },
  { name: 'shoulder' as JointName, label: 'Shoulder', axis: 'vertical' },
  { name: 'elbow' as JointName, label: 'Elbow', axis: 'vertical' },
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
  onPress: (joint: JointName, delta: number) => void
  onRelease: (joint: JointName) => void
}

function JointCard({ label, name, angle, axis, mode, disabled, onPress, onRelease }: JointCardProps) {
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
          onPointerDown={() => onPress(name, btnA.delta)}
          onPointerUp={() => onRelease(name)}
          onPointerLeave={() => onRelease(name)}
        >
          {btnA.label}
        </button>
        <button
          className="joint-btn"
          title={btnB.title}
          disabled={disabled}
          onPointerDown={() => onPress(name, btnB.delta)}
          onPointerUp={() => onRelease(name)}
          onPointerLeave={() => onRelease(name)}
        >
          {btnB.label}
        </button>
      </div>
    </div>
  )
}

// ── ArmControl ────────────────────────────────────────────────────────────

export function ArmControl({
  onCommand,
  onEStop,
  joints = { base: { angle: 0 }, shoulder: { angle: 0 }, elbow: { angle: 0 } },

}: ArmControlProps) {
  const [mode, setMode] = useState<ControlMode>('momentary')
  const intervals = useRef<Partial<Record<JointName, ReturnType<typeof setInterval>>>>({})
  const latchedRef = useRef<Partial<Record<JointName, ReturnType<typeof setInterval>>>>({})
  const { connect, connected, disconnect, sendCommand } = usePorkChop();

  const clearAll = useCallback(() => {
    Object.values(intervals.current).forEach(clearInterval)
    Object.values(latchedRef.current).forEach(clearInterval)
    intervals.current = {}
    latchedRef.current = {}
  }, [])

  const handlePress = useCallback((joint: JointName, delta: number) => {
    if (!connected) return

    if (mode === 'momentary') {
      intervals.current[joint] = setInterval(() => {
        sendCommand?.(joint, delta)
      }, INTERVAL_MS)
    } else {
      // latched: toggle
      if (latchedRef.current[joint] !== undefined) {
        clearInterval(latchedRef.current[joint])
        delete latchedRef.current[joint]
      } else {
        latchedRef.current[joint] = setInterval(() => {
          sendCommand?.(joint, delta)
        }, INTERVAL_MS)
      }
    }
  }, [connected, mode, sendCommand])

  const handleRelease = useCallback((joint: JointName) => {
    if (mode === 'momentary') {
      clearInterval(intervals.current[joint])
      delete intervals.current[joint]
    }
    // latched: ignore release
  }, [mode])

  const handleEStop = useCallback(() => {
    clearAll()
    onEStop?.()
  }, [clearAll, onEStop])

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

          <div className="mode-toggle">
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
          </div>

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
              label={joint.label}
              angle={joints[joint.name].angle}
              axis={joint.axis}
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
