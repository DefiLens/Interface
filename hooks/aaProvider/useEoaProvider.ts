import { BigNumber, Signer } from "ethers";
import { toast } from "react-hot-toast";

import { useSigner } from "@thirdweb-dev/react";
import { useMutation } from "@tanstack/react-query";

export function useEoaProvider() {
    const signer: Signer | undefined = useSigner(); // Detect the connected address
    async function sendTxTrditionally(txs) {
        let confirmToastId;
        let toastId;
        try {
            if (signer) {
                let tempTxhash;
                confirmToastId = toast.loading("Wait until all transaction getting confirmed.");
                for (let i = 0; i < txs.length; i++) {
                    const txNo = BigNumber.from(i).add(1);
                    toastId = toast.loading("Processing Transaction number : " + txNo);
                    tempTxhash = await signer.sendTransaction(txs[i]);
                    await tempTxhash.wait();
                    toast.dismiss(toastId);
                    toast.success(`Tx ${txNo} is done successfully.`);
                }
                toast.dismiss(confirmToastId);
                toast.success(`Tx Succefully done: ${tempTxhash?.hash}`);
                return tempTxhash?.hash;
            }
        } catch (error: unknown) {
            console.error("sendTxTraditionally-error: ", error);
            if (error instanceof Error) { // Type guard to check if error is an instance of Error
                toast.error(error.message);
            } else {
                toast.error(String(error));
            }
            toast.dismiss(confirmToastId);
            toast.dismiss(toastId);
            return;
        }
    }
    return useMutation(sendTxTrditionally);
}
