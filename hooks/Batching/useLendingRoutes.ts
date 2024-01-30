import { toast } from "react-hot-toast";
import { BigNumber, ethers } from "ethers";
import { useMutation } from "@tanstack/react-query";
import { useUniswap } from "../swaphooks/useUniswap";
import { useApprove } from "../utilsHooks/useApprove";
import { decreasePowerByDecimals } from "../../utils/helper";
import { useCalculateGasCost } from "../utilsHooks/useCalculateGasCost";
import { iBatchFlowData, iTrading, useTradingStore } from "../../store/TradingStore";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { uniswapSwapRouterByChainId } from "../../utils/data/protocols";

async function addToBatchFlow(
    fromChainId,
    toChainId,
    fromProtocol,
    tokenInName,
    tokenOutName,
    amount,
    fromTokenDecimal,
    actionType
) {
    let batchFlow: iBatchFlowData = {
        fromChainId: fromChainId,
        toChainId: toChainId,
        protocol: fromProtocol,
        tokenIn: tokenInName,
        tokenOut: tokenOutName,
        amount: await decreasePowerByDecimals(amount.toString(), fromTokenDecimal),
        action: actionType,
    };
    return batchFlow;
}

async function lending(tokenObject, amount, address) {
    try {
        const to = tokenObject.abiDetails.contractAddress;
        const abiInterface = new ethers.utils.Interface([tokenObject.abiDetails.depositAbi]);
        const txData = abiInterface.encodeFunctionData("supply", [
            tokenObject.nativeTokenDetails.nativeToken,
            amount,
            address,
            0,
        ]);
        const tx = { to: to, data: txData };
        return tx;
    } catch (error) {
        console.log("lending-error: ", error);
    }
}

async function withdraw(tokenObject, amount, address) {
    try {
        const to = tokenObject.abiDetails.contractAddress;
        const abiInterface = new ethers.utils.Interface([tokenObject.abiDetails.withdrawAbi]);
        const txData = abiInterface.encodeFunctionData("withdraw", [
            tokenObject.nativeTokenDetails.nativeToken,
            amount,
            address,
        ]);
        const tx = { to: to, data: txData };
        return tx;
    } catch (error) {
        console.log("withdraw-error: ", error);
    }
}

async function borrow(tokenObject, amount, address) {
    try {
        const to = tokenObject.abiDetails.contractAddress;
        let abiInterface = new ethers.utils.Interface([tokenObject.abiDetails.borrowAbi]);
        const txData = abiInterface.encodeFunctionData("borrow", [
            tokenObject.nativeTokenDetails.nativeToken,
            amount,
            2,
            0,
            address,
        ]);
        const tx = { to: to, data: txData };
        return tx;
    } catch (error) {
        console.log("borrow-error: ", error);
    }
}

async function repay(tokenObject, amount, address) {
    try {
        const to = tokenObject.abiDetails.contractAddress;
        let abiInterface = new ethers.utils.Interface([tokenObject.abiDetails.repayAbi]);
        const txData = abiInterface.encodeFunctionData("repay", [
            tokenObject.nativeTokenDetails.nativeToken,
            amount,
            2,
            address,
        ]);
        const tx = { to: to, data: txData };
        return tx;
    } catch (error) {
        console.log("repay-error: ", error);
    }
}

