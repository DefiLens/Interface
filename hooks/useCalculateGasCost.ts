import axios from 'axios';
import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { useMutation } from '@tanstack/react-query';

import { useGlobalStore, iGlobal } from '../store/GlobalStore';
import { _nonce, _functionType } from '../utils/constants';
import { useCrossChainDifiStore, iCrossChainDifi } from '../store/CrossChainDifiStore';

bg.config({ DECIMAL_PLACES: 5 });

export function useCalculateGasCost() {
    const { 
        setScwBalance,
        setEoaBalance,
    }: iGlobal = useGlobalStore((state) => state);

    const { 
        fromChainId
    }: iCrossChainDifi = useCrossChainDifiStore((state) => state);

    async function calculategasCost() {
        try {
            const biconomyGasInfo = await axios.get(`https://sdk-relayer.prod.biconomy.io/api/v1/relay/feeOptions?chainId=${fromChainId}`)
            console.log(biconomyGasInfo)
            const firstObject: any = biconomyGasInfo.data.response[0];
            const tokenGasPrice: number = firstObject.tokenGasPrice;
            const feeTokenTransferGas: number = firstObject.feeTokenTransferGas;

            const gasCost = bg(tokenGasPrice).multipliedBy(feeTokenTransferGas).dividedBy(1e18)
            console.log("Token Gas Price in ETH:", gasCost);
        } catch (error: any) {
            console.log("useCalculatebalance:Error: " + error);
            toast.error(error);
            return;
        }
    }
    return useMutation(calculategasCost);
}
