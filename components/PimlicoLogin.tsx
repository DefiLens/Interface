import {useEffect, useState} from "react"
import {
    checkIfContractIsProxy,
    getAbiUsingExplorereUrl,
    batch,
    calculateFees,
} from "../utils/helper"
import {useAppStore} from "../store/appStore"
import {BigNumber, ethers} from "ethers"
import IStarGateRouter from "../abis/IStarGateRouter.json"
import IERC20 from "../abis/IERC20.json"
import ChainPing from "../abis/ChainPing.json"
import {css} from "@emotion/css"
import {BigNumber as bg} from "bignumber.js"
import {MAINNET_INFURA} from "../utils/keys"

import {
    SimpleAccountFactory__factory,
    EntryPoint__factory,
    SimpleAccount__factory,
    EntryPoint,
    UserOperationStruct,
} from "@account-abstraction/contracts"
import {
    getERC20Paymaster,
    ERC20,
    ERC20__factory,
} from "@pimlico/erc20-paymaster"

export default function PimlicoLogin() {
    const deploypimlico = async () => {
        // const provider = await ethers.getDefaultProvider()
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        // const accounts = await window.ethereum.request({
        //     method: "eth_requestAccounts",
        // })
        // console.log("accounts ", accounts)

        // const provider = new ethers.providers.Web3Provider(window.ethereum)
        // const signer = provider.getSigner()
        // console.log("signer ", signer)

        const provider = new ethers.providers.Web3Provider(
            window.ethereum,
            "any"
        )
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        console.log("Accountt:", address)

        const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
            "0x9406Cc6185a346906296840746125a0E44976454"
        console.log(
            "SIMPLE_ACCOUNT_FACTORY_ADDRESS:------- ",
            SIMPLE_ACCOUNT_FACTORY_ADDRESS
        )

        // const pimlicoUrl = `https://api.pimlico.io/v1/mumbai/rpc?apikey=90ebffcf-e089-4af5-86de-0460648a2cae`
        // const lineaProvider = new ethers.providers.JsonRpcProvider(pimlicoUrl)
        const rpcUrl = `https://polygon-mainnet.infura.io/v3/${MAINNET_INFURA}`
        console.log("rpcUrl:------- ", rpcUrl)
        const lineaProvider = new ethers.providers.StaticJsonRpcProvider(rpcUrl)
        // const lineaProvider = new ethers.providers.StaticJsonRpcProvider("https://rpc.goerli.linea.build/")
        // console.log("lineaProvider:", lineaProvider)

        const simpleAccountFactory = SimpleAccountFactory__factory.connect(
            SIMPLE_ACCOUNT_FACTORY_ADDRESS,
            lineaProvider
        )
        console.log("simpleAccountFactory:", simpleAccountFactory)

        const initCode = ethers.utils.hexConcat([
            SIMPLE_ACCOUNT_FACTORY_ADDRESS,
            simpleAccountFactory.interface.encodeFunctionData("createAccount", [
                address,
                0,
            ]),
        ])
        console.log("initCode::", initCode)

        // CALCULATE THE SENDER ADDRESS
        const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"

        const entryPoint = EntryPoint__factory.connect(
            ENTRY_POINT_ADDRESS,
            lineaProvider
        )

        const senderAddress = await entryPoint.callStatic
            .getSenderAddress(initCode)
            .then(() => {
                throw new Error("Expected getSenderAddress() to revert")
            })
            .catch((e) => {
                const data = e.message.match(/0x6ca7b806([a-fA-F\d]*)/)?.[1]
                if (!data) {
                    return Promise.reject(
                        new Error("Failed to parse revert data")
                    )
                }
                const addr = ethers.utils.getAddress(`0x${data.slice(24, 64)}`)
                return Promise.resolve(addr)
            })

        console.log("Calculated sender address::", senderAddress)

        const to = "0xb50685c25485CA8C520F5286Bbbf1d3F216D6989" // vitalik
        const value = 0
        const data = "0x68656c6c6f" // "hello" encoded to utf-8 bytes

        const simpleAccount = SimpleAccount__factory.connect(
            senderAddress,
            lineaProvider
        )

        const callData = simpleAccount.interface.encodeFunctionData("execute", [
            to,
            value,
            data,
        ])

        console.log("Generated callData:", callData)

        // FILL OUT REMAINING USER OPERATION VALUES
        const gasPrice = await lineaProvider.getGasPrice()

        const userOperation = {
            sender: senderAddress,
            nonce: ethers.utils.hexlify(0),
            initCode,
            callData,
            callGasLimit: ethers.utils.hexlify(100_000), // hardcode it for now at a high value
            verificationGasLimit: ethers.utils.hexlify(400_000), // hardcode it for now at a high value
            preVerificationGas: ethers.utils.hexlify(50_000), // hardcode it for now at a high value
            maxFeePerGas: ethers.utils.hexlify(gasPrice),
            maxPriorityFeePerGas: ethers.utils.hexlify(gasPrice),
            paymasterAndData: "0x",
            signature: "0x",
        }
        console.log("gasPrice:", gasPrice)

        // REQUEST PIMLICO VERIFYING PAYMASTER SPONSORSHIP
        const chain = "linea-testnet" // find the list of chain names on the Pimlico verifying paymaster reference page
        const apiKey = "90ebffcf-e089-4af5-86de-0460648a2cae"

        const pimlicoEndpoint = `https://api.pimlico.io/v1/${chain}/rpc?apikey=${apiKey}`

        const pimlicoProvider = new ethers.providers.StaticJsonRpcProvider(
            pimlicoEndpoint
        )

        const sponsorUserOperationResult = await pimlicoProvider.send(
            "pm_sponsorUserOperation",
            [
                userOperation,
                {
                    entryPoint: ENTRY_POINT_ADDRESS,
                },
            ]
        )

        const paymasterAndData = sponsorUserOperationResult.paymasterAndData

        userOperation.paymasterAndData = paymasterAndData

        console.log("Pimlico paymasterAndData:", paymasterAndData)

        // SIGN THE USER OPERATION
        const signature = await signer.signMessage(
            ethers.utils.arrayify(await entryPoint.getUserOpHash(userOperation))
        )

        userOperation.signature = signature

        console.log("UserOperation signature:", signature)
    }

    return (
        <>
            <button className={sendTxcss} onClick={(e: any) => deploypimlico()}>
                Signer
            </button>
        </>
    )
}

const center = css`
    padding: 60px 0;
    border: 3px solid green;
    text-align: center;
    height: auto;
`

const box1 = css`
    margin-top: 20px;
    margin-left: 20%;
    margin-right: 20%;
    border: 1px solid black;
    padding: 15px;
    background: lightgray;
    background-clip: border-box;
`

const sendTxcss = css`
    width: 20%;
    padding: 10px;
    background: black;
    color: white;
    font-size: 15px;
`

const gridContainer = css`
    display: grid;
    grid-template-columns: auto auto auto;
    background-color: #2196f3;
    padding: 10px;
`
const gridItem = css`
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.8);
    padding: 20px;
    font-size: 30px;
    text-align: center;
`
