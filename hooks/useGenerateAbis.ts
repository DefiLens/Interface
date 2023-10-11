import { useMutation } from '@tanstack/react-query';

import { fetchContractDetails } from '../utils/helper';
import { _nonce, _functionType, StargateChainIdBychainId } from '../utils/constants';
import { useGlobalStore, iGlobal } from '../store/GlobalStore';
import { useCrossChainDifiStore, iCrossChainDifi } from '../store/CrossChainDifiStore';
import { iTrade, useTradeStore } from '../store/TradeStore';

export function useGenerateAbis() {

    const {
        smartAccount,
    }: iGlobal = useGlobalStore((state) => state);

    // const {
    //     toChainId,
    //     contractIndex,
    //     allNetworkData,
    //     setFunctionArray,
    //     setAbi
    // }: iCrossChainDifi = useCrossChainDifiStore((state) => state);

    const {
        selectedToNetwork,
        contractIndex,
        allNetworkData,
        setFunctionArray,
        setAbi
    }: iTrade = useTradeStore((state) => state);

    async function generateAbisForContract() {
        try {
            if (!contractIndex) return
            if (!smartAccount) return
            if (!selectedToNetwork.chainId) return
            const provider = smartAccount.provider
            const contractAddress: any = allNetworkData?.contracts[contractIndex].contractAddress
            const methodNames: any = allNetworkData?.contractMetaData[contractAddress].methodNames

            let abi: any = await fetchContractDetails(provider, contractAddress, StargateChainIdBychainId[selectedToNetwork.chainId], methodNames)
            console.log("abi: ", abi)
            setAbi(abi)

            const tempFuncArray: any = []
            let iterate: number = 0
            for (let i = 0; i < abi.length; i++) {
                if (abi[i].stateMutability != "view") {
                    if (abi[i].type == "fallback") {
                        console.log("fallback")
                    } else if (abi[i].type != "event") {
                        console.log("abi[i]: ", abi[i].name)
                        tempFuncArray[iterate] = abi[i];
                        iterate = iterate + 1
                    }
                }
            }
            setFunctionArray(tempFuncArray)
        } catch (error: any) {
            console.log('generateAbis-error', error)
            return;
        }
    }
    return useMutation(generateAbisForContract);
}
