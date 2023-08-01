import axios from "axios"
import {
    getImplementationAddress,
    getImplementationAddressFromProxy,
} from "@openzeppelin/upgrades-core"
import {
    AVAX_ETHERSCAN_API_KEY,
    ETHERSCAN_API_KEY,
    POLYGON_ETHERSCAN_API_KEY,
    TENDERLY_ACCESS_KEY,
    TENDERLY_PROJECT,
    TENDERLY_USER,
} from "./keys"
import {BigNumber, ethers} from "ethers"
import IStarGateBridge from "../abis/IStarGateBridge.json"
import IStarGateFactory from "../abis/IStarGateFactory.json"
import IStarGateFeeLibrary from "../abis/IStarGateFeeLibrary.json"
import IStarGatePool from "../abis/IStarGatePool.json"
import IStarGateRouter from "../abis/IStarGateRouter.json"
import Permit2Abi from '../abis/Permit2.json';
import {
    ABI_DEFINITION,
    CommandType,
    Permit2Address,
    RouterCommand,
    PermitSingle
} from './constants';
import { encodePathExactInput, getPermitSignature } from './permit2';
import { defaultAbiCoder } from 'ethers/lib/utils';
import {
    getDeadline,
    getErc20Contract,
    getProvider,
    getSigner
} from './commonHelper';
import erc20Abi from '../abis/erc20_2.json';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

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

        if (
            abi.filter(function (e: any) {
                return e.name === "upgradeTo"
            }).length > 0
        ) {
            currentImplAddress = await getImplementationAddress(
                provider,
                contratAddress
            )
            isProxy = true
        } else {
            currentImplAddress = contratAddress
            isProxy = false
        }
        console.log("currentImplAddress: ", currentImplAddress)
        return {
            isProxy: isProxy,
            currentImplAddress: currentImplAddress,
        }
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
        const stargateRouterInstance = await new ethers.Contract(
            stargateRouter,
            IStarGateRouter,
            provider
        )
        const factory = await stargateRouterInstance.factory()

        const factoryInstance = await new ethers.Contract(
            factory,
            IStarGateFactory,
            provider
        )
        const pool = await factoryInstance.getPool(2)

        const poolInstance = await new ethers.Contract(
            pool,
            IStarGatePool,
            provider
        )
        const feeLibrary = await poolInstance.feeLibrary()

        const feeLibraryInstance = await new ethers.Contract(
            feeLibrary,
            IStarGateFeeLibrary,
            provider
        )
        const fees = await feeLibraryInstance.getFees(
            srcPoolId,
            destPoolId,
            toChainId,
            userAddress,
            amountIn
        )

        amountIn = BigNumber.from(amountIn)
            .sub(fees.eqFee)
            .sub(fees.protocolFee)
            .sub(fees.lpFee)
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
                headers: {
                    "X-Access-Key": TENDERLY_ACCESS_KEY as string,
                },
            }
        )
    ).data
    console.log("simulate: ", simulate.simulation_results)
    console.log(
        "Gas Estimation: ",
        simulate.simulation_results[0].transaction.gas_used
    )
    console.log(
        "Gas Estimation: ",
        simulate.simulation_results[1].transaction.gas_used
    )
    console.timeEnd("Batch Simulation")
    // console.log(JSON.stringify(simulate, null, 2));
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
