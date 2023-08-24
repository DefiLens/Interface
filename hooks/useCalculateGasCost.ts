import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../store/appStore';
import { toast } from "react-hot-toast";
import { getContractInstance, getErc20Balanceof } from '../utils/web3Libs/ethers';
import { BigNumber, ethers } from 'ethers';
import { batch, calculateFees, chooseChianId } from '../utils/helper';
import { _functionType, _nonce, rpscURLS } from '../utils/constants';
import IERC20 from "../abis/IERC20.json";
import ChainPing from "../abis/ChainPing.json";
import { BigNumber as bg } from "bignumber.js";
import axios from 'axios';
bg.config({ DECIMAL_PLACES: 5 });

export function useCalculateGasCost() {
    const { setScwBalance, setEoaBalance, fromChainId}: any = useAppStore((state) => state);

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
