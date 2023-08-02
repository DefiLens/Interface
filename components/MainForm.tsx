import {useEffect, useState} from "react"
import {css} from "@emotion/css"
import web3 from "web3"
import {BigNumber, Signer, ethers} from "ethers"
import {BigNumber as bg} from "bignumber.js"
import IStarGateRouter from "../abis/IStarGateRouter.json"
import IERC20 from "../abis/IERC20.json"
import ChainPing from "../abis/ChainPing.json"
import {useAppStore} from "../store/appStore"
import {
    checkIfContractIsProxy,
    getAbiUsingExplorereUrl,
    batch,
    calculateFees,
    fetchContractDetails,
    avaxContracts,
} from "../utils/helper"
import {MAINNET_INFURA} from "../utils/keys"
import {useAddress, useSigner} from "@thirdweb-dev/react"

export default function MainForm() {
    const address = useAddress() // Detect the connected address
    const signer: any = useSigner() // Detect the connected address

    const _functionType = 1
    const _nonce = 1
    const userAddress = "0xb50685c25485CA8C520F5286Bbbf1d3F216D6989"
    const polygonUSDTAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    const polygonUSDCAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
    const polygonDAIAddress = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
    const avaxUSDTAddress = "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7" // avax mainnet usdt
    const avaxUSDCAddress = "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E"
    const polygonStargateRouter = "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd"
    const toAddress = "0x6FE8e3E0c47043f136640dF7972C1e3F144B807F"
    const {smartAccount}: any = useAppStore((state) => state)

    const [fromChainId, setFromChainId] = useState<any>("109")
    const [toChainId, setToChainId] = useState<any>("106")
    const [srcPoolId, setSrcPoolId] = useState<any>(1)
    const [destPoolId, setDestPoolId] = useState<any>(1)
    const [contractAddress, setContractAddress] = useState<any>()
    const [amountIn, setAmountIn] = useState<any>()
    const [funcArray, setFunctionArray] = useState<any[]>([])
    const [params, setParams] = useState<any>([[]])
    const [currentAbi, setAbi] = useState<any>()
    const [amountFieldIndexes, setAmountFieldIndexes] = useState<any>()
    const [currentFunc, setCurrentFunc] = useState<any>()
    const [currentFuncIndex, setCurrentFuncIndex] = useState<any>(0)
    const [contractName, setContractName] = useState<any>()
    const [isThisAmount, setIsThisFieldAmount] = useState<any>()
    const [tokenIn, setTokenIn] = useState<any>(polygonUSDCAddress)
    const [tokenInDecimals, setTokenInDecimals] = useState<any>(6)
    const [simulation, setSimulation] = useState<any>()
    const [gasUsed, setGasUsed] = useState<any>()
    const [inputData, setInputData] = useState<any>()
    const [simulateLoading, setSimulationLoading] = useState<any>(false)
    const [sendTxLoading, setSendtxLoading] = useState<any>(false)
    const [txhash, setTxHash] = useState<any>(false)

    useEffect(() => {
        setTokenIn(polygonUSDCAddress)
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
        setInputData(undefined)
        setSimulation(undefined)
    }

    const onChangeFromNetwork = async (_fromNetwork: any) => {
        setFromChainId(_fromNetwork)
    }

    const onChangeToNetwork = async (_toNetwork: any) => {
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
            setTokenIn(polygonUSDCAddress)
            setTokenInDecimals(6)
            setSrcPoolId(1)
            setDestPoolId(1)
        } else if (tokenIn == "usdt") {
            setTokenIn(polygonUSDTAddress)
            setTokenInDecimals(6)
            setSrcPoolId(2)
            setDestPoolId(2)
        } else if (tokenIn == "dai") {
            setTokenIn(polygonDAIAddress)
            setTokenInDecimals(18)
            setSrcPoolId(3)
            setDestPoolId(3)
        }
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

        setGasUsed(undefined)
        setInputData(undefined)
        setSimulation(undefined)
    }

    const onChangeInput = async (
        funcIndex: any,
        inputIndex: any,
        inputValue: any
    ) => {
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
            setInputData(undefined)
            setSimulation(undefined)
            if (!smartAccount) {
                alert("You need to login")
                throw "You need to login"
            }
            if (contractAddress == "") {
                alert("enter contractAddress field")
                throw "enter contractAddress field"
            }
            if (amountIn == "") {
                alert("enter amountIn field")
                throw "enter amountIn field"
            }
            if (isThisAmount < 0) {
                alert("select amount field")
                throw "select amount field"
            }

            const abi = ethers.utils.defaultAbiCoder
            const provider = await ethers.getDefaultProvider()
            const signer: Signer = new ethers.VoidSigner(smartAccount, provider)
            const USDT = await new ethers.Contract(tokenIn, IERC20, smartAccount.provider)
            const balance = await USDT.balanceOf(smartAccount.address)
            if (BigNumber.from(balance).lt(BigNumber.from(amountIn))) {
                alert("You don't have enough balance")
                throw "You don't have enough balance"
            }

            const approveData = await USDT.populateTransaction.approve(polygonStargateRouter, amountIn)
            const approveTx = {to: approveData.to, data: approveData.data}
            console.log("approveTx", approveTx)

            console.log("params1", params[funcIndex])
            const amountAfterSlippage = await calculateFees(
                userAddress,
                amountIn,
                srcPoolId,
                destPoolId,
                toChainId,
                polygonStargateRouter,
                smartAccount.provider
            )
            params[funcIndex][isThisAmount] = amountAfterSlippage.toString()
            console.log("params2", params[funcIndex])

            let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi)
            const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
            const destChainExecTx = {to: contractAddress, data: destChainExecData,}
            const data = abi.encode(
                ["uint256", "address", "address", "bytes"],
                [BigNumber.from("0"), contractAddress, smartAccount.address, destChainExecTx.data,]
            )

            const srcAddress = ethers.utils.solidityPack(["address"], [smartAccount.address])
            let abiInterfaceForChainPing = new ethers.utils.Interface(ChainPing)
            const stargateParams = [
                fromChainId,
                srcAddress,
                _nonce,
                avaxUSDCAddress,
                amountAfterSlippage,
                data,
            ]
            const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData("sgReceive", stargateParams)
            const erc20Interface = new ethers.utils.Interface([
                "function transfer(address _account, uint256 _value)",
            ])
            const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [toAddress, amountAfterSlippage])
            const simulation = await batch(
                userAddress,
                avaxUSDCAddress,
                toAddress,
                dummmyTranferToCheckData,
                encodedDataForChainPing,
                true,
                chooseChianId(toChainId)
            )

            setGasUsed(simulation.simulation.gas_used)
            setInputData(simulation.simulation.input)
            setSimulation(simulation.simulation.status)
            setSimulationLoading(false)

            console.log("simulation-status: ", simulation.simulation.status)
            console.log("simulation-input: ", simulation.simulation.input)
            console.log("simulation-method: ", simulation.simulation.method)
            console.log("simulation-gasused: ", simulation.simulation.gas_used)
        } catch (error) {
            setSimulationLoading(false)
            console.log("simulate-error: ", error)
            alert("Simulation Failed")
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
            if (!smartAccount.address) {
                alert("You need to login")
                throw "You need to login"
            }
            if (!smartAccount) {
                alert("You need to login2")
                throw "You need to login2"
            }
            if (!simulation) {
                alert("simulation failed")
                throw "simulation failed"
            }
            if (contractAddress == "") {
                alert("enter contractAddress field")
                throw "enter contractAddress field"
            }
            if (amountIn == "") {
                alert("enter amountIn field")
                throw "enter amountIn field"
            }
            if (isThisAmount < 0) {
                alert("select amount field")
                throw "select amount field"
            }
            setTxHash("")
            const abi = ethers.utils.defaultAbiCoder
            // const provider = await ethers.getDefaultProvider()
            // const signer = new ethers.VoidSigner(currentAddress, provider)
            const USDT = await new ethers.Contract(tokenIn, IERC20, smartAccount.provider)
            const balance = await USDT.balanceOf(smartAccount.address)
            if (BigNumber.from(balance).lt(BigNumber.from(amountIn))) {
                alert("You don't have enough balance")
                throw "You don't have enough balance"
            }

            const approveData = await USDT.populateTransaction.approve(polygonStargateRouter,amountIn)
            const approveTx = {to: approveData.to, data: approveData.data}
            console.log("approveTx", approveTx)

            console.log("params1", params[funcIndex])
            const amountAfterSlippage = await calculateFees(
                userAddress,
                amountIn,
                srcPoolId,
                destPoolId,
                toChainId,
                polygonStargateRouter,
                smartAccount.provider
            )
            params[funcIndex][isThisAmount] = amountAfterSlippage.toString()
            console.log("params2", params[funcIndex])

            let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi)
            const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
            const destChainExecTx = {to: contractAddress, data: destChainExecData,}
            const data = abi.encode(
                ["uint256", "address", "address", "bytes"],
                [BigNumber.from("0"), contractAddress, smartAccount.address, destChainExecTx.data,]
            )

            const srcAddress = ethers.utils.solidityPack(["address"],[smartAccount.address])
            let abiInterfaceForChainPing = new ethers.utils.Interface(ChainPing)
            const stargateParams = [
                fromChainId,
                srcAddress,
                _nonce,
                avaxUSDCAddress,
                amountAfterSlippage,
                data,
            ]
            const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData("sgReceive",stargateParams)
            const erc20Interface = new ethers.utils.Interface([
                "function transfer(address _account, uint256 _value)",
            ])
            const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [toAddress, amountAfterSlippage])
            const gasUsed = await batch(
                userAddress,
                avaxUSDCAddress,
                toAddress,
                dummmyTranferToCheckData,
                encodedDataForChainPing,
                false,
                chooseChianId(toChainId)
            )
            console.log("gasUsed: ", gasUsed)

            const stargateRouter = await new ethers.Contract(polygonStargateRouter, IStarGateRouter, smartAccount.provider)
            const lzParams = {dstGasForCall: gasUsed, dstNativeAmount: 0, dstNativeAddr: "0x",}
            const packedToAddress = ethers.utils.solidityPack(["address"], [toAddress])
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
            alert("Transaction Failed")
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
                            <h3>AmountIn USDT: </h3>
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
                            {/* <option value="109">Polygon</option>
                            <option value="110">Arbitrum</option>
                            <option value="111">Optimism</option>
                            <option value="101">Mainnet</option> */}
                        </select>
                        <div style={{marginTop: "2%"}}>
                            <h3>Contract Address: </h3>
                            <select
                                style={{width: "50%", padding: "10px"}}
                                name="contractAddresses"
                                id="contractAddresses"
                                onChange={(e: any) => handleContractAddress(e.target.value)}
                            >
                                <option value="">-</option>
                                {avaxContracts.length > 0 && avaxContracts.map((
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
                            {/* <option value={-1}>-</option> */}
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
                            </>
                        )}
                        {currentFunc && currentFuncIndex >= 0 && funcArray.length > 0 &&
                            funcArray[currentFuncIndex].inputs.map(
                                (input: any, inputIndex: any) => (
                                    <>
                                        <label>
                                            {amountFieldIndexes[currentFuncIndex] == inputIndex
                                                && input.type == "uint256" ? (
                                                <>
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
                                                </>
                                            ) : (
                                                <input
                                                    style={{
                                                        padding: "10px",
                                                        marginLeft: "20%",
                                                        marginRight: "20%",
                                                        marginBottom: "2%",
                                                        width: "50%",
                                                    }}
                                                    placeholder={input.name + " " + input.type}
                                                    value={params[currentFuncIndex] &&
                                                            params[currentFuncIndex][inputIndex] != ""
                                                            ? params[currentFuncIndex][inputIndex]
                                                            : ""}
                                                    onChange={(e: any) =>
                                                        onChangeInput(currentFuncIndex, inputIndex, e.target.value)
                                                    }
                                                />
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
                                Destination Calldata: {inputData}
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
                                <p>TxHash : {txhash}</p>
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
