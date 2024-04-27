import { BigNumber as bg } from "bignumber.js";
import Header from "./Header";
import { useSwitchOnSpecificChain } from "../../hooks/useSwitchOnSpecificChain";

bg.config({ DECIMAL_PLACES: 5 });

const HeaderContainer: React.FC = () => {
    const { mutateAsync: switchOnSpecificChain } = useSwitchOnSpecificChain();
    return <Header switchOnSpecificChain={switchOnSpecificChain} />;
};

export default HeaderContainer;
