import axios from "axios";
import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { useMutation } from "@tanstack/react-query";
import { BICONOMY_GAS_PRICE_URL } from "../../utils/keys";

bg.config({ DECIMAL_PLACES: 5 });

export function useCalculateGasCost() {
    async function calculategasCost(fromChainId) {
        try {
            const biconomyGasInfo = await axios.get(`${BICONOMY_GAS_PRICE_URL}${fromChainId}`);
            if (biconomyGasInfo && biconomyGasInfo.data && biconomyGasInfo.data.data) {
                if (biconomyGasInfo.data.data.response.length > 0) {
                    const firstObject: any = biconomyGasInfo.data.data.response[0];
                    if (firstObject.tokenGasPrice && firstObject.feeTokenTransferGas) {
                        const tokenGasPrice = new bg(firstObject.tokenGasPrice.toString());
                        const feeTokenTransferGas = new bg(firstObject.feeTokenTransferGas.toString());
                        const divisor = new bg("1e18");
                        const result = tokenGasPrice.times(feeTokenTransferGas).dividedBy(divisor);
                        const formattedResult = result.toFixed(15);
                        return bg(formattedResult).toNumber();
                    } else {
                        return 0;
                    }
                }
            }
        } catch (error: any) {
            console.log("useCalculatebalance:Error: " + error);
            toast.error(error);
            return 0;
        }
    }
    return useMutation(calculategasCost);
}
