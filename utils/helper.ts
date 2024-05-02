import axios from "axios";
import { BigNumber, BigNumberish } from "ethers";
import toast from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

// import { getImplementationAddress } from "@openzeppelin/upgrades-core";

import { iTokenInfo } from "../modules/trade/types";
import IStarGatePool from "../abis/IStarGatePool.json";
import { implementation_slot } from "./data/constants";
import IStarGateRouter from "../abis/IStarGateRouter.json";
import IStarGateFactory from "../abis/IStarGateFactory.json";
import IStarGateFeeLibrary from "../abis/IStarGateFeeLibrary.json";
import { getContractInstance, getProvider } from "./web3Libs/ethers";
import {
    ARBITRUM_ETHERSCAN_API_KEY,
    AVAX_ETHERSCAN_API_KEY,
    BASE_ETHERSCAN_API_KEY,
    ETHERSCAN_API_KEY,
    OPTIMISM_ETHERSCAN_API_KEY,
    POLYGON_ETHERSCAN_API_KEY,
    TENDERLY_ACCESS_KEY,
    TENDERLY_PROJECT,
    TENDERLY_USER,
} from "./keys";

///// To fetch abi and contract Details

interface FunctionABI {
    name: string;
    inputs: Array<{ name: string; type: string }>;
    outputs: Array<{ name: string; type: string }>;
    stateMutability: string;
    payable: boolean;
}

export const getAbiUsingExplorereUrl = async (network: string, toAddress: string) => {
    try {
        let URL;
        if (network === "101") {
            URL = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${ETHERSCAN_API_KEY}`;
        } else if (network === "109") {
            URL = `https://api.polygonscan.com/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${POLYGON_ETHERSCAN_API_KEY}`;
        } else if (network === "106") {
            URL = `https://api.snowtrace.io/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${AVAX_ETHERSCAN_API_KEY}`;
        } else if (network === "110") {
            URL = `https://api.arbiscan.io/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${ARBITRUM_ETHERSCAN_API_KEY}`;
        } else if (network === "111") {
            URL = `https://api-optimistic.etherscan.io/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${OPTIMISM_ETHERSCAN_API_KEY}`;
        } else if (network === "184") {
            URL = `https://api.basescan.org/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${BASE_ETHERSCAN_API_KEY}`;
        }
        if (!URL) return;
        const resABI = await axios.get(URL);
        return resABI.data.result[0];
    } catch (error) {
        console.log("GetABI-Error: ", error);
    }
};

// export const fetchContractDetails = async (
//     provider: any,
//     contractAddress: string,
//     toChainId: string,
//     methodNames: any
// ) => {
//     try {
//         if (contractAddress == "0x8184285DfaB372201AFb8B5d6D4718467179E33d") {
//             const swirllendABi = require("../abis/swirllendUSDC.json");
//             return swirllendABi;
//         }
//         let contractAbis = await getAbiUsingExplorereUrl(toChainId, contractAddress);
//         let abi = JSON.parse(contractAbis.ABI);
//         const newprovider = await getProvider(toChainId);

//         const { isProxy, currentImplAddress }: any = await checkIfContractIsProxy(abi, contractAddress, newprovider);
//         if (isProxy) {
//             const realChainid = await chooseChianId(toChainId);
//             const provider = await getProvider(realChainid);
//             if (!provider) throw "No Provider";
//             let implementation = await provider.getStorageAt(contractAddress, implementation_slot);
//             implementation = "0x" + implementation.slice(26, 66);
//             contractAbis = await getAbiUsingExplorereUrl(toChainId, implementation);
//             abi = JSON.parse(contractAbis.ABI);
//         }

//         // Find the selected functions
//         const selectedFunctions = findSelectedFunctions(abi, methodNames);
//         // Create the updated ABI
//         abi = createUpdatedABI(selectedFunctions);
//         return abi;
//     } catch (error) {
//         console.log("fetchdetails-error: ", error);
//     }
// };

