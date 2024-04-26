import { FC, useEffect, memo, useState } from "react";
import SelectionBar from "../SelectionBar/SelectionBar";
import { iRebalance, iSelectedNetwork, iTrading, useRebalanceStore, useTradingStore } from "../../store/TradingStore";
import { protocolNames } from "../../utils/data/protocols";
// import SelectErc20 from "./SelectErc20";
import TokenSelectionMenu from "./TokenSelectionMenu";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { getTokenListByChainId } from "../../utils/helper";
import toast from "react-hot-toast";
import { cn } from "../../lib/utils";

export interface iRebalanceTokenSelection {
    onTokenSelect: (
        network: iSelectedNetwork,
        protocol: string,
        token: string,
        percentage: number,
        amount: number
    ) => void;
    index: number;
    network: iSelectedNetwork;
    protocol: string;
    token: string;
    amount: number;
    splitEqually: boolean;
    percentages: number[];
    handlePercentageChange: (index: number, event: any) => void;
}

export const RebalanceTokenSelection: FC<iRebalanceTokenSelection> = memo(({
    percentages,
    handlePercentageChange,
    index,
    network,
    protocol,
    token,
    splitEqually,
    onTokenSelect,
}) => {
    const { amountIn, toTokensData, setToTokensData, addToBatchLoading }: iTrading = useTradingStore((state) => state);
    const { rebalanceData, clearRebalanceData }: iRebalance = useRebalanceStore((state) => state);
    const [selectedNetwork, setSelectedNetwork] = useState<iSelectedNetwork>({
        key: "",
        chainName: "",
        chainId: "",
        icon: "",
    });
    const [selectedProtocol, setSelectedProtocol] = useState<string>("");
    const [selectedToken, setSelectedToken] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [showSelectionMenu, setShowSelectionMenu] = useState<number | null>(null);
    const [filterToToken, setFilterToToken] = useState("");
    const [filterToAddress, setFilterToAddress] = useState("");

    useEffect(() => {
        //update states selectedNetwork, selectedProtocol, selectedToken, amount
        setSelectedNetwork(network);
        setSelectedProtocol(protocol);
        setSelectedToken(token);
        setAmount(amount);
    }, [network, protocol, token, amount]);

    useEffect(() => {
        if (clearRebalanceData) {
            console.log("clearRebalanceData", clearRebalanceData);
            setSelectedNetwork({
                key: "",
                chainName: "",
                chainId: "",
                icon: "",
            });
            setSelectedProtocol("");
            setSelectedToken("");
            setAmount(0);
            console.log("rebalanceData", rebalanceData);
        }
    }, [clearRebalanceData]);

    const handleNetworkSelect = (network: iSelectedNetwork) => {
        setSelectedNetwork(network);
    };

    const handleProtocolSelect = (_protocol: string) => {
        if (selectedProtocol === _protocol) {
            setSelectedProtocol("");
        } else {
            setSelectedProtocol(_protocol);
        }
    };

    const calculateAmount = (percentage: number): number => {
        const rawAmount: number = isNaN(percentage) ? 0 : (percentage / 100) * amountIn;
        const roundedAmount: number = Math.floor(rawAmount * 100) / 100; // Round down to two decimal places
        return roundedAmount;
    };

    const onChangeselectedToProtocol = async (protocol: string, network: iSelectedNetwork, setTokensData: any) => {
        if (protocol && protocol === "erc20") {
            const filteredTokens = getTokenListByChainId(network.chainId, UNISWAP_TOKENS);
            setTokensData(filteredTokens);
        }
    };

    const handleTokenSelect = (token: string) => {
        setSelectedToken(token);
        if (selectedNetwork) {
            onTokenSelect(selectedNetwork, selectedProtocol, token, percentages[index], amount);
            setShowSelectionMenu(null);
        } else {
            console.error("Please select a network.");
        }
    };

    const handleShowSelectionMenu = (index: number | null) => {
        if (index == undefined || index < 0) return;
        if (addToBatchLoading) {
            toast.error("Please wait, transaction loading.");
            return;
        }

        setShowSelectionMenu((prevIndex) => {
            // console.log("prevIndex selection menu", prevIndex);
            return prevIndex === index ? null : index;
        });
    };

    useEffect(() => {
        onChangeselectedToProtocol(selectedProtocol, selectedNetwork, setToTokensData);
    }, [selectedProtocol, selectedNetwork]);

    useEffect(() => {
        // Calculate new amount based on updated percentages
        const updatedAmount: number | any = calculateAmount(percentages[index]);

        // Update state with the new amount and percentage
        setAmount(updatedAmount);
        onTokenSelect(selectedNetwork, selectedProtocol, selectedToken, percentages[index], updatedAmount);
    }, [percentages[index], amountIn, selectedToken, rebalanceData.length]);

    return (
        <>
            <SelectionBar
                handleSelectionMenu={() => handleShowSelectionMenu(index)}
                titlePlaceholder={`To Batch - ${index + 1}`}
                iconCondition={selectedNetwork?.chainName && selectedProtocol}
                mainIcon={selectedNetwork?.icon}
                subIcon={
                    protocolNames[selectedNetwork?.chainId]?.key.find((entry: any) => entry.name == selectedProtocol)
                        ?.icon
                }
                valueCondition={selectedNetwork?.chainName}
                valuePlaceholder="Select Chain and token"
                mainValue={selectedNetwork?.key}
                firstSubValue={selectedProtocol}
                secondSubValue={selectedToken}
                showBg={false}
            />
            <div className="flex justify-between items-center mt-2  px-5 pt-1 pb-3">
                <div
                    className={cn(
                        "flex items-center gap-1 relative text-N0 border-b border-gray-300 rounded-md py-1 px-2 max-w-30",
                        !splitEqually && "bg-[rgba(225,225,225,.3)]",
                    )}
                >
                    <input
                        type="number"
                        className="flex-1 w-32 bg-transparent rounded-lg outline-none placeholder-N80"
                        placeholder="Percentage"
                        value={isNaN(percentages[index]) ? "" : percentages[index]}
                        onChange={(event) => handlePercentageChange(index, event)}
                        disabled={splitEqually}
                    />
                    <span className="text-lg">%</span>
                </div>
                <span className="text-N0">{calculateAmount(percentages[index])}</span>
            </div>
            <TokenSelectionMenu
                showMenu={showSelectionMenu === index}
                closeMenu={() => handleShowSelectionMenu(index)}
                handleSelectNetwork={handleNetworkSelect}
                selectedNetwork={selectedNetwork}
                onChangeProtocol={handleProtocolSelect}
                filterToken={filterToToken}
                setFilterToken={setFilterToToken}
                filterAddress={filterToAddress}
                setFilterAddress={setFilterToAddress}
                tokensData={toTokensData}
                selectedProtocol={selectedProtocol}
                onChangeToken={handleTokenSelect}
                protocolNames={protocolNames}
                title={`Select token for Rebalancing`}
            />
        </>
    );
});
