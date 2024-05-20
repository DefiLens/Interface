import React, { useEffect, useState } from "react";
import { iRebalance, iSelectedNetwork, iTrading, useRebalanceStore, useTradingStore } from "../../store/TradingStore";
import { IoIosAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import CustomCheckbox from "../common/CustomCheckbox";
import { BigNumber as bg } from "bignumber.js";
import RebalanceTokenSelection from "./RebalanceTokenSelection";

bg.config({ DECIMAL_PLACES: 10 });

export const Rebalance: React.FC = () => {
    const {
        rebalanceData,
        setRebalanceData,
        addNewEmptyData,
        removeDataAtIndex,
        splitEqually,
        setSplitEqually,
        percentages,
        setPercentages,
        isRebalance,
        removeAllData,
        clearRebalanceData,
    }: iRebalance = useRebalanceStore((state) => state);

    const { addToBatchLoading }: iTrading = useTradingStore((state) => state);
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

    const handleAddDiv = () => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }

        addNewEmptyData();

        if (!splitEqually) {
            return;
        }

        const numTokens = rebalanceData.length + 1;
        const equalPercentage = parseFloat((100 / numTokens).toFixed(2)); // Round to one decimal place
        console.log(equalPercentage, Array(numTokens).fill(equalPercentage));
        setPercentages(Array(numTokens).fill(equalPercentage));
    };

    const handleRemoveDiv = (index: number) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        removeDataAtIndex(index);

        const updatedPercentages = [...percentages];
        updatedPercentages.splice(index);
        setPercentages(updatedPercentages);

        // Recalculate percentages if split equally
        if (splitEqually) {
            const numTokens = rebalanceData.length;
            const equalPercentage = 100 / numTokens;
            setPercentages(Array(numTokens).fill(equalPercentage));
        }
    };

    const handleSplitEquallyChange = (event) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        setSplitEqually(event.target.checked);
        if (event.target.checked) {
            // const numTokens = rebalanceData.length;
            // const equalPercentage = 100 / numTokens;
            // setPercentages(Array(numTokens).fill(equalPercentage));

            const numTokens = rebalanceData.length;
            const equalPercentage = parseFloat((100 / numTokens).toFixed(2)); // Round to one decimal place
            setPercentages(Array(numTokens).fill(equalPercentage));
        }
    };

    const handlePercentageChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newPercentage = parseFloat(event.target.value);
        const remainingPercentage = 100 - calculateTotalPercentage() + percentages[index];
        if (newPercentage > remainingPercentage) {
            // Prevent entering percentage more than available
            toast.error(`You can't enter more than ${remainingPercentage.toFixed(2)}%`);
            return;
        }
        const updatedPercentages = [...percentages];
        updatedPercentages[index] = parseFloat(newPercentage.toFixed(2));
        setPercentages(updatedPercentages);
    };

    const calculateTotalPercentage = () => {
        return percentages.reduce((total, percentage) => total + percentage, 0);
    };

    useEffect(() => {
        if (clearRebalanceData) {
            removeAllData();
            addNewEmptyData();
        }
    }, [isRebalance, clearRebalanceData]);

    const [showError, setShowError] = useState<boolean>(false);
    const [hasTokenPercentage, setHasTokenPercentage] = useState<boolean>(false);

    type Percentage = number;
    const validateTotalPercentage = (percentages: Percentage[], rebalanceData: any[]): boolean => {
        const total = rebalanceData.reduce((sum, percentage) => sum + percentage.percentage, 0);
        if (total < 99.5 || total > 100) {
            return false;
        }

        const hasAllTokens = rebalanceData.every((token, index) => percentages[index] > 0);
        return hasAllTokens;
    };
    const validatePercentageExists = (data: any[]): boolean => {
        return data.every((item) => typeof item.percentage === "number" && item.percentage > 0);
    };

    useEffect(() => {
        setShowError(!validateTotalPercentage(percentages, rebalanceData));
        setHasTokenPercentage(!validatePercentageExists(rebalanceData));
    }, [percentages, rebalanceData]);

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-3">
                    {rebalanceData?.map((item, index) => (
                        <div key={index} className="w-full relative rounded-lg bg-[rgba(132,144,251,.4)]">
                            <RebalanceTokenSelection
                                onTokenSelect={(network, protocol, token, percentage, amount) =>
                                    handleTokenSelect(index, network, protocol, token, percentage, amount)
                                }
                                network={item.network}
                                index={index}
                                protocol={item.protocol}
                                token={item.token}
                                amount={item.amount}
                                percentages={percentages}
                                splitEqually={splitEqually}
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
                    {showError && (
                        <div className="w-full bg-[rgba(255,0,0,.2)] rounded-md p-2 text-N0 text-center">
                            Total percentage must be approximately 100%
                        </div>
                    )}
                    {hasTokenPercentage && (
                        <div className="w-full bg-[rgba(255,0,0,.2)] rounded-md p-2 text-N0 text-center">
                            Each token must have a percentage assigned
                        </div>
                    )}

                    <div className="flex justify-between items-center w-full mt-2">
                        <div className="inline-flex items-center relative">
                            <CustomCheckbox checked={splitEqually} onChange={handleSplitEquallyChange} />
                            <span className="ml-2 text-N0 ">Split Equally</span>
                        </div>
                        <button
                            className="flex items-center justify-center gap-1 text-N0 bg-GR1 hover:scale-95 transition duration-300 ease-in-out font-bold h-8 w-[115px] rounded-md"
                            onClick={handleAddDiv}
                        >
                            Add More
                            <IoIosAdd size="25px" className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
