import axios from "axios";
import { getImplementationAddress } from "@openzeppelin/upgrades-core";
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
import { BigNumber, ethers } from "ethers";
import IStarGateFactory from "../abis/IStarGateFactory.json";
import IStarGateFeeLibrary from "../abis/IStarGateFeeLibrary.json";
import IStarGatePool from "../abis/IStarGatePool.json";
import IStarGateRouter from "../abis/IStarGateRouter.json";
import { implementation_slot, rpscURLS } from "./constants";
import { getContractInstance, getProvider } from "./web3Libs/ethers";

interface FunctionABI {
    name: string;
    inputs: Array<{ name: string; type: string }>;
    outputs: Array<{ name: string; type: string }>;
    stateMutability: string;
    payable: boolean;
}

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

export const chooseChianId = (stargateChainId: any) => {
    let realChainId = "0";
    if (stargateChainId == "106") {
        realChainId = "43114";
    } else if (stargateChainId == "109") {
        realChainId = "137";
    } else if (stargateChainId == "110") {
        realChainId = "42161";
    } else if (stargateChainId == "111") {
        realChainId = "10";
    } else if (stargateChainId == "101") {
        realChainId = "1";
    } else if (stargateChainId == "184") {
        realChainId = "8453";
    }
    return realChainId;
};

export const fetchContractDetails = async (
    provider: any,
    contractAddress: string,
    toChainId: string,
    methodNames: any
) => {
    try {
        if (contractAddress == "0x8184285DfaB372201AFb8B5d6D4718467179E33d") {
            const swirllendABi = require("../abis/swirllendUSDC.json");
            return swirllendABi;
        }
        let contractAbis = await getAbiUsingExplorereUrl(toChainId, contractAddress);
        let abi = JSON.parse(contractAbis.ABI);
        const newprovider = await getProvider(toChainId);

        const { isProxy, currentImplAddress }: any = await checkIfContractIsProxy(abi, contractAddress, newprovider);
        console.log("isProxy: ", isProxy, currentImplAddress);
        if (isProxy) {
            const realChainid = await chooseChianId(toChainId);
            const provider = new ethers.providers.JsonRpcProvider(rpscURLS[realChainid]);
            let implementation = await provider.getStorageAt(contractAddress, implementation_slot);
            implementation = "0x" + implementation.slice(26, 66);
            console.log("implementation", implementation);
            contractAbis = await getAbiUsingExplorereUrl(toChainId, implementation);
            console.log("contractAbis", contractAbis);
            abi = JSON.parse(contractAbis.ABI);
        }
        console.log("abi", abi);

        // Find the selected functions
        const selectedFunctions = findSelectedFunctions(abi, methodNames);
        // Create the updated ABI
        abi = createUpdatedABI(selectedFunctions);
        console.log("Updated-Abi: ", abi);
        return abi;
    } catch (error) {
        console.log("fetchdetails-error: ", error);
    }
};

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
        console.log(resABI.data.result[0].ContractName);
        return resABI.data.result[0];
    } catch (error) {
        console.log("GetABI-Error: ", error);
    }
};

export const checkIfContractIsProxy = async (abi: any, contratAddress: any, provider: any) => {
    try {
        let currentImplAddress;
        let isProxy: boolean = false;

        if (
            abi.filter(function (e: any) {
                return e.name === "upgradeTo";
            }).length > 0
        ) {
            currentImplAddress = await getImplementationAddress(provider, contratAddress);
            isProxy = true;
        } else {
            currentImplAddress = contratAddress;
            isProxy = false;
        }
        console.log("currentImplAddress: ", currentImplAddress);
        return { isProxy: isProxy, currentImplAddress: currentImplAddress };
    } catch (error) {
        console.log("IfContractProxy-Error: ", error);
    }
};

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
        // console.log("stargateRouter: ", stargateRouter.toString());

        const stargateRouterInstance = await getContractInstance(stargateRouter, IStarGateRouter, provider);
        if (!stargateRouterInstance) return;
        const factory = await stargateRouterInstance.factory();
        // console.log("factory: ", factory.toString());

        const factoryInstance = await getContractInstance(factory, IStarGateFactory, provider);
        if (!factoryInstance) return;
        const pool = await factoryInstance.getPool(1);
        // console.log("factory: ", factory.toString());

        const poolInstance = await getContractInstance(pool, IStarGatePool, provider);
        if (!poolInstance) return;
        const feeLibrary = await poolInstance.feeLibrary();
        // console.log("feeLibrary: ", feeLibrary.toString());

        const feeLibraryInstance = await getContractInstance(feeLibrary, IStarGateFeeLibrary, provider);
        if (!feeLibraryInstance) return;
        const fees = await feeLibraryInstance.getFees(srcPoolId, destPoolId, toChainId, userAddress, amountIn);
        // console.log("fees: ", fees.toString());
        const ChainPingFees = "65"; // will deposit into dest eoa if stargate do not take much slippage
        amountIn = BigNumber.from(amountIn).sub(fees.eqFee).sub(fees.protocolFee).sub(fees.lpFee).sub(ChainPingFees);
        console.log("amountIn: ", amountIn.toString());
        return amountIn;
    } catch (error) {
        console.log("calculateFees-error: ", error);
    }
};

export const batch = async (
    token: any,
    chainPingContract: any,
    txdata1: any,
    txdata2: any,
    isSimulate: any,
    destChainId: any
) => {
    console.time("Batch Simulation");
    console.log("destChainId", destChainId);

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
    console.log("simulate: ", simulate.simulation_results);
    console.log("Gas Estimation: ", simulate.simulation_results[0].transaction.gas_used);
    console.log("Gas Estimation: ", simulate.simulation_results[1].transaction.gas_used);
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

export const shorten = (text: any) => {
    return text.substring(0, 6) + "..." + text.substring(text.length - 4, text.length);
};
