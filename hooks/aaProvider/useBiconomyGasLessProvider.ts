import { useMutation } from "@tanstack/react-query";

import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTrading, useTradingStore } from "../../store/TradingStore";
import { IHybridPaymaster, SponsorUserOperationDto, PaymasterMode } from "@biconomy/paymaster";

export function useBiconomyGasLessProvider() {
    const { smartAccount }: iGlobal = useGlobalStore((state) => state);
    const { setHasExecutionError }: iTrading = useTradingStore((state) => state);
    async function sendToGasLessBiconomy(txs) {
        try {
            const userOp = await smartAccount.buildUserOp(txs, {
                paymasterServiceData: {
                    mode: PaymasterMode.SPONSORED,
                },
            });
            const userOpResponse = await smartAccount.sendUserOp(userOp);
            const txReciept = await userOpResponse.wait();
            return txReciept?.receipt.transactionHash;
        } catch (error: unknown) {
            // console.log("sendToGasLessBiconomy-error: ", error);
            if (error instanceof Error && error.message) { // Type guard to check if error is an instance of Error
                setHasExecutionError(error.message);
            } else {
                setHasExecutionError(String(error));
            }
            return;
        }
    }
    return useMutation(sendToGasLessBiconomy);
}