// export const checkIfContractIsProxy = async (abi: any, contratAddress: any, provider: any) => {
//     try {
//         let currentImplAddress;
//         let isProxy: boolean = false;

//         if (
//             abi.filter(function (e: any) {
//                 return e.name === "upgradeTo";
//             }).length > 0
//         ) {
//             currentImplAddress = await getImplementationAddress(provider, contratAddress);
//             isProxy = true;
//         } else {
//             currentImplAddress = contratAddress;
//             isProxy = false;
//         }
//         return { isProxy: isProxy, currentImplAddress: currentImplAddress };
//     } catch (error) {
//         console.log("IfContractProxy-Error: ", error);
//     }
// };

function findDepositField(abi: FunctionABI[]): FunctionABI | undefined {
    return abi.find((func) => func.name === "supply");
}

function findSelectedFunctions(abi: FunctionABI[], selectedFunctions: string[]): FunctionABI[] {
    return abi.filter((func) => selectedFunctions.includes(func.name) && func.inputs[0].type != "bytes32");
}

function createUpdatedABI(selectedFunctions: FunctionABI[]): object[] {
    return selectedFunctions.map((func) => ({
        name: func.name,
        inputs: func.inputs,
        outputs: func.outputs,
        stateMutability: func.stateMutability,
        payable: func.payable,
        type: "function",
    }));
}

///// To find fees for to bridge funds or slippage while bridge the finds

export const calculateFees = async (
    userAddress: any,
    amountIn: any,
    srcPoolId: any,
    destPoolId: any,
    toChainId: any,
    stargateRouter: any,
    provider: any
) => {
    try {
        const stargateRouterInstance = await getContractInstance(stargateRouter, IStarGateRouter, provider);
        if (!stargateRouterInstance) return;
        const factory = await stargateRouterInstance.factory();

        const factoryInstance = await getContractInstance(factory, IStarGateFactory, provider);
        if (!factoryInstance) return;
        const pool = await factoryInstance.getPool(1);

        const poolInstance = await getContractInstance(pool, IStarGatePool, provider);
        if (!poolInstance) return;
        const feeLibrary = await poolInstance.feeLibrary();

        const feeLibraryInstance = await getContractInstance(feeLibrary, IStarGateFeeLibrary, provider);
        if (!feeLibraryInstance) return;
        const fees = await feeLibraryInstance.getFees(srcPoolId, destPoolId, toChainId, userAddress, amountIn);
        const ChainPingFees = "65"; // will deposit into dest eoa if stargate do not take much slippage
        amountIn = BigNumber.from(amountIn).sub(fees.eqFee).sub(fees.protocolFee).sub(fees.lpFee).sub(ChainPingFees);
        return amountIn;
    } catch (error) {
        console.log("calculateFees-error: ", error);
    }
};

export const findGasUsedBySimulation = async (
    token: string,
    chainPingContract: string,
    txdata1: string,
    txdata2: string,
    isSimulate: boolean,
    destChainId: number
) => {
    console.time("Batch Simulation");

    const chainPingOwner = "0xb50685c25485CA8C520F5286Bbbf1d3F216D6989"; // owner of ChainPing

    const simulate = (
        await axios.post(
            `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate-bundle`,
            // the transaction
            {
                simulations: getTxSequence(chainPingOwner, token, chainPingContract, txdata1, txdata2).map(
                    (transaction) => ({
                        network_id: destChainId, // network to simulate on
                        save: true,
                        save_if_fails: true,
                        simulation_type: "full",
                        ...transaction,
                    })
                ),
            },
            {
                headers: { "X-Access-Key": TENDERLY_ACCESS_KEY as string },
            }
        )
    ).data;
    console.timeEnd("Batch Simulation");
    if (isSimulate) {
        return simulate.simulation_results[1];
    } else {
        return simulate.simulation_results[1].transaction.gas_used;
    }
};

function getTxSequence(userAddress: any, token: any, chainPingContract: any, txdata1: any, txdata2: any) {
    return [
        {
            from: userAddress,
            to: token,
            input: txdata1,
        },
        {
            from: userAddress,
            to: chainPingContract,
            input: txdata2,
        },
    ];
}

