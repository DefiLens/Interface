import * as React from 'react';
import {useEffect, useState} from "react"
import {css} from "@emotion/css"
import {BigNumber, Signer, ethers} from "ethers"
import {BigNumber as bg} from "bignumber.js"
import IStarGateRouter from "../abis/IStarGateRouter.json"
import IERC20 from "../abis/IERC20.json"
import ChainPing from "../abis/ChainPing.json"
import {useAppStore} from "../store/appStore"
import {
    batch,
    calculateFees,
    fetchContractDetails,
    shorten,
} from "../utils/helper"
import {useAddress, useSigner} from "@thirdweb-dev/react"
import {
    _functionType,
    _nonce,
    contractsDetails
} from "../utils/constants"
import { parseEther } from 'ethers/lib/utils';

export default function MainForm() {
    const address = useAddress() // Detect the connected address
    const signer: any = useSigner() // Detect the connected address

    const polygonContractDetails: any = contractsDetails['109']

    const {smartAccount}: any = useAppStore((state) => state)
    const [fromChainId, setFromChainId] = useState<any>("109")
    const [toChainId, setToChainId] = useState<any>("106")
    const [srcPoolId, setSrcPoolId] = useState<any>(1)
    const [destPoolId, setDestPoolId] = useState<any>(1)

    const [tokenIn, setTokenIn] = useState<any>(polygonContractDetails?.USDC)
    const [tokenInDecimals, setTokenInDecimals] = useState<any>(6)
    const [contractAddress, setContractAddress] = useState<any>()
    const [amountIn, setAmountIn] = useState<any>()

    const [funcArray, setFunctionArray] = useState<any[]>([])
    const [params, setParams] = useState<any>([[]])
    const [currentAbi, setAbi] = useState<any>()
    const [currentFunc, setCurrentFunc] = useState<any>()
    const [currentFuncIndex, setCurrentFuncIndex] = useState<any>(0)
    const [contractName, setContractName] = useState<any>()

    const [amountFieldIndexes, setAmountFieldIndexes] = useState<any>()
    const [isThisAmount, setIsThisFieldAmount] = useState<any>()

    const [simulation, setSimulation] = useState<any>()
    const [gasUsed, setGasUsed] = useState<any>()
    const [simulateInputData, setSimulateInputData] = useState<any>()
    const [simulateLoading, setSimulationLoading] = useState<any>(false)
    const [sendTxLoading, setSendtxLoading] = useState<any>(false)

    const [txhash, setTxHash] = useState<any>(false)

    useEffect(() => {
        console.log('smartAccount-started', smartAccount)
        setContractAddress("")
    }, [])

    useEffect(() => {
        if (currentFuncIndex) {
            let _params: any = []
            const toContractData = contractsDetails[toChainId]
            _params[0] = toContractData.USDC
            _params[1] = amountIn
            _params[2] = address
            _params[3] = "0"
            let _func = [...params]
            _func[currentFuncIndex] = _params
            setParams(_func)
        }
    }, [amountIn])


    useEffect(() => {
        setTokenIn(polygonContractDetails.USDC)
        setTokenInDecimals(6)
        setAmountIn("")
    }, [fromChainId])

    useEffect(() => {
        setContractAddress("")
        resetField()
    }, [toChainId])

    useEffect(() => {
        if (contractAddress) {
            resetField()
            generateAbis()
        }
    }, [contractAddress, smartAccount])

    const resetField = async () => {
        setFunctionArray([])
        setParams("")
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

    const onChangeToNetwork = async (_toNetwork: any) => {
        const scwNativeBalance = await smartAccount.provider.getBalance(smartAccount.address)
        console.log("scwNativeBalance", scwNativeBalance.toString())
        setToChainId(_toNetwork)
    }

    const handleContractAddress = async (_contractAddress) => {
        if (!smartAccount) {
            alert("You need to biconomy login")
            return
        }
        setContractAddress(_contractAddress)
    }

    // for e.g usdt -> usdc
    const onChangeTokenIn = async (tokenIn: any) => {
        if (tokenIn == "usdc") {
            setTokenIn(polygonContractDetails.USDC)
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
        console.log("funcIndex: ", funcIndex)
        setParams("")
        setCurrentFunc(funcArray[funcIndex].name)
        setCurrentFuncIndex(funcIndex)
        setIsThisFieldAmount(amountFieldIndexes[funcIndex])

        let _params: any = []
        const toContractData = contractsDetails[toChainId]
        _params[0] = toContractData.USDC
        _params[1] = amountIn
        _params[2] = address
        _params[3] = "0"
        let _func = [...params]
        _func[funcIndex] = _params
        setParams(_func)

        setGasUsed(undefined)
        setSimulateInputData(undefined)
        setSimulation(undefined)
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
            if (!contractAddress) return
            if (!smartAccount) return
            if (!toChainId) return
            const provider = smartAccount.provider
            let {abi, amountFieldIndex, contractName}: any = await fetchContractDetails(provider, contractAddress, toChainId)
            console.log("abi: ", abi)
            setAbi(abi)
            setContractName(contractName)
            setAmountFieldIndexes(amountFieldIndex)

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
            if (contractAddress == "") throw "Enter contractAddress field"
            if (amountIn == "") throw "Enter amountIn field"
            if (isThisAmount < 0) throw "Select amount field"

            const fromContractData = contractsDetails[fromChainId]
            const toContractData = contractsDetails[toChainId]

            const abi = ethers.utils.defaultAbiCoder
            // const provider = await ethers.getDefaultProvider()
            // const signer: Signer = new ethers.VoidSigner(smartAccount, provider)
            const USDT = await new ethers.Contract(tokenIn, IERC20, smartAccount.provider)
            const balance = await USDT.balanceOf(smartAccount.address)

            if (BigNumber.from(balance).lt(BigNumber.from(amountIn))) throw "You don't have enough balance"

            const approveData = await USDT.populateTransaction.approve(fromContractData.stargateRouter, amountIn)
            const approveTx = {to: approveData.to, data: approveData.data}
            console.log("approveTx", approveTx)

            console.log("params1", params[funcIndex])
            const amountAfterSlippage = await calculateFees(
                address,
                amountIn,
                srcPoolId,
                destPoolId,
                toChainId,
                fromContractData.stargateRouter,
                smartAccount.provider
            )
            params[funcIndex][isThisAmount] = amountAfterSlippage.toString()
            console.log("params2", params[funcIndex])

            let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi)
            console.log("abiInterfaceForDestDefiProtocol", abiInterfaceForDestDefiProtocol, currentFunc)

            // const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
            const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(
                currentFunc,
                [toContractData.USDC, params[funcIndex][1], address, 0]
            )
            console.log("destChainExecData", destChainExecData)

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
                toContractData.USDC,
                amountAfterSlippage,
                data,
            ]
            const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData("sgReceive", stargateParams)
            const erc20Interface = new ethers.utils.Interface([
                "function transfer(address _account, uint256 _value)",
            ])
            const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [toContractData.ChainPing, amountAfterSlippage])
            const simulation = await batch(
                address,
                toContractData.USDC,
                toContractData.ChainPing,
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

    const chooseChianId = (stargateChainId: any) => {
        let realChainId = "0"
        if (stargateChainId == "106") {
            realChainId = "43114"
        } else if (stargateChainId == "109") {
            realChainId = "137"
        } else if (stargateChainId == "110") {
            realChainId = "42161"
        } else if (stargateChainId == "111") {
            realChainId = "10"
        } else if (stargateChainId == "101") {
            realChainId = "1"
        }
        return realChainId
    }

    const sendTx = async (funcIndex: any) => {
        try {
            setSendtxLoading(true)
            if (!smartAccount) throw "You need to login"
            if (!simulation) throw "First simulate then send Tx"
            if (contractAddress == "") throw "Enter contractAddress field"
            if (amountIn == "") throw "Enter amountIn field"
            if (isThisAmount < 0) throw "Select amount field"

            // const scwNativeBalance = await smartAccount.get

            const fromContractData = contractsDetails[fromChainId]
            const toContractData = contractsDetails[toChainId]

            setTxHash("")
            const abi = ethers.utils.defaultAbiCoder

            // const provider = await ethers.getDefaultProvider()
            // const signer = new ethers.VoidSigner(smartAccount.address, provider)
            // const scwNativeBalance = await signer.getBalance()
            // console.log("scwNativeBalance", scwNativeBalance)

            const USDT = await new ethers.Contract(tokenIn, IERC20, smartAccount.provider)
            const balance = await USDT.balanceOf(smartAccount.address)
            if (BigNumber.from(balance).lt(BigNumber.from(amountIn))) throw "You don't have enough balance"

            const approveData = await USDT.populateTransaction.approve(fromContractData.stargateRouter,amountIn)
            const approveTx = {to: approveData.to, data: approveData.data}
            console.log("approveTx", approveTx)

            console.log("params1", params[funcIndex])
            const amountAfterSlippage = await calculateFees(
                address,
                amountIn,
                srcPoolId,
                destPoolId,
                toChainId,
                fromContractData.stargateRouter,
                smartAccount.provider
            )
            params[funcIndex][isThisAmount] = amountAfterSlippage.toString()
            console.log("params2", params[funcIndex])

            let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi)
            // const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
            const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(
                currentFunc,
                [toContractData.USDC, params[funcIndex][1], address, 0]
            )
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
                toContractData.USDC,
                amountAfterSlippage,
                data,
            ]
            const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData("sgReceive",stargateParams)
            const erc20Interface = new ethers.utils.Interface([
                "function transfer(address _account, uint256 _value)",
            ])
            const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [toContractData.ChainPing, amountAfterSlippage])
            const gasUsed = await batch(
                address,
                toContractData.USDC,
                toContractData.ChainPing,
                dummmyTranferToCheckData,
                encodedDataForChainPing,
                false,
                chooseChianId(toChainId)
            )
            console.log("gasUsed: ", gasUsed)

            const stargateRouter = await new ethers.Contract(fromContractData.stargateRouter, IStarGateRouter, smartAccount.provider)
            const lzParams = {dstGasForCall: gasUsed, dstNativeAmount: 0, dstNativeAddr: "0x",}
            const packedToAddress = ethers.utils.solidityPack(["address"], [toContractData.ChainPing])
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
            // if (error == "Not enough gas fee in your SCW Wallet"){
            //     alert("Not enough gas fee in your SCW Walle")
            //     alert("You shoul")
            // }
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
                        >
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
                                value={contractAddress}
                            >
                                <option value="">-</option>
                                {
                                    contractsDetails[toChainId].contractAddresses.length > 0 &&
                                    contractsDetails[toChainId].contractAddresses.map((
                                    contractDetails: any, contractIndex: any
                                ) => (
                                    <option value={contractDetails.contractAddress}>
                                        {contractDetails.contractName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {contractName && <h4>ContractName: {contractName}</h4>}
                    </div>

                    <div className={box1}>
                        {contractName && <h3>ContractName: {contractName}</h3>}
                        <h4>Select function name from below:</h4>
                        <select
                            style={{width: "50%", padding: "10px"}}
                            name="funcNames"
                            id="funcNames"
                            onChange={(e: any) => onChangeFunctions(e.target.value)}
                        >
                            <option value="">-</option>
                            {funcArray.length > 0 && funcArray.map((funcName: any, funcIndex: any) => (
                                <option value={funcIndex}>
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
                                <h4>{bg(amountIn).dividedBy(bg(10).pow(tokenInDecimals)).toString()} USDC will bridge from {contractsDetails[fromChainId].network} to {contractsDetails[toChainId].network} and call {funcArray[currentFuncIndex].name} method and deposit into aave.</h4>
                            </>
                        )}
                        {currentFunc && currentFuncIndex >= 0 && funcArray.length > 0 &&
                            funcArray[currentFuncIndex].inputs.map(
                                (input: any, inputIndex: any) => (
                                    <>
                                        <label>
                                            {amountFieldIndexes[currentFuncIndex] == inputIndex
                                                && input.type == "uint256" ? (
                                                <div style={{marginTop: "10px"}}>
                                                <p>{input.name}</p>
                                                    <button
                                                        style={{backgroundColor: "blue", color: "white",}}
                                                        onClick={(e: any) => isThisFieldAmount(inputIndex)}
                                                    >
                                                        isThisAmountField
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
                                                    disabled
                                                    placeholder={input.name + " " + input.type}
                                                    value = {
                                                        params[currentFuncIndex] &&
                                                        params[currentFuncIndex][inputIndex] != ""
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
