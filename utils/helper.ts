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

export const getAbiUsingExplorereUrl = async (
    network: string,
    toAddress: string
) => {
    try {
        let URL
        if (network === "mainnet") {
            URL = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${ETHERSCAN_API_KEY}`
        } else if (network === "polygon") {
            URL = `https://api.polygonscan.com/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${POLYGON_ETHERSCAN_API_KEY}`
        } else if (network === "avalanche") {
            URL = `https://api.snowtrace.io/api?module=contract&action=getsourcecode&address=${toAddress}&apikey=${AVAX_ETHERSCAN_API_KEY}`
        }
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
        // let provider = await getProvider();
        // if (!provider) return;
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
            2,
            2,
            106,
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
    isSimulate: any
) => {
    console.time("Batch Simulation")

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
                    network_id: "43114", // network to simulate on
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
