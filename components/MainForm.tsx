import * as React from "react";
import { useEffect } from "react";
import { BigNumber as bg } from "bignumber.js";
import { BiSolidDownArrow } from "react-icons/bi";
import { ImSpinner9, ImSpinner } from "react-icons/im";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { useSigner, useAddress } from "@thirdweb-dev/react";
import { useAppStore } from "../store/appStore";
import { shorten } from "../utils/helper"
import { _functionType, _nonce, methodWithApi, tokensByNetwork } from "../utils/constants"
import { fetchMethodParams, getNetworkAndContractData } from '../utils/apis';
import { useSendTx } from "../hooks/useSendTx";
import { useSimulate } from "../hooks/useSimulate";
import { useGenerateAbis } from "../hooks/useGenerateAbis";
import { Presets, Client } from "userop";
import { STACKUP_POLYGON_MAINNET_RPC_NODE_URL } from "../utils/keys";
import { useOnChangeFunctions, useOnChangeInput, useOnChangeTokenIn } from "../hooks/useOnChangeMainForm";

export default function MainForm() {
  const address = useAddress(); // Detect the connected address
  const signer: any = useSigner(); // Detect the connected address
  const { mutateAsync: sendTxToChain } = useSendTx();
  const { mutateAsync: simulateTx } = useSimulate();
  const { mutateAsync: generateAbisForContract } = useGenerateAbis();
  const { mutateAsync: onChangeTokenInHook } = useOnChangeTokenIn();
  const { mutateAsync: onChangeFunctionsHook } = useOnChangeFunctions();
  const { mutateAsync: onChangeInputHook } = useOnChangeInput();

  const polygonUSDC: any = tokensByNetwork['109'].usdc

  const {
    smartAccount,

    fromChainId, setFromChainId,
    toChainId, setToChainId,
    srcPoolId, setSrcPoolId,
    destPoolId, setDestPoolId,

    tokenIn, setTokenIn,
    tokenInDecimals, setTokenInDecimals,
    amountIn, setAmountIn,
    isThisAmount, setIsThisFieldAmount,

    contractIndex, setContractIndex,
    allNetworkData, setData,
    currentAbi, setAbi,
    currentFunc, setCurrentFunc,
    currentFuncIndex, setCurrentFuncIndex,

    funcArray, setFunctionArray,
    params, setParams,
    fixParams, setFixParams,

    isSimulationOpen, setIsSimulationOpen,
    isSimulationSuccessOpen, setIsSimulationSuccessOpen,
    isSimulationErrorOpen, setIsSimulationErrorOpen,
    simulationErrorMsg, setsimulationErrorMsg,
    simulation, setSimulation,
    gasUsed, setGasUsed,
    simulateInputData, setSimulateInputData,
    simulateLoading, setSimulationLoading,

    sendTxLoading, setSendtxLoading,
    txhash, setTxHash,

  }: any = useAppStore((state) => state);

  useEffect(() => {
    async function updateParams() {
        if (currentFuncIndex) {
            setParams("")
            setFixParams("")
            const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress
            const apiUrl = methodWithApi[toChainId][contractAddress][funcArray[currentFuncIndex].name]

            const response: any = await fetchMethodParams(fromChainId, toChainId, funcArray, amountIn, smartAccount, address, currentFuncIndex, currentFunc, apiUrl)
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
    await onChangeTokenInHook({fromChainId, tokenIn})
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
    await onChangeFunctionsHook({funcIndex, address})
  }

  const onChangeInput = async (
      funcIndex: any,
      inputIndex: any,
      inputValue: any
  ) => {
    await onChangeInputHook({funcIndex, inputIndex, inputValue})
  }

  const isThisFieldAmount = async (index: any) => {
      if (index >= 0) {
          setIsThisFieldAmount(index)
      } else {
          alert("Somethig gets wrong")
      }
  }

  const generateAbis = async () => {
    await generateAbisForContract()
  }

  const simulate = async (funcIndex: any) => {
    simulateTx({funcIndex, address})
  };

  const sendTx = async (funcIndex: any) => {
      await sendTxToChain({funcIndex, address})
  };

  // const checkStackUp = async () => {
  //   try {
  //     console.log('funcArray-', funcArray)
  //     // const builder = await Presets.Builder.Kernel.init(signer, STACKUP_POLYGON_MAINNET_RPC_NODE_URL)
  //     // const address = await builder.getSender()
  //     // console.log('address-', address)
  //   } catch (error) {
  //     console.log('checkStackUp-error', error)
  //   }
  // }

  const inputContainer =
    "w-full relative float-label-input shadow-md rounded-md";

  const inputBoxStyle =
    "w-full bg-white focus:outline-none focus:shadow-outline border-2  rounded-md p-2 block appearance-none leading-normal focus:border-primary-950";

  const inputLabelStyle =
    "absolute top-2 left-0 text-secondary-800 text-md pointer-events-none rounded-full transition duration-200 ease-in-outbg-white px-3";

  const selectContainer =
    "w-full relative border-2 border-secondary-300 text-secondary-800 bg-white shadow-md rounded-md";

  const selectBoxStyle = "appearance-none w-full p-2 bg-white rounded-md";
  const selectAppearanceStyle =
    "pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-3 text-secondary-500 border-l-2";
  return (
    <>
      {/* <button
        type="button"
        className="text-secondary-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-secondary-600 hover:text-white"
        onClick={() => checkStackUp()}
      >
        Check
      </button> */}
      {!smartAccount && (
        <div className="flex justify-center items-center border-2 border-secondary-800 shadow-sm shadow-primary-950 rounded-lg cursor-pointer">
          <h3 className="font-semibold text-lg md:text-2xl text-primary-950 py-4 bg-transparent ">
            Login First!
          </h3>
        </div>
      )}
      {smartAccount && (
        <div className="h-full flex flex-col justify-center items-center gap-5 border-2 border-secondary-800 shadow-sm shadow-primary-950 rounded-lg cursor-pointer p-10">
          <div className="w-full flex justify-center items-center gap-3">
            <div className={selectContainer}>
              <label htmlFor="fromNetwork" className="sr-only">
                From Network
              </label>
              <select
                className={selectBoxStyle}
                placeholder="From Network"
                name="networks"
                id="fromNetwork"
                onChange={(e: any) => onChangeFromNetwork(e.target.value)}
              >
                <option value="" disabled selected>
                  From Network
                </option>
                <option value="109">Polygon</option>
              </select>
              <div className={selectAppearanceStyle}>
                <BiSolidDownArrow size="15px" />
              </div>
            </div>

            <div className={selectContainer}>
              <label htmlFor="token" className="sr-only">
                Token
              </label>
              <select
                className={selectBoxStyle}
                placeholder="Token"
                name="networks"
                id="token"
                onChange={(e: any) => onChangeTokenIn(e.target.value)}
              >
                <option value="" disabled selected>
                  Token
                </option>
                {/* <option value="usdt">USDT</option> */}
                <option value="usdc">USDC</option>
                {/* <option value="dai">DAI</option> */}
              </select>
              <div className={selectAppearanceStyle}>
                <BiSolidDownArrow size="15px" />
              </div>
            </div>

            <div className={inputContainer}>
              <input
                type="number"
                id="amountIn"
                placeholder=" "
                className={inputBoxStyle}
                value={
                  amountIn != 0
                    ? bg(amountIn)
                        .dividedBy(bg(10).pow(tokenInDecimals))
                        .toString()
                    : amountIn
                }
                onChange={(e: any) => handleAmountIn(e.target.value)}
              />
              <label htmlFor="amountIn" className={inputLabelStyle}>
                AmountIn
              </label>
            </div>
          </div>

          <div className="rounded-full my-5">
            <svg
              className="h-8 w-8 text-primary-950"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M3 9l4-4l4 4m-4 -4v14" />{" "}
              <path d="M21 15l-4 4l-4-4m4 4v-14" />
            </svg>
          </div>

          <div className="w-full flex justify-center items-center gap-3">
            <div className={selectContainer}>
              <label htmlFor="toNetwork" className="sr-only">
                To Network
              </label>
              <select
                className={selectBoxStyle}
                placeholder=" To Network"
                name="networks"
                id="toNetwork"
                onChange={(e: any) => onChangeToNetwork(e.target.value)}
              >
                <option value="" disabled selected>
                  To Network
                </option>
                <option value="106">Avalanche</option>
                <option value="110">Arbitrum</option>
                <option value="111">Optimism</option>
                <option value="184">Base</option>
                {/* <option value="101">Mainnet</option> */}
                {/* <option value="109">Polygon</option> */}
              </select>
              <div className={selectAppearanceStyle}>
                <BiSolidDownArrow size="15px" />
              </div>
            </div>

            <div className={selectContainer}>
              <label htmlFor="contractAddresses" className="sr-only">
                Contract Address
              </label>
              <select
                className={selectBoxStyle}
                placeholder="Contract Address"
                name="contractAddresses"
                id="contractAddresses"
                onChange={(e: any) => handleContractAddress(e.target.value)}
                value={contractIndex}
                >
                  <option key={"0x"} value="" disabled selected>
                    Contract Address
                  </option>
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
              <div className={selectAppearanceStyle}>
                <BiSolidDownArrow size="15px" />
              </div>
            </div>
            {/* {contractName && <h4>ContractName: {contractName}</h4>} */}
          </div>

          {isSimulationOpen && !allNetworkData ? (
            <div
              onClick={() => setIsSimulationOpen(false)}
              className="animate-spin mt-8 rounded-full"
            >
              <ImSpinner9 size={25} />
            </div>
          ) : (
            <div
              onClick={() => setIsSimulationOpen(true)}
              className="animate-bounce mt-8 rounded-full shadow-md shadow-slate-300 hover:shadow-lg hover:shadow-slate-500 transition duration-300"
            >
              <BsArrowRightCircleFill size={35} />
            </div>
          )}
        </div>
      )}

      {/* ------------- Simulation Model START ------------- */}
      {isSimulationOpen && allNetworkData && funcArray && (
        <div className="fixed top-0 right-0 left-0 z-50 backdrop-blur-sm  w-full flex justify-center items-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100vh] max-h-full">
          <div className="relative w-full max-w-4xl max-h-full rounded-lg shadow-lg bg-secondary-700 ">
            <div className="relative  rounded-lg shadow-lg bg-secondary-700">
              <div className="flex items-start justify-between p-4 rounded-t">
                <h3 className="font-semibold text-lg text-white">
                    Build DestinationChain Method/Calldata to execute after bridge funds
                  </h3>

                <button
                  type="button"
                  className="text-secondary-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-secondary-600 hover:text-white"
                  onClick={() => setIsSimulationOpen(false)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="py-3 px-6 text-white border-y-2 border-secondary-600">
                {allNetworkData && (
                  <h3 className="font-semibold text-lg">
                    Contract Detail :
                    <span className="font-normal text-base px-2">
                      {allNetworkData.contracts[contractIndex]?.contractName}
                    </span>
                  </h3>
                )}
              </div>

              <div className="h-96 flex justify-center items-start text-white rounded-lg border-2 border-secondary-600 m-3 ">
                <div className="w-[50%] h-full flex justify-center items-start px-5 py-3">
                  <div className={`${selectContainer}`}>
                    <label htmlFor="funcNames" className="sr-only">
                      Select Function Name
                    </label>
                    <select
                      className={`${selectBoxStyle} focus:outline-none`}
                      placeholder=" Select Function Name"
                      name="funcNames"
                      id="funcNames"
                      onChange={(e: any) => onChangeFunctions(e.target.value)}
                    >
                      <option key={-1} value="" disabled selected>
                        Select Function Name
                      </option>
                      {funcArray.length > 0 &&
                        funcArray.map((funcName: any, funcIndex: any) => (
                          <option key={funcIndex} value={funcIndex}>
                            {funcName.name}
                          </option>
                        ))}
                    </select>
                    <div className={selectAppearanceStyle}>
                      <BiSolidDownArrow size="15px" />
                    </div>
                  </div>
                </div>

                <div className="w-[50%] h-full flex flex-col justify-end items-center gap-3 border-l-2 border-l-secondary-600 p-3">
                  {currentFunc &&
                    currentFuncIndex >= 0 &&
                    funcArray.length > 0 &&
                    funcArray[currentFuncIndex].inputs.map(
                      (input: any, inputIndex: any) => (
                        <>
                          <label className="w-full">
                            {isThisAmount ==
                              inputIndex && input.type == "uint256" ? (
                              <div className="w-full flex flex-col justify-center items-center gap-1">
                                <p className="text-sm font-normal">
                                  {input.name}
                                </p>

                                <button
                                  onClick={(e: any) =>
                                    isThisFieldAmount(inputIndex)
                                  }
                                  className="py-1 px-3 text-xs font-normal bg-primary-600 rounded-lg"
                                >
                                  isThisAmountField
                                </button>
                                <input
                                  disabled
                                  placeholder={input.name + " " + input.type}
                                  value={
                                    params[currentFuncIndex] &&
                                    params[currentFuncIndex][inputIndex] != undefined
                                      ? bg(params[currentFuncIndex][inputIndex])
                                          .dividedBy(
                                            bg(10).pow(tokenInDecimals)
                                          )
                                          .toString()
                                      : bg(amountIn)
                                          .dividedBy(
                                            bg(10).pow(tokenInDecimals)
                                          )
                                          .toString()
                                  }
                                  // onChange={(e: any) =>
                                  //   onChangeInput(
                                  //     currentFuncIndex,
                                  //     inputIndex,
                                  //     e.target.value
                                  //   )
                                  // }
                                  className="w-full text-dark text-sm rounded-md bg-secondary-50 py-1 px-3 outline-none drop-shadow-sm transition-all duration-200 ease-in-out"
                                />
                              </div>
                            ) : (
                              <div className="w-full flex flex-col justify-center items-center gap-1">
                                <p className="text-sm font-normal">
                                  {input.name}
                                </p>
                                <input
                                  disabled
                                  placeholder={input.name + " " + input.type}
                                  value={
                                    params[currentFuncIndex] &&
                                    params[currentFuncIndex][inputIndex] != undefined
                                      ? params[currentFuncIndex][inputIndex]
                                      : ""
                                  }
                                  // onChange={(e: any) =>
                                  //   onChangeInput(
                                  //     currentFuncIndex,
                                  //     inputIndex,
                                  //     e.target.value
                                  //   )
                                  // }
                                  className="w-full text-dark text-sm rounded-md bg-secondary-50 py-1 px-3 outline-none drop-shadow-sm transition-all duration-200 ease-in-out"
                                />
                              </div>
                            )}
                          </label>
                        </>
                      )
                    )}

                  {currentFunc && (
                    <button
                      type="button"
                      onClick={(e: any) => simulate(currentFuncIndex)}
                      className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                    >
                      {simulateLoading && (
                        <ImSpinner className="animate-spin h-5 w-5" />
                      )}
                      Simulate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ------------- Simulation Model END ------------- */}

      {/* ------------- Simulation Success Model START ------------- */}
      {isSimulationSuccessOpen && simulation != undefined && (
        <div className="fixed top-0 right-0 left-0 z-50 backdrop-blur-sm  w-full flex justify-center items-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100vh] max-h-full">
          <div className="relative w-full max-w-4xl max-h-full rounded-lg shadow-lg bg-secondary-700">
            <div className="relative  rounded-lg shadow-lg bg-secondary-700">
              <div className="flex items-center justify-between p-4 rounded-t">
                <h1 className="flex justify-center items-center gap-3 text-white font-semibold text-xl">
                  <svg
                    className="h-6 w-6 text-green-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />{" "}
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Simulation Success
                </h1>
                <button
                  type="button"
                  className="text-secondary-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-secondary-600 hover:text-white"
                  onClick={() => setIsSimulationSuccessOpen(false)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="py-3 px-6 text-white border-t-2 border-secondary-600">
                {/* <div className="w-full flex justify-start items-center gap-1 my-2">
                  <h3 className="w-[125px] font-medium text-lg">Method :</h3>
                  <h5 className="w-full font-normal text-base break-all">
                    {funcArray.length > 0 && funcArray[currentFuncIndex].name}
                  </h5>
                </div> */}
                <div className="w-full flex justify-start items-center gap-1 my-2">
                  <h3 className="w-[125px] font-medium text-lg">Method :</h3>
                  <h5 className="w-full font-normal text-base break-all">
                    sgReceive
                  </h5>
                </div>
                {/* <div className="w-full flex justify-start items-center gap-1 my-2">
                  <h3 className="w-[125px] font-medium text-lg break-all">
                    Network :
                  </h3>
                  <h5 className="w-full font-normal text-base break-all">
                    {contractsDetails[toChainId].network}
                  </h5>
                </div> */}
                <div className="w-full flex justify-start items-center gap-1 my-2">
                  <h3 className="w-[125px] font-medium text-lg">Gas :</h3>
                  <h5 className="w-full font-normal text-base break-all">
                    {gasUsed}
                  </h5>
                </div>
                <div className="w-full flex justify-start items-start gap-1 my-2">
                  <h3 className="w-[125px] font-medium text-lg">Call Data :</h3>
                  <h5 className="w-full font-normal text-sm break-all">
                    {simulateInputData}
                  </h5>
                </div>
              </div>

              {currentFunc && (
                <>
                <div className="flex justify-center items-center gap-3 py-5">
                  <button
                    type="button"
                    onClick={(e: any) => sendTx(currentFuncIndex)}
                    className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                  >
                    {sendTxLoading && (
                      <ImSpinner className="animate-spin h-5 w-5" />
                    )}
                    sendTx
                  </button>
                </div>
                <div className="flex justify-center items-center gap-3 py-5">
                  {txhash && (
                    <p>
                      <a
                        target="_blank"
                        href={`https://socketscan.io/tx/${txhash}`}
                        style={{ color: "blue" }}
                      >
                        TxHash : {shorten(txhash)}
                      </a>
                    </p>
                  )}
                </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ------------- Simulation Success Model END ------------- */}

      {/* ------------- Simulation Error Model START ------------- */}
      {isSimulationErrorOpen && (
        <div className="fixed top-0 right-0 left-0 z-50 backdrop-blur-sm  w-full flex justify-center items-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100vh] max-h-full">
          <div className="relative w-full max-w-4xl max-h-full rounded-lg shadow-lg bg-secondary-700">
            <div className="relativ rounded-lg shadow-lg bg-secondary-700">
              <div className="flex items-center justify-between p-4 rounded-t">
                <h1 className="flex justify-center items-center gap-3 text-white font-semibold text-xl">
                  <svg
                    className="h-6 w-6 text-red-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />{" "}
                    <line x1="15" y1="9" x2="9" y2="15" />{" "}
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  Simulation Error
                </h1>
                <button
                  type="button"
                  className="text-secondary-400 bg-transparent  rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-secondary-600 hover:text-white"
                  onClick={() => setIsSimulationErrorOpen(false)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="py-3 px-6 text-white border-t-2 border-secondary-600">
                {currentFunc && (
                  <div className="w-full flex justify-start items-center gap-1 my-2">
                    <h3 className="w-[125px] font-medium text-lg">Method :</h3>
                    <h5 className="w-full font-normal text-base break-all">
                      {/* {funcArray.length > 0 && funcArray[currentFuncIndex].name} */}
                      sgReceive
                    </h5>
                  </div>
                )}

                <div className="w-full flex justify-start items-center gap-1 my-2">
                  <h3 className="w-[125px] font-medium text-lg">Error :</h3>
                  <h5 className="w-full font-normal text-base break-all">
                    {simulationErrorMsg}
                  </h5>
                </div>
              </div>

              <div className="flex justify-center items-center gap-3 py-5">
                <button
                  type="button"
                  onClick={(e: any) => setIsSimulationErrorOpen(false)}
                  className="bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ------------- Simulation Error Model END ------------- */}
    </>
  );
}
