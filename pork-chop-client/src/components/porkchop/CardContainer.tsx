import { Cluster, Container, Grid } from '../layout';
import { usePorkChop } from './context';
import { DotFilledIcon } from "@radix-ui/react-icons"
function CardContainer() {
    const { connect, connected, disconnect } = usePorkChop();
    {/* TODO add and use theme context */ }
    return (
        <Cluster>

        </Cluster>
    );
}

export default CardContainer;