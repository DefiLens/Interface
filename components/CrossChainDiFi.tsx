import * as React from "react";
import { useState, useEffect } from "react";

import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";
import { Signer, ethers, BigNumber } from "ethers";

import { parseEther } from "ethers/lib/utils";
import { TbArrowsSort } from "react-icons/tb";
import { BiSolidDownArrow } from "react-icons/bi";
import { ImSpinner9, ImSpinner } from "react-icons/im";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { useSigner, useAddress } from "@thirdweb-dev/react";

import IERC20 from "../abis/IERC20.json";
import ChainPing from "../abis/ChainPing.json";
import { useAppStore } from "../store/appStore";
import IStarGateRouter from "../abis/IStarGateRouter.json";
import { contractsDetails, _nonce, _functionType } from "../utils/constants";
import {
  shorten,
  fetchContractDetails,
  calculateFees,
  batch,
} from "../utils/helper";

export default function CrossChainDiFi() {
  const address = useAddress(); // Detect the connected address
  const signer: any = useSigner(); // Detect the connected address

  const polygonContractDetails: any = contractsDetails["109"];

  const {
    smartAccount,
    isSimulationOpen,
    setIsSimulationOpen,
    isSimulationSuccessOpen,
    setIsSimulationSuccessOpen,
    isSimulationErrorOpen,
    setIsSimulationErrorOpen,
    simulationErrorMsg,
    setsimulationErrorMsg,
  }: any = useAppStore((state) => state);
  const [fromChainId, setFromChainId] = useState<any>("109");
  const [toChainId, setToChainId] = useState<any>("106");
  const [srcPoolId, setSrcPoolId] = useState<any>(1);
  const [destPoolId, setDestPoolId] = useState<any>(1);

  const [tokenIn, setTokenIn] = useState<any>(polygonContractDetails?.USDC);
  const [tokenInDecimals, setTokenInDecimals] = useState<any>(6);
  const [contractAddress, setContractAddress] = useState<any>();
  const [amountIn, setAmountIn] = useState<any>();

  const [funcArray, setFunctionArray] = useState<any[]>([]);
  const [params, setParams] = useState<any>([[]]);
  const [currentAbi, setAbi] = useState<any>();
  const [currentFunc, setCurrentFunc] = useState<any>();
  const [currentFuncIndex, setCurrentFuncIndex] = useState<any>(0);
  const [contractName, setContractName] = useState<any>();

  const [amountFieldIndexes, setAmountFieldIndexes] = useState<any>();
  const [isThisAmount, setIsThisFieldAmount] = useState<any>();

  const [simulation, setSimulation] = useState<any>();
  const [gasUsed, setGasUsed] = useState<any>();
  const [simulateInputData, setSimulateInputData] = useState<any>();
  const [simulateLoading, setSimulationLoading] = useState<any>(false);
  const [sendTxLoading, setSendtxLoading] = useState<any>(false);

  const [txhash, setTxHash] = useState<any>(false);

  useEffect(() => {
    if (currentFuncIndex) {
      let _params: any = [];
      const toContractData = contractsDetails[toChainId];
      _params[0] = toContractData.USDC;
      _params[1] = amountIn;
      _params[2] = address;
      _params[3] = "0";
      let _func = [...params];
      _func[currentFuncIndex] = _params;
      setParams(_func);
    }
  }, [amountIn]);

  useEffect(() => {
    setTokenIn(polygonContractDetails.USDC);
    setTokenInDecimals(6);
    setAmountIn("");
  }, [fromChainId]);

  useEffect(() => {
    setContractAddress("");
    resetField();
  }, [toChainId]);

  useEffect(() => {
    if (contractAddress) {
      resetField();
      generateAbis();
    }
  }, [contractAddress, smartAccount]);

  const resetField = async () => {
    setFunctionArray([]);
    setParams("");
    setCurrentFunc("");
    setCurrentFuncIndex(0);
    setIsThisFieldAmount(-1);

    setGasUsed(undefined);
    setSimulateInputData(undefined);
    setSimulation(undefined);
  };

  const onChangeFromNetwork = async (_fromNetwork: any) => {
    setFromChainId(_fromNetwork);
  };

  const onChangeToNetwork = async (_toNetwork: any) => {
    const scwNativeBalance = await smartAccount.provider.getBalance(
      smartAccount.address
    );
    console.log("scwNativeBalance", scwNativeBalance.toString());
    setToChainId(_toNetwork);
    setContractName("");
  };

  const handleContractAddress = async (_contractAddress) => {
    console.log("--_contractAddress", _contractAddress);
    if (!smartAccount) {
      alert("You need to biconomy login");
      return;
    }
    setContractAddress(_contractAddress);
  };

  // for e.g usdt -> usdc
  const onChangeTokenIn = async (tokenIn: any) => {
    if (tokenIn == "usdc") {
      setTokenIn(polygonContractDetails.USDC);
      setTokenInDecimals(6);
      setSrcPoolId(1);
      setDestPoolId(1);
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
    setAmountIn("");
  };

  // for e.g 0 -> 1000
  const handleAmountIn = async (_amountIn) => {
    if (!smartAccount) {
      alert("You need to biconomy login");
      return;
    }
    if (_amountIn) {
      let amountInByDecimals = bg(_amountIn);
      amountInByDecimals = amountInByDecimals.multipliedBy(
        bg(10).pow(tokenInDecimals)
      );
      if (amountInByDecimals.eq(0)) {
        setAmountIn(_amountIn);
      } else {
        setAmountIn(amountInByDecimals.toString());
      }
    } else {
      setAmountIn("");
    }
  };

  const onChangeFunctions = async (funcIndex: any) => {
    console.log("funcIndex: ", funcIndex);
    setParams("");
    setCurrentFunc(funcArray[funcIndex].name);
    setCurrentFuncIndex(funcIndex);
    setIsThisFieldAmount(amountFieldIndexes[funcIndex]);

    let _params: any = [];
    const toContractData = contractsDetails[toChainId];
    _params[0] = toContractData.USDC;
    _params[1] = amountIn;
    _params[2] = address;
    _params[3] = "0";
    let _func = [...params];
    _func[funcIndex] = _params;
    setParams(_func);

    setGasUsed(undefined);
    setSimulateInputData(undefined);
    setSimulation(undefined);
  };

  const onChangeInput = async (
    funcIndex: any,
    inputIndex: any,
    inputValue: any
  ) => {
    try {
      if (!amountIn) throw "Enter amountIn field above";
      setCurrentFunc(funcArray[funcIndex].name);
      let _params: any = [];

      if (params[funcIndex] != undefined) {
        _params = [...params[funcIndex]];
        _params[inputIndex] = inputValue;
      } else {
        _params[inputIndex] = inputValue;
      }

      let _func = [...params];
      _func[funcIndex] = _params;
      setParams(_func);
    } catch (error) {
      alert("InputError: " + error);
    }
  };

  const isThisFieldAmount = async (index: any) => {
    if (index >= 0) {
      setIsThisFieldAmount(index);
    } else {
      alert("Somethig gets wrong");
    }
  };

  const generateAbis = async () => {
    try {
      if (!contractAddress) return;
      if (!smartAccount) return;
      if (!toChainId) return;
      const provider = smartAccount.provider;
      let { abi, amountFieldIndex, contractName }: any =
        await fetchContractDetails(provider, contractAddress, toChainId);
      console.log("abi: ", abi);
      setAbi(abi);
      setContractName(contractName);
      setAmountFieldIndexes(amountFieldIndex);

      for (let i = 0; i < abi.length; i++) {
        if (abi[i].stateMutability != "view") {
          if (abi[i].type == "fallback") {
            console.log("fallback");
          } else if (abi[i].type != "event") {
            console.log("abi[i]: ", abi[i].name);
            setFunctionArray((funcArray) => [...funcArray, abi[i]]);
          }
        }
      }
    } catch (error) {
      console.log("callCrossChain-error", error);
    }
  };

  const simulate = async (funcIndex: any) => {
    try {
      setSimulationLoading(true);
      setGasUsed(undefined);
      setSimulateInputData(undefined);
      setSimulation(undefined);
      if (!smartAccount) throw "You need to login";
      if (contractAddress == "") throw "Enter contractAddress field";
      if (amountIn == "") throw "Enter amountIn field";
      if (isThisAmount < 0) throw "Select amount field";

      const fromContractData = contractsDetails[fromChainId];
      const toContractData = contractsDetails[toChainId];

      const abi = ethers.utils.defaultAbiCoder;
      // const provider = await ethers.getDefaultProvider()
      // const signer: Signer = new ethers.VoidSigner(smartAccount, provider)
      const USDT = await new ethers.Contract(
        tokenIn,
        IERC20,
        smartAccount.provider
      );
      const balance = await USDT.balanceOf(smartAccount.address);

      if (BigNumber.from(balance).lt(BigNumber.from(amountIn)))
        throw "You don't have enough balance";

      const approveData = await USDT.populateTransaction.approve(
        fromContractData.stargateRouter,
        amountIn
      );
      const approveTx = { to: approveData.to, data: approveData.data };
      console.log("approveTx", approveTx);

      console.log("params1", params[funcIndex]);
      const amountAfterSlippage = await calculateFees(
        address,
        amountIn,
        srcPoolId,
        destPoolId,
        toChainId,
        fromContractData.stargateRouter,
        smartAccount.provider
      );
      params[funcIndex][isThisAmount] = amountAfterSlippage.toString();
      console.log("params2", params[funcIndex]);

      let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(
        currentAbi
      );
      console.log(
        "abiInterfaceForDestDefiProtocol",
        abiInterfaceForDestDefiProtocol,
        currentFunc
      );

      // const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
      const destChainExecData =
        abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, [
          toContractData.USDC,
          params[funcIndex][1],
          address,
          0,
        ]);
      console.log("destChainExecData", destChainExecData);

      const destChainExecTx = { to: contractAddress, data: destChainExecData };
      let data;
      if (toChainId == "106") {
        data = abi.encode(
          ["uint256", "address", "address", "bytes"],
          [BigNumber.from("0"), contractAddress, address, destChainExecTx.data]
        );
      } else {
        data = abi.encode(
          ["uint256", "uint256", "address", "address", "bytes"],
          [
            BigNumber.from("0"),
            amountAfterSlippage,
            contractAddress,
            address,
            destChainExecTx.data,
          ]
        );
      }

      const srcAddress = ethers.utils.solidityPack(
        ["address"],
        [smartAccount.address]
      );
      let abiInterfaceForChainPing = new ethers.utils.Interface(ChainPing);
      const stargateParams = [
        fromChainId,
        srcAddress,
        _nonce,
        toContractData.USDC,
        amountAfterSlippage,
        data,
      ];
      const encodedDataForChainPing =
        abiInterfaceForChainPing.encodeFunctionData(
          "sgReceive",
          stargateParams
        );
      const erc20Interface = new ethers.utils.Interface([
        "function transfer(address _account, uint256 _value)",
      ]);
      const dummmyTranferToCheckData = erc20Interface.encodeFunctionData(
        "transfer",
        [toContractData.ChainPing, amountAfterSlippage]
      );
      const simulation = await batch(
        toContractData.USDC,
        toContractData.ChainPing,
        dummmyTranferToCheckData,
        encodedDataForChainPing,
        true,
        chooseChianId(toChainId)
      );

      setGasUsed(simulation.simulation.gas_used);
      setSimulateInputData(simulation.simulation.input);
      setSimulation(simulation.simulation.status);
      setSimulationLoading(false);
      setIsSimulationOpen(false);
      setIsSimulationSuccessOpen(true);

      console.log("simulation-status: ", simulation.simulation.status);
      console.log("simulation-input: ", simulation.simulation.input);
      console.log("simulation-method: ", simulation.simulation.method);
      console.log("simulation-gasused: ", simulation.simulation.gas_used);
    } catch (error: any) {
      setSimulationLoading(false);
      setIsSimulationOpen(false);
      setIsSimulationErrorOpen(true);
      setsimulationErrorMsg(error);
      console.log("Simulation Failed: " + error);
      toast.error(error);
      // alert("Simulation Failed: " + error);
      return;
    }
  };

  const chooseChianId = (stargateChainId: any) => {
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
    }
    return realChainId;
  };

  const sendTx = async (funcIndex: any) => {
    try {
      setSendtxLoading(true);
      if (!smartAccount) throw "You need to login";
      if (!simulation) throw "First simulate then send Tx";
      if (contractAddress == "") throw "Enter contractAddress field";
      if (amountIn == "") throw "Enter amountIn field";
      if (isThisAmount < 0) throw "Select amount field";

      // const scwNativeBalance = await smartAccount.get

      const fromContractData = contractsDetails[fromChainId];
      const toContractData = contractsDetails[toChainId];

      setTxHash("");
      const abi = ethers.utils.defaultAbiCoder;

      // const provider = await ethers.getDefaultProvider()
      // const signer = new ethers.VoidSigner(smartAccount.address, provider)
      // const scwNativeBalance = await signer.getBalance()
      // console.log("scwNativeBalance", scwNativeBalance)

      const USDT = await new ethers.Contract(
        tokenIn,
        IERC20,
        smartAccount.provider
      );
      const balance = await USDT.balanceOf(smartAccount.address);
      if (BigNumber.from(balance).lt(BigNumber.from(amountIn)))
        throw "You don't have enough balance";

      const approveData = await USDT.populateTransaction.approve(
        fromContractData.stargateRouter,
        amountIn
      );
      const approveTx = { to: approveData.to, data: approveData.data };
      console.log("approveTx", approveTx);

      console.log("params1", params[funcIndex]);
      const amountAfterSlippage = await calculateFees(
        address,
        amountIn,
        srcPoolId,
        destPoolId,
        toChainId,
        fromContractData.stargateRouter,
        smartAccount.provider
      );
      params[funcIndex][isThisAmount] = amountAfterSlippage.toString();
      console.log("params2", params[funcIndex]);

      let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(
        currentAbi
      );
      // const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
      const destChainExecData =
        abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, [
          toContractData.USDC,
          params[funcIndex][1],
          address,
          0,
        ]);
      const destChainExecTx = { to: contractAddress, data: destChainExecData };
      let data;
      if (toChainId == "106") {
        data = abi.encode(
          ["uint256", "address", "address", "bytes"],
          [BigNumber.from("0"), contractAddress, address, destChainExecTx.data]
        );
      } else {
        data = abi.encode(
          ["uint256", "uint256", "address", "address", "bytes"],
          [
            BigNumber.from("0"),
            amountAfterSlippage,
            contractAddress,
            address,
            destChainExecTx.data,
          ]
        );
      }

      const srcAddress = ethers.utils.solidityPack(
        ["address"],
        [smartAccount.address]
      );
      let abiInterfaceForChainPing = new ethers.utils.Interface(ChainPing);
      const stargateParams = [
        fromChainId,
        srcAddress,
        _nonce,
        toContractData.USDC,
        amountAfterSlippage,
        data,
      ];
      const encodedDataForChainPing =
        abiInterfaceForChainPing.encodeFunctionData(
          "sgReceive",
          stargateParams
        );
      const erc20Interface = new ethers.utils.Interface([
        "function transfer(address _account, uint256 _value)",
      ]);
      const dummmyTranferToCheckData = erc20Interface.encodeFunctionData(
        "transfer",
        [toContractData.ChainPing, amountAfterSlippage]
      );
      const gasUsed = await batch(
        toContractData.USDC,
        toContractData.ChainPing,
        dummmyTranferToCheckData,
        encodedDataForChainPing,
        false,
        chooseChianId(toChainId)
      );
      console.log("gasUsed: ", gasUsed);

      const stargateRouter = await new ethers.Contract(
        fromContractData.stargateRouter,
        IStarGateRouter,
        smartAccount.provider
      );
      const lzParams = {
        dstGasForCall: gasUsed,
        dstNativeAmount: 0,
        dstNativeAddr: "0x",
      };
      const packedToAddress = ethers.utils.solidityPack(
        ["address"],
        [toContractData.ChainPing]
      );
      let quoteData = await stargateRouter.quoteLayerZeroFee(
        toChainId,
        _functionType,
        packedToAddress,
        data,
        lzParams
      );
      console.log("quoteData", quoteData.toString(), amountIn);
      console.log("srcPoolId-destPoolId", srcPoolId, destPoolId);

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
        { value: quoteData[0] }
      );

      const scwNativeBalance = await smartAccount.provider.getBalance(
        smartAccount.address
      );
      console.log(
        "scwNativeBalance",
        scwNativeBalance.toString(),
        quoteData[0].toString()
      );
      const shouldBeBalance = BigNumber.from(scwNativeBalance);
      const shouldBeBalanceMsg = bg(shouldBeBalance.toString())
        .plus(parseEther("5").toString())
        .dividedBy(bg(10).pow(18))
        .toString();
      console.log("shouldBeBalanceMsg", shouldBeBalanceMsg.toString());

      // Extra 1e18 should more as of now
      if (!shouldBeBalance.gt(quoteData[0].add(parseEther("1"))))
        throw `Not Enough Balance, You should have at least ${shouldBeBalanceMsg.toString()} polygon in your SCW wallet`;

      console.log("stargateTx", stargateTx);
      const sendTx = {
        to: stargateTx.to,
        data: stargateTx.data,
        value: stargateTx.value,
      };
      const txResponseOfBiconomyAA = await smartAccount?.sendTransactionBatch({
        transactions: [approveTx, sendTx],
      });
      const txReciept = await txResponseOfBiconomyAA?.wait();
      console.log("userOp hash", txResponseOfBiconomyAA?.hash);
      console.log("Tx hash", txReciept?.transactionHash);
      setTxHash(txReciept?.transactionHash);
      setSendtxLoading(false);
      toast.success(txReciept?.transactionHash);
    } catch (error: any) {
      setSendtxLoading(false);
      console.log("sendTx-error: ", error);
      // alert("Transaction Error: " + error);
      toast.error(error);
      // if (error == "Not enough gas fee in your SCW Wallet"){
      //     alert("Not enough gas fee in your SCW Walle")
      //     alert("You shoul")
      // }
      return;
    }
  };

  const inputContainer =
    "w-full relative float-label-input shadow-md rounded-md";

  const inputBoxStyle =
    "w-full bg-white focus:outline-none focus:shadow-outline border-2  rounded-md p-2 block appearance-none leading-normal focus:border-[#080829]";

  const inputLabelStyle =
    "absolute top-2 left-0 text-gray-800 text-md pointer-events-none rounded-full transition duration-200 ease-in-outbg-white px-3";

  const selectContainer =
    "w-full relative border-2 border-gray-300 text-gray-800 bg-white shadow-md rounded-md";

  const selectBoxStyle = "appearance-none w-full p-2 bg-white rounded-md";
  const selectAppearanceStyle =
    "pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-3 text-gray-500 border-l-2";
  return (
    <>
      {!smartAccount && (
        <div className="flex justify-center items-center border-2 border-gray-800 shadow-sm shadow-[#080829] rounded-lg cursor-pointer">
          <h3 className="font-semibold text-lg md:text-2xl text-[#080829] py-4 bg-transparent ">
            Login First!
          </h3>
        </div>
      )}
      {smartAccount && (
        <div className="h-full flex flex-col justify-center items-center gap-5 border-2 border-gray-800 shadow-sm shadow-[#080829] rounded-lg cursor-pointer p-10">
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
                type="text"
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
            <TbArrowsSort size={25} />
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
                value={contractAddress}
              >
                <option key={"0x"} value="" disabled selected>
                  Contract Address
                </option>
                {contractsDetails[toChainId].contractAddresses.length > 0 &&
                  contractsDetails[toChainId].contractAddresses.map(
                    (contractDetails: any, contractIndex: any) => (
                      <option
                        key={contractDetails.contractAddress}
                        value={contractDetails.contractAddress}
                      >
                        {contractDetails.contractName}
                      </option>
                    )
                  )}
              </select>
              <div className={selectAppearanceStyle}>
                <BiSolidDownArrow size="15px" />
              </div>
            </div>
            {/* {contractName && <h4>ContractName: {contractName}</h4>} */}
          </div>

          {isSimulationOpen && !contractName ? (
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

      {isSimulationOpen && contractName && funcArray && (
        <div className="fixed top-0 right-0 left-0 z-50 backdrop-blur-sm  w-full flex justify-center items-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100vh] max-h-full">
          <div className="relative w-full max-w-4xl max-h-full rounded-lg shadow dark:bg-gray-700">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-start justify-between p-4 rounded-t">
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
              <div className="py-3 px-6 text-white border-y-2 border-gray-600">
                {contractName && (
                  <h3 className="font-semibold text-lg">
                    Contract Detail :
                    <span className="font-normal text-base px-2">
                      {contractName}
                    </span>
                  </h3>
                )}
              </div>

              <div className="h-96 flex justify-center items-start text-white rounded-lg border-2 border-gray-600 m-3 ">
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

                <div className="w-[50%] h-full flex flex-col justify-end items-center gap-3 border-l-2 border-l-gray-600 p-3">
                  {currentFunc &&
                    currentFuncIndex >= 0 &&
                    funcArray.length > 0 &&
                    funcArray[currentFuncIndex].inputs.map(
                      (input: any, inputIndex: any) => (
                        <>
                          <label className="w-full">
                            {amountFieldIndexes[currentFuncIndex] ==
                              inputIndex && input.type == "uint256" ? (
                              <div className="w-full flex flex-col justify-center items-center gap-1">
                                <p className="text-sm font-normal">
                                  {input.name}
                                </p>

                                <button
                                  onClick={(e: any) =>
                                    isThisFieldAmount(inputIndex)
                                  }
                                  className="py-1 px-3 text-xs font-normal bg-indigo-600 rounded-lg"
                                >
                                  isThisAmountField
                                </button>
                                <input
                                  disabled
                                  placeholder={input.name + " " + input.type}
                                  value={
                                    params[currentFuncIndex] &&
                                    params[currentFuncIndex][inputIndex] != ""
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
                                  className="w-full text-black text-sm rounded-md bg-gray-50 py-1 px-3 outline-none drop-shadow-sm transition-all duration-200 ease-in-out"
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
                                    params[currentFuncIndex][inputIndex] != ""
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
                                  className="w-full text-black text-sm rounded-md bg-gray-50 py-1 px-3 outline-none drop-shadow-sm transition-all duration-200 ease-in-out"
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
                      className="flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-green-800 hover:border-green-900 transition duration-300"
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
          <div className="relative w-full max-w-4xl max-h-full rounded-lg shadow dark:bg-gray-700">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
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
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
              <div className="py-3 px-6 text-white border-t-2 border-gray-600">
                <h3 className="font-medium text-lg my-2">
                  Method :
                  <span className="font-normal text-base px-3">
                    {funcArray.length > 0 && funcArray[currentFuncIndex].name}
                  </span>
                </h3>
                <h3 className="font-medium text-lg my-2">
                  Network :
                  <span className="font-normal text-base px-3">
                    {contractsDetails[toChainId].network}
                  </span>
                </h3>
                <h3 className="font-medium text-lg my-2">
                  Gas :
                  <span className="font-normal text-base px-3">{gasUsed}</span>
                </h3>
                <h3 className="font-medium text-lg my-2">
                  Call Data :
                  <span className="font-normal text-base px-3">
                    {simulateInputData}
                  </span>
                </h3>
              </div>

              {currentFunc && (
                <div className="flex justify-center items-center gap-3 py-5">
                  <button
                    type="button"
                    onClick={(e: any) => sendTx(currentFuncIndex)}
                    className="bg-green-600 hover:bg-green-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-green-800 hover:border-green-900 transition duration-300"
                  >
                    {sendTxLoading && (
                      <ImSpinner className="animate-spin h-5 w-5" />
                    )}
                    sendTx
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* ------------- Simulation Success Model END ------------- */}

      {/* ------------- Simulation Error Model START ------------- */}
      {isSimulationErrorOpen && (
        <div className="fixed top-0 right-0 left-0 z-50 backdrop-blur-sm  w-full flex justify-center items-center p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[100vh] max-h-full">
          <div className="relative w-full max-w-4xl max-h-full rounded-lg shadow dark:bg-gray-700">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
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
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
              <div className="py-3 px-6 text-white border-t-2 border-gray-600">
                {currentFunc && (
                  <h3 className="font-medium text-lg my-2">
                    Method :
                    <span className="font-normal text-base px-3">
                      {funcArray.length > 0 && funcArray[currentFuncIndex].name}
                    </span>
                  </h3>
                )}
                <h3 className="font-medium text-lg my-2">
                  Error :
                  <span className="font-normal text-base px-3">
                    {simulationErrorMsg}
                  </span>
                </h3>
              </div>

              <div className="flex justify-center items-center gap-3 py-5">
                <button
                  type="button"
                  onClick={(e: any) => setIsSimulationErrorOpen(false)}
                  className="bg-green-600 hover:bg-green-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-green-800 hover:border-green-900 transition duration-300"
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
