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

export const checkPermit2Approve = async (token: any, amount: any) => {
    try {
        let signer = await getSigner();
        if (!signer) return;
        let address = await signer.getAddress();

        const allowedForPermit2 = await checkIsPermit2Approved(
            token.toString(),
            address,
            Permit2Address,
            amount
        );
        console.log('allowedForPermit2: ', allowedForPermit2);

        if (allowedForPermit2 === undefined) {
            throw "allownace can't fetch";
        } else {
            // if not allowed then give approve
            if (!allowedForPermit2) {
                const tokenContract = await getErc20Contract(token);
                const approveTx = await tokenContract
                    ?.connect(signer)
                    .approve(Permit2Address, BigNumber.from(amount));
                await approveTx.wait();
            }
            return true;
        }
    } catch (error) {
        console.log('checkPermit2Approve-error: ', error);
        return undefined;
    }
};

export const checkSpenderSign = async (
    token: any,
    spender: any,
    amount: any
) => {
    try {
        let signer = await getSigner();
        if (!signer) return;
        let address = await signer.getAddress();

        const allowedForRouter = await checkIsSpenderApprovedForPermit2(
            address,
            token,
            spender,
            amount
        );
        console.log('allowedForRouter: ', allowedForRouter);
        if (allowedForRouter === undefined) {
            throw "Permit2 allownace can't fetch";
        } else {
            let command: any = null;
            if (!allowedForRouter) {
                command = await getSignForPermitForPermit2(
                    {
                        contractAddress: token.toString(),
                        amountIn: BigNumber.from(amount)
                    },
                    spender
                );
                if (!command) return;
            }
            return command;
        }
    } catch (error) {
        console.log('checkSpenderSign-error: ', error);
        return undefined;
    }
};

export const checkIsPermit2Approved = async (
    token: string,
    from: any,
    spender: any,
    amount: any
) => {
    let provider = await getProvider();
    let signer = await getSigner();
    let tokenContract;
    try {
        if (!provider) return;
        if (!signer) return;
        const sdk = await new ThirdwebSDK('polygon');
        const tokenContract = await sdk.getContract(token, erc20Abi);
        if (!tokenContract) return;
        const allowance = await tokenContract.call('allowance', [
            from,
            spender
        ]);
        console.log('allowance-erc20: ', allowance);
        if (BigNumber.from(allowance).gte(BigNumber.from(amount.toString()))) {
            return true;
        }
        return false;
    } catch (error) {
        console.log('PermitArpprove-Error: ', error, signer, tokenContract);
    }
};

