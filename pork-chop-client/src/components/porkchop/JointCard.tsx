import { Cluster, Container, Grid } from '../layout';
import { usePorkChop } from './context';
import { ArrowLeftIcon, ArrowRightIcon, DotFilledIcon } from "@radix-ui/react-icons"
function JointCard({ title = 'Base' }) {
    const { connect, connected, disconnect } = usePorkChop();

    return (
        <Cluster>
            {
                title
            }
            <Container >
                <button><ArrowLeftIcon /></button>
                <button><ArrowRightIcon /></button>

            </Container>

        </Cluster>
    );
}

export default JointCard;