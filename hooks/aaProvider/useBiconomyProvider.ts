import { useMutation } from "@tanstack/react-query";

import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import { simulateForFullBatch } from "../../utils/helper";
import { ChainIdDetails } from "../../utils/data/network";
import { BigNumber, ethers } from "ethers";
import { Bundler, IBundler } from "@biconomy/bundler";
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";

export function useBiconomyProvider() {
    const { smartAccount, selectedNetwork }: iGlobal = useGlobalStore((state) => state);
    const { setHasExecutionError }: iTrading = useTradingStore((state) => state);
    async function sendToBiconomy(txs) {
        try {
            const userOp = await smartAccount.buildUserOp(txs);
            userOp.paymasterAndData = "0x";
            console.log('userOp: ', userOp)

            const bundler: IBundler = new Bundler({
                bundlerUrl: ChainIdDetails[selectedNetwork.chainId].bundlerURL,
                chainId: BigNumber.from(selectedNetwork.chainId).toNumber(),
                entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
            });
            const data = await bundler.estimateUserOpGas(userOp)
            console.log('data: ', data)

            userOp.callGasLimit = BigNumber.from(data.callGasLimit).toNumber();
            userOp.verificationGasLimit = data.verificationGasLimit;
            userOp.maxFeePerGas = data.maxFeePerGas;
            userOp.maxPriorityFeePerGas = data.maxPriorityFeePerGas;
            userOp.preVerificationGas = data.preVerificationGas;
            console.log('userOp-after: ', userOp)

            const userOpResponse = await smartAccount.sendUserOp(userOp);
            const txReciept = await userOpResponse.wait();
            return txReciept?.receipt.transactionHash;
        } catch (error: any) {
            console.log("sendToBiconomy-error: ", error);
            setHasExecutionError(error.message ? error.message : error);
            return;
        }
    }
    return useMutation(sendToBiconomy);
}
