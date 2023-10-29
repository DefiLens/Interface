import { toast } from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";

import { _nonce, _functionType } from "../../utils/constants";
import { useGlobalStore, iGlobal } from "../../store/GlobalStore";
import { useCrossChainDifiStore, iCrossChainDifi } from "../../store/CrossChainDifiStore";

export function useBiconomyProvider() {
    const { smartAccount }: iGlobal = useGlobalStore((state) => state);

    async function sendToBiconomy(txs) {
        try {
            const userOp = await smartAccount.buildUserOp(txs);
            userOp.paymasterAndData = "0x";
            const userOpResponse = await smartAccount.sendUserOp(userOp);
            const txReciept = await userOpResponse.wait();
            return txReciept?.receipt.transactionHash;
        } catch (error: any) {
            console.log("sendToBiconomy-error: ", error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error(error);
            }
            return;
        }
    }
    return useMutation(sendToBiconomy);
}
