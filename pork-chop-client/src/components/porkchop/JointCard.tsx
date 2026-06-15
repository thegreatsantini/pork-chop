import { Cluster, Container } from '../layout';
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons"
function JointCard({ title = 'Base' }) {

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