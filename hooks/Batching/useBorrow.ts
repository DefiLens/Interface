import { toast } from "react-hot-toast";
import { BigNumber, ethers } from "ethers";

import { useMutation } from "@tanstack/react-query";

import { useUniswap } from "../swaphooks/useUniswap";
import { useApprove } from "../utilsHooks/useApprove";
import { decreasePowerByDecimals } from "../../utils/helper";
import { useCalculateGasCost } from "../utilsHooks/useCalculateGasCost";
import { iBatchFlowData, iTrading, useTradingStore } from "../../store/TradingStore";
import {
    abiFetcher,
    abiFetcherNum,
    buildParams,
    nativeTokenFetcher,
    nativeTokenNum,
    uniswapSwapRouterByChainId,
} from "../../utils/data/protocols";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { getContractInstance } from "../../utils/web3Libs/ethers";
export function useBorrow() {
    const { mutateAsync: swap } = useUniswap();
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: calculategasCost } = useCalculateGasCost();
    const { selectedNetwork }: iGlobal = useGlobalStore((state) => state);

    const {
        selectedFromNetwork,
        selectedFromProtocol,
        selectedToProtocol,
        amountIn,
        fromTokensData,
        toTokensData,
    }: iTrading = useTradingStore((state) => state);

    async function borrow({
        isSCW,
        fromProtocol,
        toProtocol,
        tokenIn,
        tokenInName,
        tokenOut,
        tokenOutName,
        amount,
        address,
        provider,
    }: any) {
        try {
            if (!selectedFromNetwork.chainName) {
                toast.error("Chain is not selected!!");
            }
            const tempTxs: any = [];
            const batchFlows: iBatchFlowData[] = [];
            let txData;
            let to;

            const abiInterface = new ethers.utils.Interface([
                "function borrow(address asset,uint256 amount,uint256 interestRateMode,uint16 referralCode,address onBehalfOf)",
            ]);

            const contract = await getContractInstance(tokenIn, abiInterface, provider);

            if (fromProtocol == "aaveV3") {
                const abiInterface = new ethers.utils.Interface([
                    "function borrow(address asset,uint256 amount,uint256 interestRateMode,uint16 referralCode,address onBehalfOf)",
                ]);
                to = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5"
                txData = abiInterface.encodeFunctionData("borrow", [tokenIn, amount, 2, 0, address]);
            } else if (fromProtocol == "compoundV3") {
                const abiInterface = new ethers.utils.Interface([
                    "function withdraw(address withdrawalWallet, uint256 amount)",
                ]);
                to = "0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf"
                txData = abiInterface.encodeFunctionData("withdraw", [tokenIn, amount]);
            }

            const tx2 = { to: to, data: txData };
            tempTxs.push(tx2);

            let batchFlow: iBatchFlowData = {
                fromChainId: selectedFromNetwork.chainId,
                toChainId: selectedFromNetwork.chainId,
                protocol: selectedToProtocol,
                tokenIn: tokenInName,
                tokenOut: tokenInName,
                amount: await decreasePowerByDecimals(amount.toString(), "6"),
                action: "Borrow",
            };
            batchFlows.push(batchFlow);

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
    return useMutation(borrow);
}