export function useLendingRoutes() {
    const { mutateAsync: swap } = useUniswap();
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: calculategasCost } = useCalculateGasCost();
    const { selectedNetwork, smartAccount }: iGlobal = useGlobalStore((state) => state);

    const { selectedFromNetwork, selectedToProtocol, fromTokenDecimal }: iTrading = useTradingStore((state) => state);

    async function routes({
        tokenInObject,
        tokenIn,
        tokenInName,
        tokenOutObject,
        tokenOut,
        tokenOutName,
        amount,
        address,
        provider,
    }: any) {
        try {
            // alert("Hello")
            if (!selectedFromNetwork.chainName) {
                toast.error("Chain is not selected!!");
            }
            const tempTxs: any = [];
            const batchFlows: iBatchFlowData[] = [];
            let to, swapData, approveData;


            if (!tokenInObject) {
                if (tokenInObject.nativeTokenDetails.nativeToken != tokenIn) {
                    approveData = await approve({
                        tokenIn: tokenIn,
                        spender: uniswapSwapRouterByChainId[selectedFromNetwork.chainId],
                        amountIn: amount,
                        address,
                        web3JsonProvider: provider,
                    });
                    if (approveData) tempTxs.push(approveData);
                    swapData = await swap({
                        tokenIn: tokenIn,
                        tokenOut: tokenOutObject != "" ? tokenOutObject.nativeTokenDetails.nativeToken : tokenOut,
                        amountIn: amount,
                        address,
                        type: "exactIn",
                        chainId: selectedNetwork.chainId,
                    });
                    if (!swapData) {
                        throw "This lending route is not possible";
                    }
                    let batchFlow: iBatchFlowData = await addToBatchFlow(
                        selectedFromNetwork.chainId,
                        selectedFromNetwork.chainId,
                        "Uniswap",
                        tokenInName,
                        tokenOutObject != "" ? tokenOutObject.nativeTokenDetails.symbol : tokenOutName,
                        amount,
                        fromTokenDecimal,
                        "Swap"
                    );
                    batchFlows.push(batchFlow);
                    tempTxs.push(swapData?.swapTx);
                    amount = swapData.amountOutprice; // change amount after swap
                }

                if (tokenOutObject) {
                    // if migrate or repay position after withdraw and swap
                    to = tokenOutObject.abiDetails.contractAddress;
                    approveData = await approve({
                        tokenIn: tokenOutObject.nativeTokenDetails.nativeToken,
                        spender: to,
                        amountIn: amount,
                        address,
                        web3JsonProvider: provider,
                    });
                    if (approveData) tempTxs.push(approveData);
                    if (tokenOutObject.type == "Lending") {
                        const tx = await lending(tokenOutObject, amount, address);
                        tempTxs.push(tx);
                    } else if (tokenOutObject.type == "Repay") {
                        const tx = await repay(tokenOutObject, amount, address);
                        tempTxs.push(tx);
                    }
                    let batchFlow: iBatchFlowData = await addToBatchFlow(
                        selectedFromNetwork.chainId,
                        selectedFromNetwork.chainId,
                        tokenOutObject.protocol,
                        tokenOutObject.nativeTokenDetails.symbol,
                        tokenOutObject.type == "Lending"
                            ? tokenOutObject.shareTokenSymbol
                            : `You Repay ${tokenOutObject.nativeTokenDetails.symbol}`,
                        amount,
                        swapData.tokenOutDecimals,
                        tokenOutObject.type
                    );
                    batchFlows.push(batchFlow);
                }
                return { txArray: tempTxs, batchFlow: batchFlows, value: 0 };
            }

            console.log("tokenInObject", tokenInObject, tokenIn, selectedFromNetwork.chainId, amount)
            if (tokenInObject.type == "Lending") {
                if (tokenInObject.nativeTokenDetails.nativeToken != tokenIn) {
                    approveData = await approve({
                        tokenIn: tokenIn,
                        spender: uniswapSwapRouterByChainId[selectedFromNetwork.chainId],
                        amountIn: amount,
                        address,
                        web3JsonProvider: provider,
                    });
                    console.log("approveData", approveData)
                    if (approveData) tempTxs.push(approveData);
                    swapData = await swap({
                        tokenIn: tokenIn,
                        tokenOut: tokenInObject.nativeTokenDetails.nativeToken,
                        amountIn: amount,
                        address,
                        type: "exactIn",
                        chainId: selectedNetwork.chainId,
                    });
                    if (!swapData) {
                        throw "This lending route is not possible";
                    }
                    let batchFlow: iBatchFlowData = await addToBatchFlow(
                        selectedFromNetwork.chainId,
                        selectedFromNetwork.chainId,
                        "Uniswap",
                        tokenInName,
                        tokenInObject.nativeTokenDetails.symbol,
                        amount,
                        fromTokenDecimal,
                        "Swap"
                    );
                    batchFlows.push(batchFlow);
                    tempTxs.push(swapData?.swapTx);
                    amount = swapData.amountOutprice; // change amount after swap
                }
                console.log("Hello2", tokenInObject.abiDetails.contractAddress)

                approveData = await approve({
                    tokenIn: tokenInObject.nativeTokenDetails.nativeToken,
                    spender: tokenInObject.abiDetails.contractAddress,
                    amountIn: amount,
                    address,
                    web3JsonProvider: provider,
                });
                if (approveData) tempTxs.push(approveData);
                const tx = await lending(tokenInObject, amount, address);
                tempTxs.push(tx);
                console.log("tx", tx)

                let batchFlow: iBatchFlowData = await addToBatchFlow(
                    selectedFromNetwork.chainId,
                    selectedFromNetwork.chainId,
                    tokenInObject.protocol,
                    tokenInObject.nativeTokenDetails.symbol,
                    tokenInObject.shareTokenSymbol,
                    amount,
                    tokenInObject.nativeTokenDetails.decimals,
                    "Lending"
                );
                batchFlows.push(batchFlow);
            } else if (tokenInObject.type == "Withdraw") {
                const tx = await withdraw(tokenInObject, amount, address);
                tempTxs.push(tx);
                let batchFlow: iBatchFlowData = await addToBatchFlow(
                    selectedFromNetwork.chainId,
                    selectedFromNetwork.chainId,
                    tokenInObject.protocol,
                    tokenInObject.shareTokenSymbol,
                    tokenInObject.nativeTokenDetails.symbol,
                    amount,
                    fromTokenDecimal,
                    "Withdraw"
                );
                batchFlows.push(batchFlow);

                if (tokenInObject.nativeTokenDetails.nativeToken != tokenOut) {
                    approveData = await approve({
                        tokenIn: tokenInObject.nativeTokenDetails.nativeToken,
                        spender: uniswapSwapRouterByChainId[selectedFromNetwork.chainId],
                        amountIn: amount,
                        address,
                        web3JsonProvider: provider,
                    });
                    if (approveData) tempTxs.push(approveData);

                    const swapData = await swap({
                        tokenIn: tokenInObject.nativeTokenDetails.nativeToken,
                        tokenOut: tokenOutObject ? tokenOutObject.nativeTokenDetails.nativeToken : tokenOut,
                        amountIn: amount,
                        address,
                        type: "exactIn",
                        chainId: selectedNetwork.chainId,
                    });
                    if (!swapData) {
                        throw "This lending route is not possible";
                    }
                    let batchFlow: iBatchFlowData = await addToBatchFlow(
                        selectedFromNetwork.chainId,
                        selectedFromNetwork.chainId,
                        "Uniswap",
                        tokenInObject.nativeTokenDetails.symbol,
                        tokenOutObject ? tokenOutObject.nativeTokenDetails.symbol : tokenOutName,
                        amount,
                        swapData.tokenOutDecimals,
                        "Swap"
                    );
                    batchFlows.push(batchFlow);
                    amount = swapData.amountOutprice;
                    tempTxs.push(swapData?.swapTx);

                    if (tokenOutObject) {
                        // if migrate or repay position after withdraw and swap
                        to = tokenOutObject.abiDetails.contractAddress;
                        approveData = await approve({
                            tokenIn: tokenOutObject.nativeTokenDetails.nativeToken,
                            spender: to,
                            amountIn: amount,
                            address,
                            web3JsonProvider: provider,
                        });
                        if (approveData) tempTxs.push(approveData);
                        if (tokenOutObject.type == "Lending") {
                            const tx = await lending(tokenOutObject, amount, address);
                            tempTxs.push(tx);
                        } else if (tokenOutObject.type == "Repay") {
                            const tx = await repay(tokenOutObject, amount, address);
                            tempTxs.push(tx);
                        }
                        let batchFlow: iBatchFlowData = await addToBatchFlow(
                            selectedFromNetwork.chainId,
                            selectedFromNetwork.chainId,
                            tokenOutObject.protocol,
                            tokenOutObject.nativeTokenDetails.symbol,
                            tokenOutObject.type == "Lending"
                                ? tokenOutObject.shareTokenSymbol
                                : `You Repay ${tokenOutObject.nativeTokenDetails.symbol}`,
                            amount,
                            swapData.tokenOutDecimals,
                            tokenOutObject.type
                        );
                        batchFlows.push(batchFlow);
                    }
                }
            } else if (tokenInObject.type == "Borrow") {
                // alert("Borrow")
                const tx = await borrow(tokenInObject, amount, address);
                tempTxs.push(tx);
                // alert("Borrow2")
                console.log("borrow-tx", tx)
                let batchFlow: iBatchFlowData = await addToBatchFlow(
                    selectedFromNetwork.chainId,
                    selectedFromNetwork.chainId,
                    tokenInObject.protocol,
                    tokenInObject.nativeTokenDetails.symbol,
                    tokenInObject.nativeTokenDetails.symbol,
                    amount,
                    fromTokenDecimal,
                    tokenInObject.type
                );
                batchFlows.push(batchFlow);
                console.log("batchFlow-tx", batchFlow)

                if (tokenInObject.nativeTokenDetails.nativeToken != tokenOut) {
                    // alert("Borro3")
                    approveData = await approve({
                        tokenIn: tokenInObject.nativeTokenDetails.nativeToken,
                        spender: uniswapSwapRouterByChainId[selectedFromNetwork.chainId],
                        amountIn: amount,
                        address,
                        web3JsonProvider: provider,
                    });
                    if (approveData) tempTxs.push(approveData);

                    console.log('tokenInObject.nativeTokenDetails.nativeToken', tokenInObject.nativeTokenDetails.nativeToken)
                    console.log('tokenOut--', tokenOut, amount)

                    const swapData = await swap({
                        tokenIn: tokenInObject.nativeTokenDetails.nativeToken,
                        tokenOut: tokenOut,
                        amountIn: amount,
                        address,
                        type: "exactIn",
                        chainId: selectedNetwork.chainId,
                    });

                    if (!swapData) {
                        throw "This lending route is not possible";
                    }
                    let batchFlow: iBatchFlowData = await addToBatchFlow(
                        selectedFromNetwork.chainId,
                        selectedFromNetwork.chainId,
                        "Uniswap",
                        tokenInObject.nativeTokenDetails.symbol,
                        tokenOutObject ? tokenOutObject.nativeTokenDetails.symbol : tokenOutName,
                        amount,
                        swapData.tokenOutDecimals,
                        "Swap"
                    );
                    batchFlows.push(batchFlow);
                    amount = swapData.amountOutprice;
                    tempTxs.push(swapData?.swapTx);

                    if (tokenOutObject) {
                        // if migrate or repay position after Borrow and swap
                        // alert(tokenOutObject.abiDetails.contractAddress)
                        to = tokenOutObject.abiDetails.contractAddress;
                        approveData = await approve({
                            tokenIn: tokenOutObject.nativeTokenDetails.nativeToken,
                            spender: to,
                            amountIn: amount,
                            address,
                            web3JsonProvider: provider,
                        });
                        if (approveData) tempTxs.push(approveData);
                        if (tokenOutObject.type == "Lending") {
                            const tx = await lending(tokenOutObject, amount, address);
                            tempTxs.push(tx);
                        } else if (tokenOutObject.type == "Repay") {
                            const tx = await repay(tokenOutObject, amount, address);
                            tempTxs.push(tx);
                        }
                        let batchFlow: iBatchFlowData = await addToBatchFlow(
                            selectedFromNetwork.chainId,
                            selectedFromNetwork.chainId,
                            tokenOutObject.protocol,
                            tokenOutObject.nativeTokenDetails.symbol,
                            tokenOutObject.type == "Lending"
                                ? tokenOutObject.shareTokenSymbol
                                : `You Repay ${tokenOutObject.nativeTokenDetails.symbol}`,
                            amount,
                            swapData.tokenOutDecimals,
                            tokenOutObject.type
                        );
                        console.log('batchFlow--', batchFlow)
                        batchFlows.push(batchFlow);
                    }
                }
            } else if (tokenInObject.type == "Repay") {
                approveData = await approve({
                    tokenIn: tokenIn,
                    spender: to,
                    amountIn: amount,
                    address,
                    web3JsonProvider: provider,
                });
                if (approveData) tempTxs.push(approveData);
                const tx = await repay(tokenInObject, amount, address);
                tempTxs.push(tx);

                let batchFlow: iBatchFlowData = await addToBatchFlow(
                    selectedFromNetwork.chainId,
                    selectedFromNetwork.chainId,
                    tokenInObject.protocol,
                    tokenInObject.nativeTokenDetails.symbol,
                    `You Repay ${tokenInObject.nativeTokenDetails.symbol}`,
                    amount,
                    fromTokenDecimal,
                    tokenInObject.type
                );
                batchFlows.push(batchFlow);

                // TODO
                // After Repay there will be possibility of Withdraw and Borrow of other assets
            }

            return { txArray: tempTxs, batchFlow: batchFlows, value: 0 };
        } catch (error: any) {
            if (error.message) {
                console.log("borrow: Error", error.message);
            } else {
                console.log("borrow: Error", error);
            }
            return;
        }
    }
    return useMutation(routes);
}
