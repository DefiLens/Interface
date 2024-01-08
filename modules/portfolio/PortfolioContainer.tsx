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
            const test = await fetchPortfolio({chainId, address})
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
