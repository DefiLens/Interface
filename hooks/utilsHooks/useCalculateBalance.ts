import { toast } from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";

import { useGlobalStore, iGlobal } from "../../store/GlobalStore";
import { getProvider } from "../../utils/web3Libs/ethers";
import { decreasePowerByDecimals } from "../../utils/helper";

export function useCalculatebalance() {
    const { setScwBalance, setEoaBalance }: iGlobal = useGlobalStore((state) => state);

    async function fetchNativeBalance({ chainId, eoaAddress, scwAddress }) {
        try {
            const provider = await getProvider(chainId);
            if (!provider) throw "No Provider";
            if (eoaAddress) {
                let _eoabalance: any = await provider.getBalance(eoaAddress);
                _eoabalance = await decreasePowerByDecimals(_eoabalance.toString(), 18);
                setEoaBalance(_eoabalance);
            }
            if (scwAddress) {
                let _eoabalance: any = await provider.getBalance(scwAddress);
                _eoabalance = await decreasePowerByDecimals(_eoabalance.toString(), 18);
                setScwBalance(_eoabalance);
            }
        } catch (error: any) {
            console.log("useCalculatebalance:Error: " + error);
            toast.error(error);
            return;
        }
    }
    return useMutation(fetchNativeBalance);
}
