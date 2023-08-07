import * as React from 'react';
import {useEffect, useState} from "react"
import {css} from "@emotion/css"
import {BigNumber, ethers} from "ethers"
import {BigNumber as bg} from "bignumber.js"
import IStarGateRouter from "../abis/IStarGateRouter.json"
import IERC20 from "../abis/IERC20.json"
import ChainPing from "../abis/ChainPing.json"
import {useAppStore} from "../store/appStore"
import {
    batch,
    calculateFees,
    chooseChianId,
    fetchContractDetails,
    shorten,
} from "../utils/helper"
import {useAddress, useSigner} from "@thirdweb-dev/react"
import {
    NetworkNameByChainId,
    _functionType,
    _nonce,
    methodWithApi,
    tokensByNetwork,
} from "../utils/constants"
import { parseEther } from 'ethers/lib/utils';
import axios from 'axios';
import { fetchMethodParams, getNetworkAndContractData } from '../utils/apis';

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

export default function MainForm() {
    const address = useAddress() // Detect the connected address
    const signer: any = useSigner() // Detect the connected address

    const polygonUSDC: any = tokensByNetwork['109'].usdc

    const {smartAccount}: any = useAppStore((state) => state)
    const [fromChainId, setFromChainId] = useState<any>("109")
    const [toChainId, setToChainId] = useState<any>()
    const [srcPoolId, setSrcPoolId] = useState<any>(1)
    const [destPoolId, setDestPoolId] = useState<any>(1)

    const [tokenIn, setTokenIn] = useState<any>(polygonUSDC)
    const [tokenInDecimals, setTokenInDecimals] = useState<any>(6)
    const [amountIn, setAmountIn] = useState<any>()

    const [funcArray, setFunctionArray] = useState<any[]>([])
    const [params, setParams] = useState<any>([[]])
    const [fixParams, setFixParams] = useState<any>([[]])

    const [currentAbi, setAbi] = useState<any>()
    const [currentFunc, setCurrentFunc] = useState<any>()
    const [currentFuncIndex, setCurrentFuncIndex] = useState<any>(0)

    const [isThisAmount, setIsThisFieldAmount] = useState<any>()

    const [simulation, setSimulation] = useState<any>()
    const [gasUsed, setGasUsed] = useState<any>()
    const [simulateInputData, setSimulateInputData] = useState<any>()
    const [simulateLoading, setSimulationLoading] = useState<any>(false)
    const [sendTxLoading, setSendtxLoading] = useState<any>(false)

    const [txhash, setTxHash] = useState<any>(false)

    const [allNetworkData, setData] = useState<ApiResponse | null>(null);
    const [contractIndex, setContractIndex] = useState<any>()

    useEffect(() => {
        async function updateParams() {
            if (currentFuncIndex) {
                setParams("")
                setFixParams("")
                const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress
                const apiName = methodWithApi[toChainId][contractAddress][funcArray[currentFuncIndex].name]
                console.log('apiName', apiName)

                const response = await fetchMethodParams(fromChainId, toChainId, funcArray, amountIn, smartAccount, address, currentFuncIndex, currentFunc, apiName)
                if (!response.data) throw ("api error")
                let _func = [...params]
                _func[currentFuncIndex] = response.data.params
                setParams(_func)
                setFixParams(response.data.fixParams)
            }
        }
        updateParams()
    }, [amountIn])

    useEffect(() => {
        setTokenIn(polygonUSDC)
        setTokenInDecimals(6)
        setAmountIn("")
        setContractIndex("")
        resetField()
    }, [fromChainId])

    useEffect(() => {
        setContractIndex("")
        resetField()
    }, [toChainId])

    useEffect(() => {
        if (contractIndex) {
            resetField()
            generateAbis()
        }
    }, [contractIndex, smartAccount])

    const resetField = async () => {
        setFunctionArray([])
        setParams("")
        setFixParams("")
        setCurrentFunc("")
        setCurrentFuncIndex(0)
        setIsThisFieldAmount(-1)

        setGasUsed(undefined)
        setSimulateInputData(undefined)
        setSimulation(undefined)
    }

    const onChangeFromNetwork = async (_fromNetwork: any) => {
        setFromChainId(_fromNetwork)
    }

    const onChangeToNetwork = async (toNetwork: any) => {
        try {
            setData(null)
            setToChainId(toNetwork)
            const response: any = await getNetworkAndContractData(fromChainId, toNetwork)
            if (response.data) {
                setData(response.data);
            }
        } catch (error) {
            console.error('API Error:', error);
        }

    }

    const handleContractAddress = async (_contractIndex) => {
        if (!smartAccount) {
            alert("You need to biconomy login")
            return
        }
        setContractIndex(_contractIndex)
    }

    // for e.g usdt -> usdc
    const onChangeTokenIn = async (tokenIn: any) => {
        const token = tokensByNetwork[fromChainId]
        if (tokenIn == "usdc") {
            setTokenIn(token.usdc)
            setTokenInDecimals(6)
            setSrcPoolId(1)
            setDestPoolId(1)
        }
        // else if (tokenIn == "usdt") {
        //     setTokenIn(polygonUSDTAddress)
        //     setTokenInDecimals(6)
        //     setSrcPoolId(2)
        //     setDestPoolId(2)
        // } else if (tokenIn == "dai") {
        //     setTokenIn(polygonDAIAddress)
        //     setTokenInDecimals(18)
        //     setSrcPoolId(3)
        //     setDestPoolId(3)
        // }
        setAmountIn("")
    }

    // for e.g 0 -> 1000
    const handleAmountIn = async (_amountIn) => {
        if (!smartAccount) {
            alert("You need to biconomy login")
            return
        }
        if (_amountIn) {
            let amountInByDecimals = bg(_amountIn)
            amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(tokenInDecimals))
            if (amountInByDecimals.eq(0)) {
                setAmountIn(_amountIn)
            } else {
                setAmountIn(amountInByDecimals.toString())
            }
        } else {
            setAmountIn("")
        }
    }

    const onChangeFunctions = async (funcIndex: any) => {
        try {
            setParams("")
            setFixParams("")

            const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress
            const apiName = methodWithApi[toChainId][contractAddress][funcArray[funcIndex].name]
            console.log('apiName', apiName)

            const response = await fetchMethodParams(fromChainId, toChainId, funcArray, amountIn, smartAccount, address, funcIndex, funcArray[funcIndex].name, apiName)
            if (!response.data) throw ("api error")
            let _func = [...params]
            _func[funcIndex] = response.data.params
            setParams(_func)
            setFixParams(response.data.fixParams)
            setCurrentFunc(funcArray[funcIndex].name)
            setCurrentFuncIndex(funcIndex)
            setIsThisFieldAmount(response.data.amountFieldIndex)
            setGasUsed(undefined)
            setSimulateInputData(undefined)
            setSimulation(undefined)
        } catch (error) {
          console.log("onChangeFunctions---error", error);
        }
    }

    const onChangeInput = async (
        funcIndex: any,
        inputIndex: any,
        inputValue: any
    ) => {
        try {
            if (!amountIn) throw ("Enter amountIn field above")
            setCurrentFunc(funcArray[funcIndex].name)
            let _params: any = []

            if (params[funcIndex] != undefined) {
                _params = [...params[funcIndex]]
                _params[inputIndex] = inputValue
            } else {
                _params[inputIndex] = inputValue
            }

            let _func = [...params]
            _func[funcIndex] = _params
            setParams(_func)
        } catch (error) {
            alert('InputError: '+ error)
        }
    }

    const isThisFieldAmount = async (index: any) => {
        if (index >= 0) {
            setIsThisFieldAmount(index)
        } else {
            alert("Somethig gets wrong")
        }
    }

    const generateAbis = async () => {
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

            for (let i = 0; i < abi.length; i++) {
                if (abi[i].stateMutability != "view") {
                    if (abi[i].type == "fallback") {
                        console.log("fallback")
                    } else if (abi[i].type != "event") {
                        console.log("abi[i]: ", abi[i].name)
                        setFunctionArray((funcArray) => [...funcArray, abi[i]])
                    }
                }
            }
        } catch (error) {
            console.log("callCrossChain-error", error)
        }
    }

    const simulate = async (funcIndex: any) => {
        try {
            setSimulationLoading(true)
            setGasUsed(undefined)
            setSimulateInputData(undefined)
            setSimulation(undefined)
            if (!smartAccount) throw "You need to login"
            if (contractIndex == "") throw "Enter contractIndex field"
            if (amountIn == "") throw "Enter amountIn field"
            if (isThisAmount < 0) throw "Select amount field"
            if(!allNetworkData) throw "a need to fetch"

            const fromStarGateRouter = allNetworkData.starGateRouter
            const toUsdc = allNetworkData.tokens.usdc
            const toChainPing = allNetworkData.chainPing

            const abi = ethers.utils.defaultAbiCoder
            // const provider = await ethers.getDefaultProvider()
            // const signer: Signer = new ethers.VoidSigner(smartAccount, provider)
            const USDT = await new ethers.Contract(tokenIn, IERC20, smartAccount.provider)
            const balance = await USDT.balanceOf(smartAccount.address)

            if (BigNumber.from(balance).lt(BigNumber.from(amountIn))) throw "You don't have enough balance"

            const approveData = await USDT.populateTransaction.approve(fromStarGateRouter, amountIn)
            const approveTx = {to: approveData.to, data: approveData.data}
            console.log("approveTx", approveTx)

            console.log("params1", params[funcIndex])
            const amountAfterSlippage = await calculateFees(
                address,
                amountIn,
                srcPoolId,
                destPoolId,
                toChainId,
                fromStarGateRouter,
                smartAccount.provider
            )
            params[funcIndex][isThisAmount] = amountAfterSlippage.toString()
            console.log("params2", params[funcIndex], currentFunc)
            console.log('params3: ', [toUsdc, params[funcIndex][1], address, 0])

            let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi)
            console.log("abiInterfaceForDestDefiProtocol", abiInterfaceForDestDefiProtocol, currentFunc)

            // const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
            const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(
                currentFunc,
                params[funcIndex]
            )
            console.log("destChainExecData", destChainExecData)

            const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress
            console.log("contractAddress", contractAddress)

            const destChainExecTx = {to: contractAddress, data: destChainExecData,}
            let data
            if (toChainId == '106') {
                data = abi.encode(
                    ["uint256", "address", "address", "bytes"],
                    [BigNumber.from("0"), contractAddress, address, destChainExecTx.data,]
                )
            } else {
                data = abi.encode(
                    ["uint256", "uint256", "address", "address", "bytes"],
                    [BigNumber.from("0"), amountAfterSlippage, contractAddress, address, destChainExecTx.data,]
                )
            }

            const srcAddress = ethers.utils.solidityPack(["address"], [smartAccount.address])
            let abiInterfaceForChainPing = new ethers.utils.Interface(ChainPing)
            const stargateParams = [
                fromChainId,
                srcAddress,
                _nonce,
                toUsdc,
                amountAfterSlippage,
                data,
            ]
            const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData("sgReceive", stargateParams)
            const erc20Interface = new ethers.utils.Interface([
                "function transfer(address _account, uint256 _value)",
            ])
            const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [toChainPing, amountAfterSlippage])
            const simulation = await batch(
                toUsdc,
                toChainPing,
                dummmyTranferToCheckData,
                encodedDataForChainPing,
                true,
                chooseChianId(toChainId)
            )

            setGasUsed(simulation.simulation.gas_used)
            setSimulateInputData(simulation.simulation.input)
            setSimulation(simulation.simulation.status)
            setSimulationLoading(false)

            console.log("simulation-status: ", simulation.simulation.status)
            console.log("simulation-input: ", simulation.simulation.input)
            console.log("simulation-method: ", simulation.simulation.method)
            console.log("simulation-gasused: ", simulation.simulation.gas_used)
        } catch (error) {
            setSimulationLoading(false)
            console.log("Simulation Failed: "+ error)
            alert("Simulation Failed: "+ error)
            return
        }
    }

    const sendTx = async (funcIndex: any) => {
        try {
            setSendtxLoading(true)
            if (!smartAccount) throw "You need to login"
            if (!simulation) throw "First simulate then send Tx"
            if (contractIndex == "") throw "Enter contractIndex field"
            if (amountIn == "") throw "Enter amountIn field"
            if (isThisAmount < 0) throw "Select amount field"
            if(!allNetworkData) throw "a need to fetch"

            const fromStarGateRouter: any = allNetworkData.starGateRouter
            const toUsdc = allNetworkData.tokens.usdc
            const toChainPing = allNetworkData.chainPing

            setTxHash("")
            const abi = ethers.utils.defaultAbiCoder

            // const provider = await ethers.getDefaultProvider()
            // const signer = new ethers.VoidSigner(smartAccount.address, provider)
            // const scwNativeBalance = await signer.getBalance()
            // console.log("scwNativeBalance", scwNativeBalance)

            const USDT = await new ethers.Contract(tokenIn, IERC20, smartAccount.provider)
            const balance = await USDT.balanceOf(smartAccount.address)
            if (BigNumber.from(balance).lt(BigNumber.from(amountIn))) throw "You don't have enough balance"

            const approveData = await USDT.populateTransaction.approve(fromStarGateRouter, amountIn)
            const approveTx = {to: approveData.to, data: approveData.data}
            console.log("approveTx", approveTx)

            console.log("params1", params[funcIndex])
            const amountAfterSlippage = await calculateFees(
                address,
                amountIn,
                srcPoolId,
                destPoolId,
                toChainId,
                fromStarGateRouter,
                smartAccount.provider
            )
            params[funcIndex][isThisAmount] = amountAfterSlippage.toString()
            console.log("params2", params[funcIndex], currentFunc)

            let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi)
            // const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
            const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(
                currentFunc,
                params[funcIndex]
            )

            const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress
            alert('contractAddress: '+contractAddress)
            const destChainExecTx = {to: contractAddress, data: destChainExecData,}
            let data
            if (toChainId == '106') {
                data = abi.encode(
                    ["uint256", "address", "address", "bytes"],
                    [BigNumber.from("0"), contractAddress, address, destChainExecTx.data,]
                )
            } else {
                data = abi.encode(
                    ["uint256", "uint256", "address", "address", "bytes"],
                    [BigNumber.from("0"), amountAfterSlippage, contractAddress, address, destChainExecTx.data,]
                )
            }

            const srcAddress = ethers.utils.solidityPack(["address"],[smartAccount.address])
            let abiInterfaceForChainPing = new ethers.utils.Interface(ChainPing)
            const stargateParams = [
                fromChainId,
                srcAddress,
                _nonce,
                toUsdc,
                amountAfterSlippage,
                data,
            ]
            const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData("sgReceive", stargateParams)
            const erc20Interface = new ethers.utils.Interface([
                "function transfer(address _account, uint256 _value)",
            ])
            const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [toChainPing, amountAfterSlippage])
            const gasUsed = await batch(
                toUsdc,
                toChainPing,
                dummmyTranferToCheckData,
                encodedDataForChainPing,
                false,
                chooseChianId(toChainId)
            )
            console.log("gasUsed: ", gasUsed)

            const stargateRouter = await new ethers.Contract(fromStarGateRouter, IStarGateRouter, smartAccount.provider)
            const lzParams = {dstGasForCall: gasUsed, dstNativeAmount: 0, dstNativeAddr: "0x",}
            const packedToAddress = ethers.utils.solidityPack(["address"], [toChainPing])
            let quoteData = await stargateRouter.quoteLayerZeroFee(
                toChainId,
                _functionType,
                packedToAddress,
                data,
                lzParams
            )
            console.log("quoteData", quoteData.toString(), amountIn)
            console.log("srcPoolId-destPoolId", srcPoolId, destPoolId)

            let stargateTx = await stargateRouter.populateTransaction.swap(
                toChainId,
                srcPoolId,
                destPoolId,
                smartAccount.address,
                amountIn,
                0,
                lzParams,
                packedToAddress,
                data,
                {value: quoteData[0]}
            )

            const scwNativeBalance = await smartAccount.provider.getBalance(smartAccount.address)
            console.log("scwNativeBalance", scwNativeBalance.toString(), quoteData[0].toString())
            const shouldBeBalance = BigNumber.from(scwNativeBalance)
            const shouldBeBalanceMsg = bg(shouldBeBalance.toString()).plus(parseEther('5').toString()).dividedBy(bg(10).pow(18)).toString()
            console.log("shouldBeBalanceMsg", shouldBeBalanceMsg.toString())

            // Extra 1e18 should more as of now
            if (!shouldBeBalance.gt(quoteData[0].add(parseEther('1')))) throw (`Not Enough Balance, You should have at least ${shouldBeBalanceMsg.toString()} polygon in your SCW wallet`)

            console.log("stargateTx", stargateTx)
            const sendTx = {to: stargateTx.to, data: stargateTx.data, value: stargateTx.value,}
            const txResponseOfBiconomyAA = await smartAccount?.sendTransactionBatch({transactions: [approveTx, sendTx],})
            const txReciept = await txResponseOfBiconomyAA?.wait()
            console.log("userOp hash", txResponseOfBiconomyAA?.hash)
            console.log("Tx hash", txReciept?.transactionHash)
            setTxHash(txReciept?.transactionHash)
            setSendtxLoading(false)
        } catch (error) {
            setSendtxLoading(false)
            console.log("sendTx-error: ", error)
            alert("Transaction Error: " + error)
            return
        }
    }

    return (
        <>
            {!smartAccount && (
                <div className={box1}>
                    <h3>Login First!</h3>
                </div>
            )}
            {smartAccount && (
                <div className={center}>
                    <div className={box1}>
                        <h3>From Network: </h3>
                        <select
                            style={{width: "50%", padding: "10px"}}
                            name="networks"
                            id="networks"
                            onChange={(e: any) => onChangeFromNetwork(e.target.value)}
                        >
                            <option value="109">Polygon</option>
                        </select>
                        <select
                            style={{width: "50%", padding: "10px"}}
                            name="networks"
                            id="networks"
                            onChange={(e: any) => onChangeTokenIn(e.target.value)}
                        >
                            {/* <option value="usdt">USDT</option> */}
                            <option value="usdc">USDC</option>
                            {/* <option value="dai">DAI</option> */}
                        </select>
                        <div style={{marginTop: "2%"}}>
                            <h3>AmountIn USD: </h3>
                            <input
                                style={{
                                    width: "50%",
                                    height: "50%",
                                    padding: "10px",
                                    marginLeft: "20%",
                                    marginRight: "20%",
                                    marginBottom: "2%",
                                }}
                                placeholder="AmountIn"
                                value={amountIn != 0
                                        ? bg(amountIn).dividedBy(bg(10).pow(tokenInDecimals)).toString()
                                        : amountIn}
                                onChange={(e: any) => handleAmountIn(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={box1}>
                        <h3>To Network: </h3>
                        <select
                            style={{width: "50%", padding: "10px"}}
                            name="networks"
                            id="networks"
                            onChange={(e: any) => onChangeToNetwork(e.target.value)}
                            // value={allNetworkData}
                        >
                            <option value="">-</option>
                            <option value="106">Avalanche</option>
                            <option value="110">Arbitrum</option>
                            <option value="111">Optimism</option>
                            {/* <option value="101">Mainnet</option> */}
                            {/* <option value="109">Polygon</option> */}
                        </select>
                        <div style={{marginTop: "2%"}}>
                            <h3>Contract Address: </h3>
                            <select
                                style={{width: "50%", padding: "10px"}}
                                name="contractAddresses"
                                id="contractAddresses"
                                onChange={(e: any) => handleContractAddress(e.target.value)}
                                value={contractIndex}
                            >
                                <option key={"0x"} value="">-</option>
                                {
                                    allNetworkData &&
                                    allNetworkData.contracts.length > 0 &&
                                    allNetworkData.contracts.map((
                                    contractDetails: any, contractIndex: any
                                ) => (
                                    <option key={contractIndex} value={contractIndex}>
                                        {contractDetails.contractName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={box1}>
                        {allNetworkData && <h3>ContractName: {allNetworkData.contracts[contractIndex]?.contractName}</h3>}
                        <h4>Select function name from below:</h4>
                        <select
                            style={{width: "50%", padding: "10px"}}
                            name="funcNames"
                            id="funcNames"
                            onChange={(e: any) => onChangeFunctions(e.target.value)}
                        >
                            <option key={-1} value="">-</option>
                            {funcArray.length > 0 && funcArray.map((funcName: any, funcIndex: any) => (
                                <option key={funcIndex} value={funcIndex}>
                                    {funcName.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={box1}>
                        {currentFunc && (
                            <>
                                <h2 style={{marginTop: "10px"}}>Selected Method and its Params</h2>
                                <h3 style={{marginTop: "10px"}}>
                                    MethodName:{" "} {funcArray.length > 0 && funcArray[currentFuncIndex].name}
                                </h3>
                                <h4>{bg(amountIn).dividedBy(bg(10).pow(tokenInDecimals)).toString()} USDC will bridge from {NetworkNameByChainId[fromChainId]} to {NetworkNameByChainId[toChainId]} and call {funcArray[currentFuncIndex].name} method and deposit into aave.</h4>
                            </>
                        )}
                        {currentFunc && currentFuncIndex >= 0 && funcArray.length > 0 &&
                            funcArray[currentFuncIndex].inputs.map(
                                (input: any, inputIndex: any) => (
                                    <>
                                        <label>
                                            { isThisAmount == inputIndex
                                                && input.type == "uint256" ? (
                                                <div style={{marginTop: "10px"}}>
                                                <p>{input.name}</p>
                                                    <button
                                                        style={{backgroundColor: "blue", color: "white",}}
                                                        onClick={(e: any) => isThisFieldAmount(inputIndex)}
                                                    >
                                                        isThisAmountFields
                                                    </button>
                                                    <input
                                                        style={{
                                                            padding: "10px",
                                                            marginLeft: "20%",
                                                            marginRight: "20%",
                                                            marginBottom: "2%",
                                                            width: "50%",
                                                        }}
                                                        disabled
                                                        placeholder={input.name + " " + input.type}
                                                        value={
                                                            params[currentFuncIndex] &&
                                                            params[currentFuncIndex][inputIndex] != "" ?
                                                                bg(params[currentFuncIndex][inputIndex]).
                                                                dividedBy(bg(10).pow(tokenInDecimals)).toString()
                                                                : bg(amountIn)
                                                                    .dividedBy(bg(10).pow(tokenInDecimals)).toString()
                                                        }
                                                        onChange={(e: any) =>
                                                            onChangeInput(currentFuncIndex, inputIndex,e.target.value)
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <div style={{marginTop: "10px"}}>
                                                <p>{input.name}</p>
                                                <input
                                                    style={{
                                                        padding: "10px",
                                                        marginLeft: "20%",
                                                        marginRight: "20%",
                                                        marginBottom: "2%",
                                                        width: "50%",
                                                    }}
                                                    disabled={fixParams[inputIndex] == 1 ? true : false}
                                                    placeholder={input.name + " " + input.type}
                                                    value = {
                                                        params[currentFuncIndex] &&
                                                        params[currentFuncIndex][inputIndex] != undefined
                                                            ? params[currentFuncIndex][inputIndex] : ""
                                                    }
                                                    onChange={(e: any) =>
                                                        onChangeInput(currentFuncIndex, inputIndex, e.target.value)
                                                    }
                                                />
                                                </div>
                                            )}
                                        </label>
                                    </>
                                )
                            )}

                        {simulation != undefined && (
                            <h5>Simulation: {simulation ? "Success" : "failed"}</h5>
                        )}
                        {simulation != undefined && (
                            <h5>MethodName: sgReceive</h5>
                        )}
                        {simulation != undefined && (
                            <h5>Gas will use in gwei: {gasUsed}</h5>
                        )}
                        {simulation != undefined && (
                            <h5 style={{width: "100%", wordWrap: "break-word", display: "inline-block",}}>
                                Destination Calldata: {simulateInputData}
                            </h5>
                        )}

                        {currentFunc && (
                            <div>
                                <button
                                    className={buttonload}
                                    onClick={(e: any) => simulate(currentFuncIndex)}
                                >
                                    {simulateLoading && (<i className="fa fa-spinner fa-spin"></i>)}
                                    simulate
                                </button>
                                <button
                                    className={buttonload}
                                    onClick={(e: any) => sendTx(currentFuncIndex)}
                                >
                                    {sendTxLoading && (<i className="fa fa-spinner fa-spin"></i>)}
                                    sendTx
                                </button>
                                {txhash && (
                                    <p>
                                        <a
                                            target="_blank"
                                            href={`https://socketscan.io/tx/${txhash}`} style={{color: "blue"}}
                                        >
                                            TxHash : {shorten(txhash)}
                                        </a>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

const center = css`
    padding: 60px 0;
    border: 3px solid grey;
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
const buttonload = css`
    background-color: #04aa6d; /* Green background */
    border: none; /* Remove borders */
    color: white; /* White text */
    padding: 12px 24px; /* Some padding */
    font-size: 16px; /* Set a font-size */
    margin: 5px;
`

/* Add a right margin to each icon */
const fa = css`
    margin-left: -12px;
    margin-right: 8px;
`
