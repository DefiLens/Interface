import { BigNumber } from "ethers";
import { toast } from "react-hot-toast";

import { useSigner } from "@thirdweb-dev/react";
import { useMutation } from "@tanstack/react-query";

import { _nonce, _functionType } from "../../utils/constants";

export function useEoaProvider() {
    const signer: any = useSigner(); // Detect the connected address

    async function sendTxTrditionally(txs) {
        let confirmToastId;
        let toastId;
        try {
            let tempTxhash: any;
            confirmToastId = toast.loading("Wait until all transaction getting confirmed.");
            for (let i = 0; i < txs.length; i++) {
                const txNo = BigNumber.from(i).add(1);
                toastId = toast.loading("Processing Transaction number : " + txNo);
                tempTxhash = await signer.sendTransaction(txs[i]);
                await tempTxhash.wait();
                toast.dismiss(toastId);
                toast.success(`Tx ${txNo} is done successfully.`);
                console.log("tempTxhash", tempTxhash);
            }
            toast.dismiss(confirmToastId);
            toast.success(`Tx Succefully done: ${tempTxhash?.hash}`);
            return tempTxhash?.hash;
        } catch (error: any) {
            console.log("sendTxTrditionally-error: ", error);
            if (error.message) {
                toast.error(error.message);
                toast.dismiss(confirmToastId);
                toast.dismiss(toastId);
            } else {
                toast.error(error);
            }
            return;
        }
    }
    return useMutation(sendTxTrditionally);
}
