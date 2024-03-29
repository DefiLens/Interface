import { toast } from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";

import { getProvider } from "../../utils/web3Libs/ethers";
import { decreasePowerByDecimals } from "../../utils/helper";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { BigNumberish, ethers } from "ethers";

export function useCalculatebalance() {
    const { smartAccount, setScwBalance, setEoaBalance }: iGlobal = useGlobalStore((state) => state);

    async function fetchNativeBalance({ chainId, eoaAddress, scwAddress }) {
        try {
            const provider: ethers.providers.JsonRpcProvider | undefined = await getProvider(chainId);
            if (!provider) throw "No Provider";
            if (eoaAddress) {
                let _eoabalance: BigNumberish | undefined = await provider.getBalance(eoaAddress);
                if (_eoabalance === undefined) return;
                _eoabalance = await decreasePowerByDecimals(_eoabalance, 18);
                setEoaBalance(_eoabalance);
            }
            if (scwAddress) {
                let _scwbalance: BigNumberish | undefined = await smartAccount.provider.getBalance(scwAddress);
                if (_scwbalance === undefined) return;
                _scwbalance = await decreasePowerByDecimals(_scwbalance, 18);
                setScwBalance(_scwbalance);
            }
        } catch (error: any) {
            console.log("useCalculatebalance:Error: " + error);
            toast.error(error);
            return;
        }
    }
    return useMutation(fetchNativeBalance);
}
