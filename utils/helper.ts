import axios from "axios"
import {getImplementationAddress,} from "@openzeppelin/upgrades-core"
import {
    AVAX_ETHERSCAN_API_KEY,
    ETHERSCAN_API_KEY,
    MAINNET_INFURA,
    POLYGON_ETHERSCAN_API_KEY,
    TENDERLY_ACCESS_KEY,
    TENDERLY_PROJECT,
    TENDERLY_USER,
} from "./keys"
import {BigNumber, ethers} from "ethers"
import IStarGateFactory from "../abis/IStarGateFactory.json"
import IStarGateFeeLibrary from "../abis/IStarGateFeeLibrary.json"
import IStarGatePool from "../abis/IStarGatePool.json"
import IStarGateRouter from "../abis/IStarGateRouter.json"
import {Provider} from "web3/providers"

const avaxRPCUrl = `https://avalanche-mainnet.infura.io/v3/${MAINNET_INFURA}`
const implementation_slot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"

const contractDataByNetwork = [
    {
        // avax stargate chainId
        106: {
            "0x794a61358D6845594F94dc1DB02A252b5b4814aD": {
                methodNames: ["supply", "repay"],
                amountFieldIndex: [1, 1],
                contractName: "AAVE Lending POOL-V3",
                network: "Avalanche",
            },
        },
    },
]

export const avaxContracts = [
    {
        contractName: "AAVE Lending POOL-V3",
        contractAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    },
]

interface FunctionABI {
    name: string
    inputs: Array<{name: string; type: string}>
    outputs: Array<{name: string; type: string}>
    stateMutability: string
    payable: boolean
}

function findDepositField(abi: FunctionABI[]): FunctionABI | undefined {
    return abi.find((func) => func.name === "supply")
}

function findSelectedFunctions(
    abi: FunctionABI[],
    selectedFunctions: string[]
): FunctionABI[] {
    return abi.filter((func) => selectedFunctions.includes(func.name))
}

function createUpdatedABI(selectedFunctions: FunctionABI[]): object[] {
    return selectedFunctions.map((func) => ({
        name: func.name,
        inputs: func.inputs,
        outputs: func.outputs,
        stateMutability: func.stateMutability,
        payable: func.payable,
        type: "function",
    }))
}

function checkChainIdIndex(toChainId: string): number | null {
    if (toChainId == "106") {
        return 0
    }
    return null
}

export const fetchContractDetails = async (
    provider: Provider,
    contractAddress: string,
    toChainId: string
) => {
    try {
        console.log("fetchdetails: ", contractDataByNetwork)
        const result = checkChainIdIndex(toChainId)
        if (result != null) {
            let chainIdIndex: number = result
            const contractMetaData = contractDataByNetwork[chainIdIndex][toChainId][contractAddress]
            const methodNames = contractMetaData["methodNames"]
            const amountFieldIndex = contractMetaData["amountFieldIndex"]
            const contractName = contractMetaData["contractName"]
            console.log("fetchdetails-methodNames: ", methodNames)

            let contractAbis = await getAbiUsingExplorereUrl(toChainId, contractAddress)
            let abi = JSON.parse(contractAbis.ABI)

            const {isProxy, currentImplAddress}: any = await checkIfContractIsProxy(abi, contractAddress, provider)
            if (isProxy) {
                console.log("isProxy", isProxy)
                const avaxProvider = new ethers.providers.JsonRpcProvider(avaxRPCUrl)
                let implementation = await avaxProvider.getStorageAt(contractAddress, implementation_slot)
                implementation = "0x" + implementation.slice(26, 66)
                contractAbis = await getAbiUsingExplorereUrl(toChainId, implementation)
                abi = JSON.parse(contractAbis.ABI)
            }

            // Find the selected functions
            const selectedFunctions = findSelectedFunctions(abi, methodNames)
            // Create the updated ABI
            abi = createUpdatedABI(selectedFunctions)
            console.log("Updated ABI:")
            console.log(abi)
            console.log("fetchdetails-data: ", abi)
            return {abi, amountFieldIndex, contractName,}
        }
    } catch (error) {
        console.log("fetchdetails-error: ", error)
    }
}

