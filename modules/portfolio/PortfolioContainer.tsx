import { useEffect } from "react";

import Portfolio from "./Portfolio";
import { usePortfolio } from "../../hooks/portfolio/usePortfolio";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTrading, useTradingStore } from "../../store/TradingStore";

const PortfolioContainer: React.FC<any> = () => {

    const { mutateAsync: fetchPortfolio } = usePortfolio();

    const {
        smartAccountAddress,
    }: iGlobal = useGlobalStore((state) => state);

    const {
        selectedFromNetwork,
    }: iTrading = useTradingStore((state) => state);

    useEffect(() => {
        const  fetch = async (chainId: string, address: string) => {
            await fetchPortfolio({chainId, address: "0xb50685c25485CA8C520F5286Bbbf1d3F216D6989"})
        }

        if (selectedFromNetwork.chainId || smartAccountAddress) {
            fetch(selectedFromNetwork.chainId, smartAccountAddress);
        }
    }, [selectedFromNetwork]);

    return (
        <Portfolio />
    )  
};
export default PortfolioContainer;
