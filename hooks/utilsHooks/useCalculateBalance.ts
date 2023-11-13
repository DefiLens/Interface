import { ethers } from "ethers";
import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { useMutation } from "@tanstack/react-query";

import { useGlobalStore, iGlobal } from "../../store/GlobalStore";
import { rpscURLS, _nonce, _functionType } from "../../utils/constants";

export function useCalculatebalance() {
    const { setScwBalance, setEoaBalance }: iGlobal = useGlobalStore((state) => state);

    async function fetchNativeBalance({ chainId, eoaAddress, scwAddress }) {
        try {
            const provider = new ethers.providers.JsonRpcProvider(rpscURLS[chainId]);
            if (eoaAddress) {
                let _eoabalance: any = await provider.getBalance(eoaAddress);
                _eoabalance = bg(_eoabalance.toString()).dividedBy(bg(10).pow(18));
                setEoaBalance(_eoabalance.toString());
            }
            if (scwAddress) {
                let _eoabalance: any = await provider.getBalance(scwAddress);
                _eoabalance = bg(_eoabalance.toString()).dividedBy(bg(10).pow(18));
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
