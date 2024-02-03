import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import { useMutation } from "@tanstack/react-query";
import { useUniswap } from "../swaphooks/useUniswap";
import { useApprove } from "../utilsHooks/useApprove";
import { decreasePowerByDecimals } from "../../utils/helper";
import { useCalculateGasCost } from "../utilsHooks/useCalculateGasCost";
import { iBatchFlowData, useTradingStore } from "../../store/TradingStore";
import { useGlobalStore } from "../../store/GlobalStore";
import { uniswapSwapRouterByChainId } from "../../utils/data/protocols";

// Utility function to process lending-related transactions (lending, borrowing, repay, withdraw)
async function processLendingTransaction(type, tokenObject, amount, address) {
    const to = tokenObject.abiDetails.contractAddress;
    const abiInterface = new ethers.utils.Interface([tokenObject.abiDetails[`${type}Abi`]]);
    const txData = abiInterface.encodeFunctionData(type, [
        tokenObject.nativeTokenDetails.nativeToken,
        amount,
        ...(type === 'borrow' || type === 'repay' ? [2, 0] : []),
        address,
    ]);
    return { to, data: txData };
}

// Simplify the approval and swapping logic
async function approveAndSwapIfNeeded({
    tokenInObject, tokenIn, tokenOutObject, tokenOut, amount, address, provider, chainId, tokenInName, tokenOutName, fromTokenDecimal
}, approve, swap) {
    const transactions: any = [];
    let approveData, swapData: any;

    if (tokenIn !== tokenOut) {
        approveData = await approve({
            tokenIn,
            spender: uniswapSwapRouterByChainId[chainId],
            amountIn: amount,
            address,
            web3JsonProvider: provider,
        });
        transactions.push(approveData);

        swapData = await swap({
            tokenIn,
            tokenOut: tokenOutObject ? tokenOutObject.nativeTokenDetails.nativeToken : tokenOut,
            amountIn: amount,
            address,
            type: "exactIn",
            chainId,
        });
        if (!swapData) throw new Error("This lending route is not possible");
        transactions.push(swapData.swapTx);

        // Adjust amount for subsequent operations based on swap output
        amount = swapData.amountOutprice;
    }

    return {
        transactions,
        newAmount: amount,
        swapData,
    };
}

async function addToBatchFlow({ fromChainId, toChainId, fromProtocol, tokenInName, tokenOutName, amount, fromTokenDecimal, actionType }) {
    let batchFlow = {
        fromChainId,
        toChainId,
        protocol: fromProtocol,
        tokenIn: tokenInName,
        tokenOut: tokenOutName,
        amount: await decreasePowerByDecimals(amount.toString(), fromTokenDecimal),
        action: actionType,
    };
    return batchFlow;
}

export function useLendingRoutes2() {
    const { mutateAsync: swap } = useUniswap();
    const { mutateAsync: approve } = useApprove();

    const routes = async ({ tokenInObject, tokenIn, tokenInName, tokenOutObject, tokenOut, tokenOutName, amount, address, provider }) => {
        try {
            const { selectedNetwork }: { selectedNetwork: any } = useGlobalStore((state) => state);
            const { selectedFromNetwork, fromTokenDecimal }: { selectedFromNetwork: any, fromTokenDecimal: number } = useTradingStore((state) => state);

            if (!selectedFromNetwork.chainName) {
                toast.error("Chain is not selected!!");
                return;
            }

            const transactions: any = [];
            const batchFlows: any = [];

            // Approve and swap if needed
            let { transactions: swapTransactions, newAmount, swapData } = await approveAndSwapIfNeeded({
                tokenInObject, tokenIn, tokenOutObject, tokenOut, amount, address, provider, chainId: selectedNetwork.chainId, tokenInName, tokenOutName, fromTokenDecimal
            }, approve, swap);

            transactions.push(...swapTransactions);

            // Process lending, withdraw, borrow, or repay based on the type
            if (['Lending', 'Withdraw', 'Borrow', 'Repay'].includes(tokenInObject.type)) {
                const tx = await processLendingTransaction(tokenInObject.type.toLowerCase(), tokenInObject, newAmount, address);
                transactions.push(tx);

                const batchFlow = await addToBatchFlow({
                    fromChainId: selectedFromNetwork.chainId,
                    toChainId: selectedFromNetwork.chainId,
                    fromProtocol: tokenInObject.protocol,
                    tokenInName: tokenInObject.nativeTokenDetails.symbol,
                    tokenOutName: tokenInObject.type === 'Lending' ? tokenInObject.shareTokenSymbol : `You Repay ${tokenInObject.nativeTokenDetails.symbol}`,
                    amount: newAmount,
                    fromTokenDecimal: swapData ? swapData.tokenOutDecimals : fromTokenDecimal,
                    actionType: tokenInObject.type
                });
                batchFlows.push(batchFlow);
            }

            console.log("transactions: ", transactions)

            return { txArray: transactions, batchFlow: batchFlows, value: 0 };
        } catch (error: any) {
            console.error("Error in routes:", error.message || error);
            return;
        }
    };

    return useMutation(routes);
}
