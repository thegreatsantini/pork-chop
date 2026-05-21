import { Cluster, Container, Grid } from '../layout';
import { usePorkChop } from './context';
import { DotFilledIcon } from "@radix-ui/react-icons"
function ConnectButton() {
    const { connect, connected, disconnect } = usePorkChop();
    {/* TODO add and use theme context */ }
    return (
        <Cluster>
            {
                connected ?
                    <>
                        <DotFilledIcon color='#50B04D' />
                        <p style={{ color: '#6a6a6a' }}>connected</p>
                    </>
                    : null
            }
            <button className="primary" onClick={() => connected ? disconnect() : connect()}>
                {!connected ? "Connect" : "Disconnect"}
            </button>
        </Cluster>
    );
}

export default ConnectButton;