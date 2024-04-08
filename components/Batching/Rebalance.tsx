import React, { useEffect, useState } from "react";
import SelectionBar from "../SelectionBar/SelectionBar";
import {
    iRebalance,
    iRebalanceData,
    iSelectedNetwork,
    iTrading,
    useRebalanceStore,
    useTradingStore,
} from "../../store/TradingStore";
import { protocolNames } from "../../utils/data/protocols";
import { IoIosAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import CustomCheckbox from "../common/CustomCheckbox";
import SelectErc20 from "./SelectErc20";
import Button from "../Button/Button";
import { BigNumber as bg } from "bignumber.js";

bg.config({ DECIMAL_PLACES: 10 });

interface iTokenSelectionProps {
    onTokenSelect: (
        network: iSelectedNetwork,
        protocol: string,
        token: string,
        percentage: number,
        amount: number
    ) => void;
    index: number;
    splitEqually: boolean;
    percentages: number[];
    handlePercentageChange: (index: number, event: any) => void;
}

const TokenSelection: React.FC<iTokenSelectionProps> = ({
    percentages,
    handlePercentageChange,
    index,
    splitEqually,
    onTokenSelect,
}) => {
    const { isModalOpen, setIsModalOpen }: iRebalance = useRebalanceStore((state) => state);
    const { amountIn }: iTrading = useTradingStore((state) => state);

    const [selectedNetwork, setSelectedNetwork] = useState<iSelectedNetwork>({
        key: "",
        chainName: "",
        chainId: "",
        icon: "",
    });
    const [selectedProtocol, setSelectedProtocol] = useState<string>("");
    const [selectedToken, setSelectedToken] = useState<string>("");

    const [amount, setAmount] = useState<number>(0);

    const handleNetworkSelect = (network: iSelectedNetwork) => {
        setSelectedNetwork(network);
    };

    const handleProtocolSelect = (protocol: string) => {
        setSelectedProtocol(protocol);
    };

    const handleTokenSelect = (token: string) => {
        setSelectedToken(token);
        if (selectedNetwork) {
            onTokenSelect(selectedNetwork, selectedProtocol, token, percentages[index], amount);
            setIsModalOpen(null);
        } else {
            console.error("Please select a network.");
        }
    };

    useEffect(() => {
        // Calculate new amount based on updated percentages
        const updatedAmount: number | any = calculateAmount(percentages[index]).toFixed(2);

        // Update state with the new amount and percentage
        setAmount(updatedAmount);
        onTokenSelect(selectedNetwork, selectedProtocol, selectedToken, percentages[index], updatedAmount);
    }, [percentages[index], amountIn, selectedToken]);

    const calculateAmount = (percentage) => {
        return (percentage / 100) * amountIn;
    };

    return (
        <div>
            <SelectionBar
                handleSelectionMenu={() => setIsModalOpen(index)}
                titlePlaceholder="From"
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
                    className={`flex items-center gap-1 relative text-N0 ${
                        !splitEqually && "bg-[rgba(225,225,225,.3)]"
                    } border border-gray-300 rounded py-2 px-4 w-44`}
                >
                    <input
                        type="number"
                        className={`flex-1 w-32 bg-transparent outline-none placeholder-N80`}
                        placeholder="Percentage"
                        value={percentages[index]}
                        onChange={(event) => handlePercentageChange(index, event)}
                        disabled={splitEqually}
                    />
                    <span className={` text-lg`}>%</span>
                </div>
                <span className="text-N0">${calculateAmount(percentages[index]).toFixed(2)}</span>
            </div>

            <SelectErc20
                index={index}
                isOpen={isModalOpen === index}
                onClose={() => setIsModalOpen(null)}
                onNetworkSelect={handleNetworkSelect}
                onProtocolSelect={handleProtocolSelect}
                onTokenSelect={handleTokenSelect}
                selectedProtocol={selectedProtocol}
                selectedNetwork={selectedNetwork}
            />
        </div>
    );
};

interface iRebalanceProps {
    addRebalancedBatches: (
        isSCW: boolean,
        selectedToNetwork: iSelectedNetwork,
        selectedToProtocol: string,
        selectedToToken: string,
        rePercentage: number,
        amount: number,
        i: number
    ) => void;
}

export const Rebalance: React.FC<iRebalanceProps> = ({ addRebalancedBatches }) => {
    const {
        rebalanceData,
        setRebalanceData,
        addNewEmptyData,
        removeDataAtIndex,
        splitEqually,
        setSplitEqually,
        percentages,
        setPercentages,
    }: iRebalance = useRebalanceStore((state) => state);
    // console.log("rebalanceData", rebalanceData);

    const handleTokenSelect = (
        index: number,
        network: iSelectedNetwork,
        protocol: string,
        token: string,
        percentage: number,
        amount: number
    ) => {
        setRebalanceData(index, { network, protocol, token, percentage, amount });
        handleSplitEquallyChange({ target: { checked: splitEqually } });
    };
    useEffect(() => {}, [percentages]);

    const {} = useRebalanceStore();

    const handleAddDiv = () => {
        const newData: iRebalanceData = {
            network: { key: "", chainName: "", chainId: "", icon: "" },
            protocol: "erc20",
            token: "",
            percentage: 0,
            amount: 0,
        };

        addNewEmptyData();

        const numTokens = rebalanceData.length + 1;
        const equalPercentage = 100 / numTokens;
        setPercentages(Array(numTokens).fill(equalPercentage));
    };

    const handleRemoveDiv = (index: number) => {
        removeDataAtIndex(index);

        const updatedPercentages = [...percentages];
        updatedPercentages.splice(index, 1);
        setPercentages(updatedPercentages);

        // Recalculate percentages if split equally
        if (splitEqually) {
            const numTokens = rebalanceData.length;
            const equalPercentage = 100 / numTokens;
            setPercentages(Array(numTokens).fill(equalPercentage));
        }
    };

    const handleSplitEquallyChange = (event) => {
        setSplitEqually(event.target.checked);
        if (event.target.checked) {
            const numTokens = rebalanceData.length;
            const equalPercentage = 100 / numTokens;
            setPercentages(Array(numTokens).fill(equalPercentage));
        }
    };

    const handlePercentageChange = (index, event) => {
        const newPercentage = parseFloat(event.target.value);
        const remainingPercentage = 100 - calculateTotalPercentage() + percentages[index];
        if (newPercentage > remainingPercentage) {
            // Prevent entering percentage more than available
            toast.error(`You can't enter more than ${remainingPercentage}%`);
            return;
        }
        const updatedPercentages = [...percentages];
        updatedPercentages[index] = newPercentage;
        setPercentages(updatedPercentages);
    };

    const calculateTotalPercentage = () => {
        return percentages.reduce((total, percentage) => total + percentage, 0);
    };

    // async function processToStates() {
    //     for (const state of rebalanceData) {
    //         const { network, protocol, token, percentage, amount } = state;
    //         await addRebalancedBatches(true, network, protocol, token, percentage, amount);
    //     }
    // }

    // async function processToStates() {
    //     for (const state of rebalanceData) {
    //         const { network, protocol, token, percentage, amount } = state;
    //         addRebalancedBatches(true, network, protocol, token, percentage, amount);
    //     }
    // }

    // async function processToStates() {
    //     await Promise.all(rebalanceData.map(async (state) => {
    //         const { network, protocol, token, percentage, amount } = state;
    //         await addRebalancedBatches(true, network, protocol, token, percentage, amount);
    //     }));
    // }

    async function processToStates() {
        // Process the first item
        // const firstItem = rebalanceData[0];
        // const {
        //     network: firstNetwork,
        //     protocol: firstProtocol,
        //     token: firstToken,
        //     percentage: firstPercentage,
        //     amount: firstAmount,
        // } = firstItem;
        // await addRebalancedBatches(true, firstNetwork, firstProtocol, firstToken, firstPercentage, firstAmount, i = 0);

        // Wait for 4 seconds
        await delay(2000);

        // Process the remaining items starting from the second one
        for (let i = 0; i < rebalanceData.length; i++) {
            const { network, protocol, token, percentage, amount } = rebalanceData[i];
            await addRebalancedBatches(true, network, protocol, token, percentage, amount, i);
        }
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-3">
                    {Array.isArray(rebalanceData) &&
                        rebalanceData.map((item, index) => (
                            <div key={index} className="w-full relative rounded-lg bg-[rgba(132,144,251,.4)]">
                                <TokenSelection
                                    onTokenSelect={(network, protocol, token, percentage, amount) =>
                                        handleTokenSelect(index, network, protocol, token, percentage, amount)
                                    }
                                    index={index}
                                    splitEqually={splitEqually}
                                    percentages={percentages}
                                    handlePercentageChange={handlePercentageChange}
                                />
                                {index !== 0 && (
                                    <button
                                        className="text-N0 absolute top-3 right-3"
                                        onClick={() => handleRemoveDiv(index)}
                                    >
                                        <RxCross2 size="20px" />
                                    </button>
                                )}
                            </div>
                        ))}

                    <div className="flex justify-between items-center w-full mt-2">
                        <button
                            className="flex items-center gap-1 text-N0 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded-md"
                            onClick={handleAddDiv}
                        >
                            Add More
                            <IoIosAdd size="20px" />
                        </button>
                        <div className="inline-flex items-center relative">
                            <CustomCheckbox checked={splitEqually} onChange={handleSplitEquallyChange} />
                            <span className="ml-2 text-N0 ">Split Equally</span>
                        </div>
                    </div>
                    <Button handleClick={() => processToStates(true)} customStyle="" innerText="Rebalance" />
                </div>
            </div>
        </div>
    );
};
