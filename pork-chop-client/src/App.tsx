import './App.css'
import { WebSocketProvider } from './components'
import { ArmControl } from "./Temp"
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
        <ArmControl />
        {/* </Stack> */}
        {/* </Container> */}
      </main>
      {/* </div>x */}
    </WebSocketProvider>
  )
}


export default App