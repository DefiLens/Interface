import { useMutation } from "@tanstack/react-query";

import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTrading, useTradingStore } from "../../store/TradingStore";
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
            console.log("userOp: ", userOp);

            if (selectedNetwork.chainId == "137") {
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

                console.log("userOp-after: ", userOp);
            } else {
                userOp.callGasLimit = BigNumber.from(userOp.callGasLimit).add(800000)
            }

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