///// use this for all state to set as a safe method

export function setSafeState<T>(setStateFunction: (value: T) => void, value: T | undefined | null, defaultValue: T) {
    if (value !== undefined && value !== null) {
        setStateFunction(value);
    } else {
        setStateFunction(defaultValue);
        // Optionally, you can log an error or handle it in another way.
    }
}

///// build txHash link from hash and chainId

export const buildTxHash = (chainId: string | undefined, txhash: string, isSocketScan?: boolean) => {
    if (isSocketScan) {
        return `https://socketscan.io/tx/${txhash}`;
    }
    if (chainId == "137") {
        return `https://polygonscan.com/tx/${txhash}`;
    } else if (chainId == "43114") {
        return `https://snowtrace.io/tx/${txhash}`;
    } else if (chainId == "42161") {
        return `https://arbiscan.io/tx/${txhash}`;
    } else if (chainId == "10") {
        return `https://optimistic.etherscan.io/tx/${txhash}`;
    } else if (chainId == "1") {
        return `https://etherscan.io/tx/${txhash}`;
    } else if (chainId == "8453") {
        return `https://basescan.org/tx/${txhash}`;
    }
};

///// from ipfshash, generate ipfs link

export const convertIpfsUrl = (ipfsUri: string): string => {
    // Check if the input URI starts with 'ipfs://'
    if (ipfsUri.startsWith("ipfs://")) {
        // Remove the 'ipfs://' prefix
        const ipfsHash = ipfsUri.replace("ipfs://", "");

        // Create the Cloudflare IPFS URL
        const cloudflareIpfsUrl = `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`;

        return cloudflareIpfsUrl;
    }

    // If the input doesn't start with 'ipfs://', return it as is
    return ipfsUri;
};

///// format erc20 tokenList

export const getTokenListByChainId = (chainId: any, tokenList: any): iTokenInfo[] => {
    return tokenList.tokens
        .map((token: any) => {
            if (token.chainId == chainId) {
                return {
                    chainId: token.chainId,
                    address: token.address,
                    name: token.name,
                    symbol: token.symbol,
                    decimals: token.decimals,
                    logoURI: token.logoURI.includes("ipfs") ? convertIpfsUrl(token.logoURI) : token.logoURI,
                };
            }
            return null;
        })
        .filter(Boolean) as iTokenInfo[];
};

///// utils functions

export function incresePowerByDecimals(amount: BigNumberish | string, decimals: number) {
    return bg(amount.toString()).multipliedBy(bg(10).pow(decimals)).toString();
}

export function decreasePowerByDecimals(amount: BigNumberish | string, decimals: number) {
    return bg(amount.toString()).dividedBy(bg(10).pow(decimals)).toString();
}

export const shorten = (text: string) : string | undefined => {
    if (text) {
        return text.substring(0, 6) + "..." + text.substring(text.length - 4, text.length);
    } else {
        return;
    }
};

export const copyToClipboard = (id: any, message: string) => {
    navigator.clipboard.writeText(id);
    // Alert the copied text
    toast.success(message);
};

export const chooseChianId = (stargateChainId: number): number => {
    let realChainId: number = 0;
    if (stargateChainId == 106) {
        realChainId = 43114;
    } else if (stargateChainId == 109) {
        realChainId = 137;
    } else if (stargateChainId == 110) {
        realChainId = 42161;
    } else if (stargateChainId == 111) {
        realChainId = 10;
    } else if (stargateChainId == 101) {
        realChainId = 1;
    } else if (stargateChainId == 184) {
        realChainId = 8453;
    }
    return realChainId;
};

export async function fetchData<T>(url: string): Promise<T> {
    try {
        const response = await axios.get<T>(url);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching data: ${error}`);
    }
}

export const formatDate = (dateString: Date | undefined) => {
    if (!dateString) {
        return ""; // Return an empty string or handle the undefined case as per your requirement
    }

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
};
