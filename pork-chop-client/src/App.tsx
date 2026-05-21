import { useRef, useState } from 'react'
import reactLogo from "/GitHub_Invertocat_White.png"
import bacon from '/canvas.png'
import { Container, Stack, Cluster, Grid } from './components/layout'

import './App.css'
import { useWebSocket } from './components/porkchop/hooks'
import { WebSocketProvider } from './components'
import ConnectButton from './components/porkchop/ConnectButton'
import JointCard from './components/porkchop/JointCard'
import {ArmControl} from "./Temp"
function App() {
  return (
    <WebSocketProvider>
      {/* <div className="sizzle-app">
        <header className="sizzle-panel__header">
          <Cluster justify='between'>
            <h1>PorkChop</h1>
            <ConnectButton />
          </Cluster>
        </header> */}

        <main className="sizzle-main">
          {/* <Container> */}
            {/* <Stack gap="lg"> */}
              <ArmControl  />
            {/* </Stack> */}
          {/* </Container> */}
        </main>
      {/* </div>x */}
    </WebSocketProvider>
  )
}


export default App