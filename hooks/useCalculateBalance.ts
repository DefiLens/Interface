import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "../store/appStore";
import { toast } from "react-hot-toast";
import { getContractInstance, getErc20Balanceof } from "../utils/web3Libs/ethers";
import { BigNumber, ethers } from "ethers";
import { batch, calculateFees, chooseChianId } from "../utils/helper";
import { _functionType, _nonce, rpscURLS } from "../utils/constants";
import IERC20 from "../abis/IERC20.json";
import ChainPing from "../abis/ChainPing.json";
import { BigNumber as bg } from "bignumber.js";

export function useCalculatebalance() {
    const { setScwBalance, setEoaBalance }: any = useAppStore((state) => state);

    async function fetchNativeBalance({ chainId, eoaAddress, scwAddress }) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(rpscURLS[chainId]);
            if (eoaAddress) {
                let _eoabalance: any = await provider.getBalance(eoaAddress);
                _eoabalance = bg(_eoabalance.toString()).dividedBy(bg(10).pow(18));
                console.log("_eoabalance: ", _eoabalance.toString());
                setEoaBalance(_eoabalance.toString());
            }
            if (scwAddress) {
                let _eoabalance: any = await provider.getBalance(scwAddress);
                _eoabalance = bg(_eoabalance.toString()).dividedBy(bg(10).pow(18));
                console.log("_eoabalance: ", _eoabalance.toString());
                setScwBalance(_eoabalance.toString());
            }
        } catch (error: any) {
            console.log("useCalculatebalance:Error: " + error);
            toast.error(error);
            return;
        }
    }
    return useMutation(fetchNativeBalance);
}
