import * as React from "react";
import { useEffect } from "react";

import { BigNumber } from "ethers";
import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { FiCopy } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { ChainId } from "@biconomy/core-types";
import { HiOutlineRefresh } from "react-icons/hi";
import { IBundler, Bundler } from "@biconomy/bundler";
import { ImSpinner9, ImSpinner } from "react-icons/im";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { BiSolidRightArrowCircle, BiSolidChevronDown } from "react-icons/bi";
import { DEFAULT_ENTRYPOINT_ADDRESS, BiconomySmartAccountConfig, BiconomySmartAccount } from "@biconomy/account";
import { useSwitchChain, useSigner, useConnect, useChain, useAddress, metamaskWallet } from "@thirdweb-dev/react";

import IERC20 from "../../abis/IERC20.json";
import { useSendTx } from "../../hooks/useSendTx";
import { useSimulate } from "../../hooks/useSimulate";
import ChainContext from "../../Context/ChainContext";
import { useGenerateAbis } from "../../hooks/useGenerateAbis";
import { useGlobalStore, iGlobal } from "../../store/GlobalStore";
import { useCalculatebalance } from "../../hooks/useCalculateBalance";
import { shorten, setSafeState, chooseChianId, buildTxHash } from "../../utils/helper";
import { getNetworkAndContractData, fetchMethodParams } from "../../utils/apis";
import { useCrossChainDifiStore, iCrossChainDifi } from "../../store/CrossChainDifiStore";
import { getProvider, getErc20Balanceof, getContractInstance } from "../../utils/web3Libs/ethers";
import { useOnChangeTokenIn, useOnChangeInput, useOnChangeFunctions } from "../../hooks/useOnChangeMainForm";
import {
    tokensByNetwork,
    paymasterURLs,
    NetworkNameByStargateChainId,
    NetworkNameByChainId,
    methodWithApi,
    gasFeesNamesByChainId,
    bundlerURLs,
    BIG_ZERO,
    _nonce,
    _functionType,
} from "../../utils/constants";

bg.config({ DECIMAL_PLACES: 10 });

