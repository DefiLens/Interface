import { useMutation } from "@tanstack/react-query";

import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import { ChainIdDetails } from "../../utils/data/network";
import { BigNumber } from "ethers";
import { Bundler, IBundler } from "@biconomy/bundler";
import { DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";

export function useBiconomyProvider() {
    const { smartAccount, selectedNetwork }: iGlobal = useGlobalStore((state) => state);
    const { setHasExecutionError, individualBatch }: iTrading = useTradingStore((state) => state);
    async function sendToBiconomy(txs) {
        try {
            const userOp = await smartAccount.buildUserOp(txs);
            userOp.paymasterAndData = "0x";
            console.log("userOp-: ", userOp, userOp.callGasLimit.toString());

            // if (selectedNetwork.chainId == "10") {
            const bundler: IBundler = new Bundler({
                bundlerUrl: ChainIdDetails[selectedNetwork.chainId].bundlerURL,
                chainId: BigNumber.from(selectedNetwork.chainId).toNumber(),
                entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
            });

            const data = await bundler.estimateUserOpGas(userOp);
            console.log("data: ", data);
            // userOp.callGasLimit = BigNumber.from(userOp.callGasLimit).add(0).toNumber();
            // userOp.verificationGasLimit = userOp.verificationGasLimit;
            // userOp.maxFeePerGas = userOp.maxFeePerGas;
            // userOp.maxPriorityFeePerGas = userOp.maxPriorityFeePerGas;
            // userOp.preVerificationGas = userOp.preVerificationGas;

            userOp.callGasLimit = BigNumber.from(data.callGasLimit).gt(0)
                ? BigNumber.from(data.callGasLimit).toNumber()
                : BigNumber.from(userOp.callGasLimit);
            userOp.verificationGasLimit = BigNumber.from(data.verificationGasLimit).gt(0)
                ? BigNumber.from(data.verificationGasLimit).toNumber()
                : BigNumber.from(userOp.verificationGasLimit);
            userOp.maxFeePerGas = BigNumber.from(data.maxFeePerGas).gt(0)
                ? BigNumber.from(data.maxFeePerGas).toNumber()
                : BigNumber.from(userOp.maxFeePerGas);
            userOp.maxPriorityFeePerGas = BigNumber.from(data.maxPriorityFeePerGas).gt(0)
                ? BigNumber.from(data.maxPriorityFeePerGas).toNumber()
                : BigNumber.from(userOp.maxPriorityFeePerGas);
            userOp.preVerificationGas = BigNumber.from(data.preVerificationGas).gt(0)
                ? BigNumber.from(data.preVerificationGas).toNumber()
                : BigNumber.from(userOp.preVerificationGas);

            console.log("userOp-after: ", userOp, userOp.callGasLimit.toString());
            // } else {
            // userOp.callGasLimit = BigNumber.from(userOp.callGasLimit).add(BigNumber.from(185000).mul(individualBatch.length-1))
            // console.log("userOp-after-: ", userOp, userOp.callGasLimit.toString());
            // }

            const userOpResponse = await smartAccount.sendUserOp(userOp);
            console.log("userOpResponse-: ", userOpResponse);
            const txReciept = await userOpResponse.wait();
            return txReciept?.receipt.transactionHash;
        } catch (error: unknown) {
            console.log("sendToBiconomy-error: ", error);
            if (error instanceof Error && error.message) { // Type guard to check if error is an instance of Error
                setHasExecutionError(error.message);
            } else {
                setHasExecutionError(String(error));
            }
            return;
        }
    }
    return useMutation(sendToBiconomy);
}
