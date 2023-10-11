import axios from "axios";
import { netlifyNodeURL, tokensByNetwork } from "./constants";

interface Contract {
    contractName: string;
    contractAddress: string;
}

interface ContractMetaData {
    methodNames: string[];
    amountFieldIndex: number[];
}

interface Tokens {
    [tokenName: string]: string;
}

interface ChainPing {
    [network: string]: string;
}

interface StarGateRouter {
    [network: string]: string;
}

interface ApiResponse {
    contracts: Contract[];
    contractMetaData: Record<string, ContractMetaData>;
    tokens: Tokens;
    chainPing: ChainPing;
    starGateRouter: StarGateRouter;
}

export const getNetworkAndContractData = async (fromNetwork: string, toNetwork: string) => {
    return await axios
        .get<ApiResponse>(`${netlifyNodeURL}/common/getNetworkAndContractData/${fromNetwork}/${toNetwork}`)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.error("API Error:", error.response?.data);
            return error.response?.data;
        });
};

export const fetchMethodParams = async (
    fromChainId: any,
    toChainId: any,
    funcArray: any,
    amountIn: any,
    smartAccount: any,
    address: any,
    funcIndex: any,
    methodName: any,
    apiName: any
) => {
    // console.log('netlifyNodeURL', netlifyNodeURL)
    try {
        const fromToken = tokensByNetwork[fromChainId];
        const toToken = tokensByNetwork[toChainId];
        const response = await axios.get(
            // `${netlifyNodeURL}/aavev3/aavev3/${methodName}`,
            // `${netlifyNodeURL}/aavev3/vectorFinance/deposit`,
            apiName,
            {
                params: {
                    methodName: funcArray[funcIndex].name,
                    tokenIn: fromToken.usdc,
                    tokenInAtOetherNetwork: toToken.usdc,
                    amountIn: amountIn,
                    scw: smartAccount.address,
                    eoa: address,
                    toNetwork: toChainId,
                    fromNetwork: fromChainId,
                    isRecipientSCW: false,
                },
            }
        );

        console.log("response: ", response.data.abi);
        console.log("response: ", response.data.totalParamsLengthWise);
        console.log("response: ", response.data.fixParams);
        console.log("response-params: ", response.data.params);
        return response;
    } catch (error) {
        console.log("fetchMethodParams-error", fetchMethodParams);
        return error;
    }
};