const CrossChainDefi: React.FC<{}> = () => {
    const chain = useChain(); // Detect the connected address
    const switchChain = useSwitchChain();
    const address = useAddress(); // Detect the connected address
    const signer: any = useSigner(); // Detect the connected address
    const connect = useConnect();
    const metamaskConfig = metamaskWallet();
    const { mutateAsync: sendTxToChain } = useSendTx();
    const { mutateAsync: simulateTx } = useSimulate();
    const { mutateAsync: generateAbisForContract } = useGenerateAbis();
    const { mutateAsync: onChangeTokenInHook } = useOnChangeTokenIn();
    const { mutateAsync: onChangeFunctionsHook } = useOnChangeFunctions();
    const { mutateAsync: onChangeInputHook } = useOnChangeInput();
    const { mutateAsync: fetchNativeBalance } = useCalculatebalance();
    const { selectedChainId, setSelectedChain, setSelectedChainId } = React.useContext(ChainContext);

    const { loading, setLoading, connected, smartAccount, setSmartAccount, setCurrentProvider, setConnected }: iGlobal =
        useGlobalStore((state) => state);

    const {
        fromChainId,
        setFromChainId,
        toChainId,
        setToChainId,

        tokenIn,
        setTokenIn,
        tokenInDecimals,
        setTokenInDecimals,
        amountIn,
        setAmountIn,
        isThisAmount,
        setIsThisFieldAmount,

        contractIndex,
        setContractIndex,
        allNetworkData,
        setData,
        setAbi,
        currentFunc,
        setCurrentFunc,
        currentFuncIndex,
        setCurrentFuncIndex,

        funcArray,
        setFunctionArray,
        params,
        setParams,
        fixParams,
        setFixParams,

        isSimulationOpen,
        setIsSimulationOpen,
        isSimulationSuccessOpen,
        setIsSimulationSuccessOpen,
        isSimulationErrorOpen,
        setIsSimulationErrorOpen,

        isSimulationSuccessDetailShow,
        setIsSimulationSuccessDetailShow,
        isSimulationErrorDetailShow,
        setIsSimulationErrorDetailShow,

        simulationErrorMsg,
        setsimulationErrorMsg,
        simulation,
        setSimulation,
        gasUsed,
        gasCost,
        bridgeGasCost,
        setGasUsed,
        simulateInputData,
        setSimulateInputData,
        simulateLoading,
        setSimulationLoading,

        sendTxLoading,
        sendTxLoadingForEoa,
        txhash,

        scwTokenInBalance,
        setScwTokenInbalance,
        eoaTokenInBalance,
        setEoaTokenInbalance,
    }: iCrossChainDifi = useCrossChainDifiStore((state) => state);

    useEffect(() => {
        async function changeWallet() {
            if (!address) {
                setTokenIn("")
                setFromChainId("")
                setToChainId("")
                setAmountIn("")
                setContractIndex("")
                setFunctionArray([])
                setSmartAccount(null)
                setConnected(false)
                setSelectedChain("")
                setSelectedChainId("")
                console.log("Metamask logout", address)
            }
        }
        changeWallet();
    }, [address])

    useEffect(() => {
        setIsSimulationOpen(false);
        setIsSimulationSuccessOpen(false);
        setIsSimulationErrorOpen(false);
    }, []);

    useEffect(() => {
        async function updateParams() {
            if (amountIn && currentFuncIndex && contractIndex) {
                setParams([]);
                setFixParams([]);
                const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress;
                const apiUrl = methodWithApi[toChainId][contractAddress][funcArray?.[currentFuncIndex].name];

                const _tempAmount = BigNumber.from(bg(amountIn).multipliedBy(bg(10).pow(tokenInDecimals)).toString());

                const response: any = await fetchMethodParams(
                    fromChainId,
                    toChainId,
                    funcArray,
                    _tempAmount,
                    smartAccount,
                    address,
                    currentFuncIndex,
                    currentFunc,
                    apiUrl
                );
                console.log("🚀 ~ file: index.tsx:239 ~ updateParams ~ response:", response);
                if (!response.data) throw "api error";
                let _func = [...params];
                _func[currentFuncIndex] = response.data.params;
                setParams(_func);
                setFixParams(response.data.fixParams);
            }
        }
        updateParams();
    }, [amountIn]);

    useEffect(() => {
        async function onChangeFromChainId() {
            try {
                if (fromChainId && address) {
                    const token: any = tokensByNetwork[fromChainId];
                    setTokenIn(token.usdc);
                    setTokenInDecimals(6);
                    console.log("selectedChainId", selectedChainId, fromChainId);
                    const provider = await getProvider(selectedChainId);
                    console.log("provider", provider?.toString());

                    const erc20 = await getContractInstance(token.usdc, IERC20, provider);
                    console.log("erc20" + erc20?.toString());

                    const scwBalance = await getErc20Balanceof(erc20, smartAccount.address);
                    const eoaBalance = await getErc20Balanceof(erc20, address);
                    console.log("address", address);

                    setSafeState(setScwTokenInbalance, BigNumber.from(scwBalance), BIG_ZERO);
                    setSafeState(setEoaTokenInbalance, BigNumber.from(eoaBalance), BIG_ZERO);

                    resetField();
                    setAmountIn("");
                    setContractIndex("");
                }
            } catch (error) {
                setFromChainId("");
                setTokenIn("");
                setTokenInDecimals(0);
                console.log('onChangeFromChainId-error: ', error)
            }

        }
        onChangeFromChainId();
    }, [fromChainId]);

    useEffect(() => {
        if (toChainId) {
            setContractIndex("");
            resetField();
        }
    }, [toChainId]);

    useEffect(() => {
        if (contractIndex) {
            resetField();
            generateAbis();
        }
    }, [contractIndex]);

    const resetField = async () => {
        setFunctionArray(null);
        setParams([]);
        setFixParams([]);
        setCurrentFunc("");
        setCurrentFuncIndex(0);
        setIsThisFieldAmount(-1);

        setGasUsed(0);
        setSimulateInputData("");
        setSimulation("");
        setIsSimulationSuccessOpen(false);
        setIsSimulationErrorOpen(false);
    };

    const onChangeFromNetwork = async (_fromNetwork: any) => {
        try {
            if (simulateLoading || sendTxLoading || sendTxLoadingForEoa) {
                alert("wait, tx loading currently ...");
                return;
            }
            if (!connected) {
                alert("Please connect to metamask");
                setFromChainId("");
                return;
            }
            setCurrentFunc("");
            setLoading(true);
            setTokenIn("");
            setToChainId("");
            setData(null);
            const realChainID = await chooseChianId(_fromNetwork);
            setSelectedChain?.(NetworkNameByChainId[realChainID]);
            setSelectedChainId?.(realChainID);

            await switchChain(Number(realChainID))
                .then(async () => {
                    const smartAccount: any = await createAccount(realChainID);
                    console.log("smartAccount: ", smartAccount);
                    await fetchNativeBalance({
                        chainId: realChainID,
                        eoaAddress: address,
                        scwAddress: smartAccount?.address,
                    });
                    setSmartAccount(smartAccount);
                    setLoading(false);
                    setFromChainId(_fromNetwork);
                })
                .catch((error) => {
                    console.log("connect:catch:error", error);
                    setLoading(false);
                });
        } catch (error) {
            console.log("onChangeFromNetwork:error", error);
            setLoading(false);
        }
    };

    const onChangeToNetwork = async (toNetwork: any) => {
        try {
            if (simulateLoading || sendTxLoading || sendTxLoadingForEoa) {
                alert("wait, tx loading currently ...");
                return;
            }
            setIsSimulationSuccessOpen(false);
            setData(null);
            setToChainId(toNetwork);
            const response: any = await getNetworkAndContractData(fromChainId, toNetwork);
            if (response.data) {
                setData(response.data);
            }
        } catch (error) {
            console.error("API Error:", error);
        }
    };

    const handleContractAddress = async (_contractIndex) => {
        if (simulateLoading || sendTxLoading || sendTxLoadingForEoa) {
            alert("wait, tx loading currently ...");
            return;
        }
        if (!smartAccount) {
            alert("You need to biconomy login");
            return;
        }
        setContractIndex(_contractIndex);
    };

    // for e.g usdt -> usdc
    const onChangeTokenIn = async (tokenIn: any) => {
        if (simulateLoading || sendTxLoading || sendTxLoadingForEoa) {
            alert("wait, tx loading currently ...");
            return;
        }
        if (!fromChainId) return alert("From network is not selecetd yet");
        const provider = await getProvider(selectedChainId);
        const token = tokensByNetwork[fromChainId];
        const erc20 = await getContractInstance(token.usdc, IERC20, provider);
        const scwBalance = await getErc20Balanceof(erc20, smartAccount.address);
        const eoaBalance = await getErc20Balanceof(erc20, address);
        console.log("scwBalance++", scwBalance?.toString());
        console.log("eoaBalance++", eoaBalance?.toString());

        setSafeState(setScwTokenInbalance, BigNumber.from(scwBalance), BIG_ZERO);
        setSafeState(setEoaTokenInbalance, BigNumber.from(eoaBalance), BIG_ZERO);

        await onChangeTokenInHook({ fromChainId, tokenIn });
    };

    // for e.g 0 -> 1000
    const handleAmountIn = async (_amountIn) => {
        if (simulateLoading || sendTxLoading || sendTxLoadingForEoa) {
            alert("wait, tx loading currently ...");
            return;
        }
        if (!smartAccount) {
            alert("You need to biconomy login");
            return;
        }
        if (_amountIn) {
            let amountInByDecimals = bg(_amountIn);
            // amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(tokenInDecimals));
            // if (amountInByDecimals.eq(0)) {
            setAmountIn(_amountIn);
            // } else {
            //     setAmountIn(bg(amountInByDecimals).toNumber());
            // }
        } else {
            setAmountIn("");
        }
    };

    const onChangeFunctions = async (funcIndex) => {
        if (funcIndex == "") return toast.error("Please select operation");
        await onChangeFunctionsHook({ funcIndex, address });
    };

    // const onChangeInput = async (funcIndex: any, inputIndex: any, inputValue: any) => {
    //     await onChangeInputHook({ funcIndex, inputIndex, inputValue });
    // };

    // const isThisFieldAmount = async (index: any) => {
    //     if (index >= 0) {
    //         setIsThisFieldAmount(index);
    //     } else {
    //         alert("Somethig gets wrong");
    //     }
    // };

    const generateAbis = async () => {
        await generateAbisForContract();
    };

    const simulate = async (funcIndex: any) => {
        simulateTx({ funcIndex, address });
    };

    async function createAccount(chainId: any) {
        const bundler: IBundler = new Bundler({
            bundlerUrl: bundlerURLs[chainId],
            chainId: ChainId.POLYGON_MAINNET,
            entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        });

        const paymaster: IPaymaster = new BiconomyPaymaster({
            paymasterUrl: paymasterURLs[chainId],
        });
        const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
            signer: signer,
            chainId: chainId,
            bundler: bundler,
            paymaster: paymaster,
        };
        let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
        biconomySmartAccount = await biconomySmartAccount.init();
        return biconomySmartAccount;
    }

    const changeToFromChain = async (funcIndex: any, isSCW: any) => {
        const _fromN = chooseChianId(fromChainId);
        const _chain = chain;
        console.log(_chain);
        if (_chain?.chainId.toString() != _fromN) {
            await connect(metamaskConfig, {});
            switchChain(Number(_fromN))
                .then(async () => {
                    const smartAccount = await createAccount(_fromN);
                    setSmartAccount(smartAccount);
                    setCurrentProvider("Biconomy");
                    setSelectedChain?.(NetworkNameByChainId[_fromN]);
                    setSelectedChainId?.(_fromN);
                    await sendTxToChain({ funcIndex, address, isSCW });
                })
                .catch();
        }
    };

    const sendTx = async (funcIndex: any, isSCW: any) => {
        try {
            if (fromChainId == toChainId) {
                toast.error("From and to networks are not same.");
                return;
            }
            const _fromN = chooseChianId(fromChainId);
            const _chain = chain;
            console.log(_chain);
            if (_chain?.chainId.toString() != _fromN) {
                await changeToFromChain(funcIndex, isSCW);
            } else {
                await sendTxToChain({ funcIndex, address, isSCW });
            }
        } catch (error) {
            console.log("sendTx-error", error);
        }
    };

    const copyToClipboard = (id: any) => {
        navigator.clipboard.writeText(id);
        // Alert the copied text
        toast.success("Destination Lending CallData Copied");
    };

    return (
        <>
            <div className="main-container h-full flex flex-col sm:flex-row justify-start items-start gap-4">
                {true && (
                    <div className="w-full min-h-full bg-gradient-to-t from-gray-200 via-white to-gray-200 flex flex-col justify-start items-center gap-5 shadow-md shadow-primary-950 rounded-lg cursor-pointer p-10">
                        <h1 className="text-xl md:text-2xl lg:text-3xl text-center font-extrabold mb-7">
                            Cross-Chain Defi
                        </h1>

                        <div className="w-full">
                            <span className="text-black font-semibold text-xs md:text-sm lg:text-base">From</span>
                            <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow rounded-md overflow-hidden mt-1 ">
                                <div className="w-48 relative">
                                    <label htmlFor="fromNetwork" className="sr-only">
                                        Network
                                    </label>
                                    <select
                                        className="appearance-none w-full outline-none px-3 py-2 font-medium"
                                        placeholder="Network"
                                        name="networks"
                                        id="fromNetwork"
                                        onChange={(e: any) => onChangeFromNetwork(e.target.value)}
                                        value={fromChainId ? fromChainId : ""}
                                    >
                                        <option value="" disabled selected>
                                            Network
                                        </option>
                                        <option value="109">Polygon</option>
                                        <option value="110">Arbitrum</option>
                                        <option value="106">Avalanche</option>
                                        <option value="101">Ethereum</option>
                                        <option value="184">Base</option>
                                        <option value="111">Optimism</option>
                                    </select>
                                    <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                                        <BiSolidChevronDown size="20px" />
                                    </div>
                                </div>
                                <div className="w-full relative">
                                    <label htmlFor="token" className="sr-only">
                                        Token
                                    </label>
                                    <select
                                        className="appearance-none w-full outline-none px-3 py-2 font-medium"
                                        placeholder="Token"
                                        name="networks"
                                        id="token"
                                        value={tokenIn ? tokenIn : ""}
                                        onChange={(e: any) => onChangeTokenIn(e.target.value)}
                                    >
                                        <option value="" disabled selected>
                                            Token
                                        </option>
                                        {/* <option value="usdt">USDT</option> */}
                                        <option value="usdc">USDC</option>
                                        {/* <option value="dai">DAI</option> */}
                                    </select>
                                    <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                                        <BiSolidChevronDown size="20px" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full">
                            <div className="flex justify-between items-center gap-2 text-black font-semibold text-xs md:text-sm pr-2">
                                <span>Total Amount</span>
                                <span>
                                    {`SmartAccount Balance : ${
                                        !scwTokenInBalance.isZero()
                                            ? bg(BigNumber.from(scwTokenInBalance).toString())
                                                  .dividedBy(bg(10).pow(tokenInDecimals))
                                                  .toString()
                                            : "0"
                                    }
                                    || EOA Balance : ${
                                        !eoaTokenInBalance.isZero()
                                            ? bg(BigNumber.from(eoaTokenInBalance).toString())
                                                  .dividedBy(bg(10).pow(tokenInDecimals))
                                                  .toString()
                                            : "0"
                                    }
                                    `}
                                </span>
                            </div>
                            <div className="w-full flex justify-start items-center gap-1 text-secondary-800 bg-white shadow rounded-md overflow-hidden mt-1">
                                <input
                                    type="number"
                                    min="0"
                                    placeholder=""
                                    className="w-full bg-white font-medium outline-none shadow-outline border-2  rounded-md py-2 px-3 block appearance-none leading-normal focus:border-primary-950"
                                    value={
                                        // amountIn != 0
                                        //     ? bg(amountIn).dividedBy(bg(10).pow(tokenInDecimals)).toString()
                                        //     : amountIn
                                        tokenInDecimals && amountIn && bg(amountIn).isGreaterThan(0)
                                            ? amountIn
                                            : amountIn
                                    }
                                    onChange={(e: any) => handleAmountIn(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="text-black -mb-3">
                            <HiOutlineRefresh size="22px" />
                        </div>

                        <div className="w-full">
                            <span className="text-black font-semibold text-xs md:text-sm lg:text-base">To</span>
                            <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow rounded-md overflow-hidden mt-1">
                                <div className="w-48 relative">
                                    <label htmlFor="toNetwork" className="sr-only">
                                        Network
                                    </label>
                                    <select
                                        className="appearance-none w-full outline-none px-3 py-2 font-medium"
                                        placeholder="Network"
                                        name="networks"
                                        id="toNetwork"
                                        onChange={(e: any) => onChangeToNetwork(e.target.value)}
                                        value={toChainId ? toChainId : ""}
                                    >
                                        <option value="" disabled selected>
                                            Network
                                        </option>
                                        <option value="106">Avalanche</option>
                                        <option value="110">Arbitrum</option>
                                        <option value="111">Optimism</option>
                                        <option value="184">Base</option>
                                        {/* <option value="101">Mainnet</option> */}
                                        <option value="109">Polygon</option>
                                    </select>
                                    <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                                        <BiSolidChevronDown size="20px" />
                                    </div>
                                </div>
                                <div className="w-full relative">
                                    <label htmlFor="contractAddresses" className="sr-only">
                                        Contract Address
                                    </label>
                                    <select
                                        className="appearance-none w-full outline-none px-3 py-2 font-medium"
                                        placeholder="Contract Address"
                                        name="contractAddresses"
                                        id="contractAddresses"
                                        onChange={(e: any) => handleContractAddress(e.target.value)}
                                        value={contractIndex}
                                    >
                                        <option key={"0x"} value="" disabled selected>
                                            Contract Address
                                        </option>
                                        {allNetworkData &&
                                            allNetworkData.contracts.length > 0 &&
                                            allNetworkData.contracts.map((contractDetails: any, contractIndex: any) => (
                                                <option key={contractIndex} value={contractIndex}>
                                                    {contractDetails.contractName}
                                                </option>
                                            ))}
                                    </select>
                                    <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                                        <BiSolidChevronDown size="20px" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {allNetworkData && (
                            <div className="w-full mt-3">
                                <span className="text-black font-semibold text-xs md:text-sm lg:text-base">
                                    Build DestinationChain Method/Calldata to execute after bridge funds
                                </span>

                                <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow rounded-md overflow-hidden mt-1">
                                    <div className="w-full relative">
                                        <label htmlFor="funcNames" className="sr-only">
                                            Select Function Name
                                        </label>
                                        <select
                                            className="appearance-none w-full outline-none px-3 py-2 font-medium"
                                            placeholder=" Select Function Name"
                                            name="funcNames"
                                            id="funcNames"
                                            onChange={(e: any) => onChangeFunctions(e.target.value)}
                                        >
                                            <option key={-1} value="" selected>
                                                Select Operation
                                            </option>
                                            { funcArray && funcArray.length > 0 &&
                                                funcArray.map((funcName: any, funcIndex: any) => (
                                                    <option key={funcIndex} value={funcIndex}>
                                                        {funcName.name}
                                                    </option>
                                                ))}
                                        </select>
                                        <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                                            <BiSolidChevronDown size="20px" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentFunc && isSimulationOpen && !allNetworkData ? (
                            <button
                                type="button"
                                onClick={() => setIsSimulationOpen(false)}
                                className="w-32 mt-8 flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-black font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                            >
                                <ImSpinner9 className="animate-spin h-5 w-5" />
                                Bridge
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!fromChainId) {
                                        toast.error("Select fromNetwork.");
                                        return;
                                    }
                                    if (!toChainId) {
                                        toast.error("Select toNetwork.");
                                        return;
                                    }
                                    if (fromChainId == toChainId) {
                                        toast.error("From and To networks should not same.");
                                        return;
                                    }
                                    if (!amountIn) {
                                        toast.error("Select amountIn.");
                                        return;
                                    }
                                    if (!contractIndex) {
                                        toast.error("Select contractAddress.");
                                        return;
                                    }
                                    if (!smartAccount) {
                                        toast.error("Something went wrong.. refresh page");
                                        return;
                                    }
                                    if (!currentFuncIndex) {
                                        toast.error("please select operation");
                                        return;
                                    }
                                    setIsSimulationOpen(true);
                                    await simulate(currentFuncIndex);
                                }}
                                className="w-32 flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                            >
                                Bridge <BiSolidRightArrowCircle size="20px" />
                            </button>
                        )}
                    </div>
                )}

                <div className="w-full min-h-full bg-gradient-to-t from-gray-200 via-white to-gray-200 flex flex-col gap-2 shadow-md shadow-primary-950 rounded-lg cursor-pointer p-10">
                    <h1 className="text-lg md:text-xl lg:text-2xl text-center font-extrabold mb-5">
                        Simulation Detail
                    </h1>
                    {currentFunc && allNetworkData && contractIndex && (
                        <>
                            <div className="flex justify-start items-baseline gap-3">
                                <div className="text-black font-semibold text-sm md:text-base lg:text-lg">Routes :</div>
                                <div className="text-black font-medium text-xs md:text-sm">{`${NetworkNameByStargateChainId[fromChainId]} -> ${NetworkNameByStargateChainId[toChainId]}`}</div>
                            </div>

                            <div className="flex justify-start items-baseline gap-3">
                                <div className="text-black font-semibold text-sm md:text-base lg:text-lg">
                                    Lending Protocol:
                                </div>
                                <div className="text-black font-medium text-xs md:text-sm">
                                    {allNetworkData?.contracts[contractIndex].contractName}
                                </div>
                            </div>

                            <div className="flex justify-start items-baseline gap-3">
                                <div className="text-black font-semibold text-sm md:text-base lg:text-lg">
                                    Destination lending method:
                                </div>
                                <div className="text-black font-medium text-xs md:text-sm">{currentFunc}</div>
                            </div>

                            <div className="flex justify-start items-baseline gap-3">
                                <div className="text-black font-semibold text-sm md:text-base lg:text-lg">Amount :</div>
                                <div className="text-black font-medium text-xs md:text-sm">
                                    {/* {`${bg(amountIn).dividedBy(bg(10).pow(tokenInDecimals)).toString()} USDC`} */}
                                    {`${amountIn} USDC`}
                                </div>
                            </div>

                            <div className="flex justify-start items-baseline gap-3">
                                <div className="text-black font-semibold text-sm md:text-base lg:text-lg">
                                    Recipient:
                                </div>
                                <div className="text-black font-medium text-xs md:text-sm">{shorten(address)}</div>
                            </div>

                            {gasCost && bridgeGasCost && fromChainId ? (
                                <>
                                    <div className="flex justify-start items-baseline gap-3">
                                        <div className="text-black font-semibold text-sm md:text-base lg:text-lg">
                                            Gas Cost:
                                        </div>
                                        <div className="text-black font-medium text-xs md:text-sm">
                                            {`${gasCost} ${gasFeesNamesByChainId[fromChainId]}`}
                                        </div>
                                    </div>

                                    <div className="flex justify-start items-baseline gap-3">
                                        <div className="text-black font-semibold text-sm md:text-base lg:text-lg">
                                            Bridge Gas Cost:
                                        </div>
                                        <div className="text-black font-medium text-xs md:text-sm">
                                            {`${bridgeGasCost} ${gasFeesNamesByChainId[fromChainId]}`}
                                        </div>
                                    </div>

                                    <div className="flex justify-start items-baseline gap-3">
                                        <div className="text-black font-semibold text-sm md:text-base lg:text-lg">
                                            Total Gas Cost:
                                        </div>
                                        <div className="text-black font-medium text-xs md:text-sm">
                                            {`${
                                                bridgeGasCost && gasCost && bg(bridgeGasCost).plus(gasCost).toString()
                                            } ${gasFeesNamesByChainId[fromChainId]}`}{" "}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                ""
                            )}

                            <div className="w-full flex justify-center items-center my-3">
                                <button
                                    type="button"
                                    onClick={(e: any) => simulate(currentFuncIndex)}
                                    className="w-40 flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                                >
                                    {simulateLoading && <ImSpinner className="animate-spin h-5 w-5" />}
                                    Simulate
                                </button>
                            </div>
                        </>
                    )}

                    {/* {currentFunc && funcArray &&
                        currentFuncIndex >= 0 &&
                        funcArray.length > 0 &&
                        funcArray[currentFuncIndex].inputs.map((input: any, inputIndex: any) => (
                            <>
                                <div className="flex justify-start items-baseline gap-3 text-black">
                                    {isThisAmount == inputIndex && input.type == "uint256" ? (
                                        <div className="flex justify-start items-baseline gap-3">
                                            <div className="font-semibold text-sm md:text-base lg:text-lg">
                                                {input.name} :
                                            </div>
                                            <button
                                                // onClick={(e: any) => isThisFieldAmount(inputIndex)}
                                                className="py-1 px-3 text-xs font-normal bg-black rounded-lg"
                                            >
                                                isThisAmountField
                                            </button>
                                            {`  :`}
                                            <div className="font-medium text-xs md:text-sm">
                                                {params[currentFuncIndex] &&
                                                params[currentFuncIndex][inputIndex] != undefined
                                                    ? bg(params[currentFuncIndex][inputIndex])
                                                          .dividedBy(bg(10).pow(tokenInDecimals))
                                                          .toString()
                                                    : bg(amountIn).dividedBy(bg(10).pow(tokenInDecimals)).toString()}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-start items-baseline gap-3 text-black">
                                            <div className="font-semibold text-sm md:text-base lg:text-lg">
                                                {input.name} :
                                            </div>
                                            <div className="font-medium text-xs md:text-sm">
                                                {params[currentFuncIndex] &&
                                                params[currentFuncIndex][inputIndex] != undefined
                                                    ? params[currentFuncIndex][inputIndex]
                                                    : ""}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ))} */}

                    {currentFunc && isSimulationSuccessOpen && (
                        <div className="relative">
                            <div className="simulation-success flex justify-between items-center gap-5 bg-black py-2 px-5 rounded-lg text-primary-100 font-medium   transition duration-300">
                                <h1 className="flex justify-center items-center gap-3 text-white font-semibold text-base">
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
                                <span className="flex justify-center items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="success-toggle"
                                        checked={isSimulationSuccessDetailShow}
                                        onChange={(e: any) => setIsSimulationSuccessDetailShow(e.target.checked)}
                                    />
                                    <label htmlFor="success-toggle" className="success-dropdown">
                                        <FaChevronDown className="arrow cursor-pointer" />
                                    </label>
                                </span>
                            </div>
                            {isSimulationSuccessDetailShow && (
                                <div className="w-full my-1 z-50 flex flex-col justify-center items-start gap-1 bg-black p-3 rounded-lg">
                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                        <div className="w-60 font-medium text-sm">Destination Method: </div>
                                        <div className="w-full font-normal text-xs">
                                            sgReceive and {`${currentFunc}`}
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                        <div className="w-60 font-medium text-sm">Gaslimit: </div>
                                        <div className="w-full font-normal text-xs">{gasUsed}</div>
                                    </div>

                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                        <div className="w-60 font-medium text-sm">Gas cost: </div>
                                        <div className="w-full font-normal text-xs">
                                            {gasCost} {gasFeesNamesByChainId[fromChainId]}
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                        <div className="w-60 font-medium text-sm">Bridge gas cost: </div>
                                        <div className="w-full font-normal text-xs">
                                            {bridgeGasCost} {gasFeesNamesByChainId[fromChainId]}
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                        <div className="w-60 font-medium text-sm">Total gas cost: </div>
                                        <div className="w-full font-normal text-xs">
                                            {bg(bridgeGasCost).plus(gasCost).toString()}{" "}
                                            {gasFeesNamesByChainId[fromChainId]}
                                        </div>
                                    </div>
                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                        <div className="w-60 font-medium text-sm">Lending CallData: </div>
                                        <div className="w-full flex justify-start items-center gap-2 font-normal text-xs">
                                            <span className="text-sm font-medium">
                                                {simulateInputData &&
                                                    simulateInputData.slice(0, 15) +
                                                        "..." +
                                                        simulateInputData.slice(-5)}
                                            </span>
                                            <FiCopy
                                                className="text-white hover:text-gray-300 active:text-gray-500"
                                                onClick={() => copyToClipboard(simulateInputData)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {isSimulationErrorOpen && (
                        <div className="relative">
                            <div className="simulation-error flex justify-between items-center gap-5 bg-black py-2 px-5 rounded-lg text-primary-100 font-medium   transition duration-300">
                                <h1 className="flex justify-center items-center gap-3 text-white font-semibold text-base">
                                    <svg
                                        className="h-6 w-6 text-red-500"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10" /> <line x1="15" y1="9" x2="9" y2="15" />{" "}
                                        <line x1="9" y1="9" x2="15" y2="15" />
                                    </svg>
                                    Simulation Error
                                </h1>

                                <span className="flex justify-center items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="error-toggle"
                                        checked={isSimulationErrorDetailShow}
                                        onChange={(e: any) => setIsSimulationErrorDetailShow(e.target.checked)}
                                    />
                                    <label htmlFor="error-toggle" className="error-dropdown">
                                        <FaChevronDown className="arrow cursor-pointer" />
                                    </label>
                                </span>
                            </div>
                            {isSimulationErrorDetailShow && (
                                <div className="w-full my-1 z-50 flex flex-col justify-center items-start gap-1 bg-black p-3 rounded-lg">
                                    {currentFunc && (
                                        <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                            <div className="w-20 font-medium text-sm">Method :</div>
                                            <div className="w-full font-normal text-xs">
                                                {/* {funcArray.length > 0 && funcArray[currentFuncIndex].name} */}
                                                sgReceive
                                            </div>
                                        </div>
                                    )}

                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                        <div className="w-20 font-medium text-sm">Error :</div>
                                        <div className="w-full font-normal text-xs">{simulationErrorMsg}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {isSimulationSuccessOpen && currentFunc && (
                        <>
                            <div className="flex justify-center items-center gap-3 py-3">
                                <button
                                    type="button"
                                    onClick={(e: any) => sendTx(currentFuncIndex, true)}
                                    className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                                >
                                    {sendTxLoading && <ImSpinner className="animate-spin h-5 w-5" />}
                                    SendTx via SmartAccount
                                </button>
                                <button
                                    type="button"
                                    onClick={(e: any) => sendTx(currentFuncIndex, false)}
                                    className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                                >
                                    {sendTxLoadingForEoa && <ImSpinner className="animate-spin h-5 w-5" />}
                                    SendTx via EOA
                                </button>
                            </div>
                            {txhash && (
                                <div className="flex justify-center items-center gap-3 py-5">
                                    <p>
                                        <a
                                            target="_blank"
                                            href={buildTxHash("0", txhash, true)}
                                            style={{ color: "green", fontWeight: "bold" }}
                                        >
                                            TxHash: {shorten(txhash)}
                                        </a>
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {isSimulationErrorOpen && (
                        <div className="flex justify-center items-center gap-3 py-5">
                            <button
                                type="button"
                                className="bg-red-600 hover:bg-red-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-red-800 hover:border-red-900 transition duration-300"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CrossChainDefi;