export const getAbiUsingExplorereUrl = async (
    network: string,
    toAddress: string
) => {
    try {
        console.log("network: ", network)
        let URL
        if (network === "101") {
            URL = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${ETHERSCAN_API_KEY}`
        } else if (network === "109") {
            URL = `https://api.polygonscan.com/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${POLYGON_ETHERSCAN_API_KEY}`
        } else if (network === "106") {
            URL = `https://api.snowtrace.io/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${AVAX_ETHERSCAN_API_KEY}`
        }
        console.log("URL:", URL)
        if (!URL) return
        const resABI = await axios.get(URL)
        console.log(resABI.data.result[0].ContractName)
        return resABI.data.result[0]
    } catch (error) {
        console.log("GetABI-Error: ", error)
    }
}

export const checkIfContractIsProxy = async (
    abi: any,
    contratAddress: any,
    provider: any
) => {
    try {
        let currentImplAddress
        let isProxy: boolean = false

        if (abi.filter(function (e: any) {return e.name === "upgradeTo"}).length > 0) {
            currentImplAddress = await getImplementationAddress(provider, contratAddress)
            isProxy = true
        } else {
            currentImplAddress = contratAddress
            isProxy = false
        }
        console.log("currentImplAddress: ", currentImplAddress)
        return {isProxy: isProxy, currentImplAddress: currentImplAddress,}
    } catch (error) {
        console.log("IfContractProxy-Error: ", error)
    }
}

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
        const stargateRouterInstance = await new ethers.Contract(stargateRouter, IStarGateRouter, provider)
        const factory = await stargateRouterInstance.factory()

        const factoryInstance = await new ethers.Contract(factory, IStarGateFactory, provider)
        const pool = await factoryInstance.getPool(2)

        const poolInstance = await new ethers.Contract(pool, IStarGatePool, provider)
        const feeLibrary = await poolInstance.feeLibrary()

        const feeLibraryInstance = await new ethers.Contract(feeLibrary, IStarGateFeeLibrary, provider)
        const fees = await feeLibraryInstance.getFees(
            srcPoolId,
            destPoolId,
            toChainId,
            userAddress,
            amountIn
        )
        amountIn = BigNumber.from(amountIn).sub(fees.eqFee).sub(fees.protocolFee).sub(fees.lpFee)
        return amountIn
    } catch (error) {
        console.log("calculateFees-error: ", error)
    }
}

export const batch = async (
    userAddress: any,
    token: any,
    chainPingContract: any,
    txdata1: any,
    txdata2: any,
    isSimulate: any,
    destChainId: any
) => {
    console.time("Batch Simulation")
    console.log("destChainId", destChainId)

    const simulate = (
        await axios.post(
            `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/simulate-bundle`,
            // the transaction
            {
                simulations: getTxSequence(
                    userAddress,
                    token,
                    chainPingContract,
                    txdata1,
                    txdata2
                ).map((transaction) => ({
                    network_id: destChainId, // network to simulate on
                    save: true,
                    save_if_fails: true,
                    simulation_type: "full",
                    ...transaction,
                })),
            },
            {
                headers: { "X-Access-Key": TENDERLY_ACCESS_KEY as string,},
            }
        )
    ).data
    console.log("simulate: ", simulate.simulation_results)
    console.log("Gas Estimation: ", simulate.simulation_results[0].transaction.gas_used)
    console.log("Gas Estimation: ", simulate.simulation_results[1].transaction.gas_used)
    console.timeEnd("Batch Simulation")
    if (isSimulate) {
        return simulate.simulation_results[1]
    } else {
        return simulate.simulation_results[1].transaction.gas_used
    }
}

function getTxSequence(
    userAddress: any,
    token: any,
    chainPingContract: any,
    txdata1: any,
    txdata2: any
) {
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
    ]
}
