import { useMutation } from '@tanstack/react-query';
import { fetchContractDetails } from '../utils/helper';
import { _functionType, _nonce } from '../utils/constants';
import { iCrossChainDifi, useCrossChainDifiStore } from '../store/CrossChainDifiStore';

export function useGenerateAbis() {
    const {
        smartAccount,
        toChainId,
        contractIndex,
        allNetworkData,
        setFunctionArray,
        setAbi
    }: iCrossChainDifi = useCrossChainDifiStore((state) => state);

    async function generateAbisForContract() {
        try {
            if (!contractIndex) return
            if (!smartAccount) return
            if (!toChainId) return
            const provider = smartAccount.provider
            const contractAddress: any = allNetworkData?.contracts[contractIndex].contractAddress
            const methodNames: any = allNetworkData?.contractMetaData[contractAddress].methodNames

            let abi: any = await fetchContractDetails(provider, contractAddress, toChainId, methodNames)
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