export const checkIsSpenderApprovedForPermit2 = async (
    from: any,
    token: string,
    spender: any,
    amount: any
) => {
    let provider = await getProvider();
    let signer = await getSigner();
    try {
        if (!provider) return;
        if (!signer) return;
        const sdk = await new ThirdwebSDK('polygon');
        const permit2 = await sdk.getContract(Permit2Address, Permit2Abi.abi);
        if (!permit2) return;

        const allowance = await permit2.call('allowance', [
            from,
            token,
            spender
        ]);
        console.log('allowance-permit2: ', allowance);
        if (allowance.amount.gte(BigNumber.from(amount.toString()))) {
            const currentDeadline = await getDeadline(120);
            if (
                BigNumber.from(allowance.expiration).gte(
                    BigNumber.from(currentDeadline)
                )
            ) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log('SpenderPermitArpprove-Error: ', error, signer);
    }
};

export const getSignForPermitForPermit2 = async (
    data: any,
    universalRouter: any
) => {
    try {
        let signer = await getSigner();
        if (!signer) return;
        const deadline: any = await getDeadline(BigNumber.from('100000000'));
        const permit: PermitSingle = {
            details: {
                token: data.contractAddress,
                amount: BigNumber.from(data.amountIn), // weth amount
                expiration: deadline,
                nonce: BigNumber.from('0') // this is his first trade
            },
            spender: universalRouter,
            sigDeadline: BigNumber.from(await getDeadline(1800))
        };

        const sdk = await new ThirdwebSDK('polygon');
        const permit2 = await sdk.getContract(Permit2Address, Permit2Abi.abi);
        if (!permit2) return;
        const sig = await getPermitSignature(permit, signer, permit2);

        // const path = encodePathExactInput([data.path[0], data.path[1]])
        const commands = await createCommand(CommandType.PERMIT2_PERMIT, [
            permit,
            sig
        ]);
        return commands;
    } catch (error) {
        console.log('getSignForPermitForPermit2-Error: ', error);
    }
};

export const rearrangeSwapData = async (data: any, fees: any) => {
    try {
        let swapCommand;
        let makeSwapData;
        let commandType;
        let path;
        if (data.path) {
            path = await encodePathExactInput(data.path, fees);
            console.log('path', data.path, path);
        } else {
            path = data.path;
            console.log('else-path', data.path, path);
        }

        if (data.function === 'V3_SWAP_EXACT_IN') {
            makeSwapData = [
                data.recipient,
                data.amountIn,
                data.amountOut,
                path,
                data.payerIsUser
            ];
            commandType = CommandType.V3_SWAP_EXACT_IN;
        } else if (data.function === 'V3_SWAP_EXACT_OUT') {
            makeSwapData = [
                data.recipient,
                data.amountOut,
                data.amountIn,
                path,
                data.payerIsUser
            ];
            commandType = CommandType.V3_SWAP_EXACT_OUT;
        } else if (data.function === 'V2_SWAP_EXACT_IN') {
            makeSwapData = [
                data.recipient,
                data.amountIn,
                data.amountOut,
                path,
                data.payerIsUser
            ];
            commandType = CommandType.V2_SWAP_EXACT_IN;
        } else if (data.function === 'V2_SWAP_EXACT_OUT') {
            makeSwapData = [
                data.recipient,
                data.amountIn,
                data.amountOut,
                path,
                data.payerIsUser
            ];
            commandType = CommandType.V2_SWAP_EXACT_OUT;
        } else if (data.function === 'WRAP_ETH') {
            makeSwapData = [data.recipient, data.amountIn];
            commandType = CommandType.WRAP_ETH;
        } else if (data.function === 'UNWRAP_WETH') {
            makeSwapData = [data.recipient, 0];
            commandType = CommandType.UNWRAP_WETH;
        }
        console.log('makeSwapData-1', makeSwapData);
        console.log('commandType-1', commandType);

        if (!makeSwapData) {
            alert('!makeSwapData');
            return;
        }
        if (commandType === undefined) {
            alert('!commandType');
            return;
        }

        // console.log('makeSwapData', makeSwapData)
        // console.log('commandType', commandType)

        swapCommand = await createCommand(commandType, makeSwapData);
        return swapCommand;
    } catch (error) {
        console.log('swapData-Error: ', error);
    }
};

export function extractPathFromV3(fullPath: any, reverse = false) {
    const fullPathWithoutHexSymbol = fullPath.substring(2);
    console.log('fullPathWithoutHexSymbol', fullPathWithoutHexSymbol);
    let path: any = [];
    let currentAddress = '';
    for (let i = 0; i < fullPathWithoutHexSymbol.length; i++) {
        currentAddress += fullPathWithoutHexSymbol[i];
        if (currentAddress.length === 40) {
            path.push('0x' + currentAddress);
            i = i + 6;
            currentAddress = '';
        }
    }
    if (reverse) {
        return path.reverse();
    }
    return path;
}

export function createCommand(
    type: CommandType,
    parameters: any[]
): RouterCommand {
    console.log('parameters', parameters);
    const encodedInput = defaultAbiCoder.encode(
        ABI_DEFINITION[type],
        parameters
    );
    return { type, encodedInput };
}

export const mempool = async () => {
    console.log('Hi');
    const provider = new ethers.providers.WebSocketProvider(
        `wss://polygon-mainnet.infura.io/ws/v3/${process.env.NEXT_PUBLIC_PROJECT_ID_mempool_3}`
    );
    console.log('calling websocket');
    provider.on('completed', async (tx) => {
        try {
            const txInfo = await provider.getTransaction(tx);
            if (txInfo?.to == '0x4C60051384bd2d3C01bfc845Cf5F4b44bcbE9de5') {
                console.log(txInfo);
                // await getNewEvent(txInfo?.hash)
            }
        } catch (error) {
            console.log('no data to show', error);
        }
    });
};
