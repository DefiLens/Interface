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
        } catch (error: any) {
            console.log("sendToGasLessBiconomy-error: ", error);
            setHasExecutionError(error.message ? error.message : error);
            return;
        }
    }
    return useMutation(sendToGasLessBiconomy);
}
