import * as React from "react";
import { useEffect } from "react";
import { BigNumber as bg } from "bignumber.js";
import { BiSolidDownArrow, BiSolidChevronDown } from "react-icons/bi";
import { ImSpinner9, ImSpinner } from "react-icons/im";
import { BsArrowRightCircleFill, BsChevronDown } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import { HiOutlineRefresh } from "react-icons/hi";
import { useSigner, useAddress, useChain, useSwitchChain, useConnect, metamaskWallet } from "@thirdweb-dev/react";
import { useAppStore } from "../store/appStore";
import { chooseChianId, shorten } from "../utils/helper";
import {
    NetworkNameByChainId,
    _functionType,
    _nonce,
    bundlerURLs,
    methodWithApi,
    paymasterURLs,
    tokensByNetwork,
} from "../utils/constants";
import { fetchMethodParams, getNetworkAndContractData } from "../utils/apis";
import { useSendTx } from "../hooks/useSendTx";
import { useSimulate } from "../hooks/useSimulate";
import { useGenerateAbis } from "../hooks/useGenerateAbis";
import { useOnChangeFunctions, useOnChangeInput, useOnChangeTokenIn } from "../hooks/useOnChangeMainForm";
import { ChainId } from "@biconomy/core-types";
import { IBundler, Bundler } from "@biconomy/bundler";
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import ChainContext from "../Context/ChainContext";
import { toast } from "react-hot-toast";
import { useCalculatebalance } from "../hooks/useCalculateBalance";

export default function TestMainForm() {
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
    const { selectedChain, setSelectedChain, selectedChainId, setSelectedChainId } = React.useContext(ChainContext);
    const {
        connected,
        smartAccount,
        setSmartAccount,
        setCurrentProvider,

        fromChainId,
        setFromChainId,
        toChainId,
        setToChainId,
        srcPoolId,
        setSrcPoolId,
        destPoolId,
        setDestPoolId,

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
        currentAbi,
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
        setGasUsed,
        simulateInputData,
        setSimulateInputData,
        simulateLoading,
        setSimulationLoading,

        sendTxLoading,
        sendTxLoadingForEoa,
        txhash,
        loading,
        setLoading,
    }: any = useAppStore((state) => state);

    useEffect(() => {
        setIsSimulationOpen(false);
    }, []);

    useEffect(() => {
        async function updateParams() {
            if (currentFuncIndex) {
                setParams("");
                setFixParams("");
                const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress;
                const apiUrl = methodWithApi[toChainId][contractAddress][funcArray[currentFuncIndex].name];

                const response: any = await fetchMethodParams(
                    fromChainId,
                    toChainId,
                    funcArray,
                    amountIn,
                    smartAccount,
                    address,
                    currentFuncIndex,
                    currentFunc,
                    apiUrl
                );
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
        if (fromChainId) {
            const token: any = tokensByNetwork[fromChainId];
            setTokenIn(token.usdc);
            setTokenInDecimals(6);
            setAmountIn("");
            setContractIndex("");
            resetField();
        }
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
        setFunctionArray([]);
        setParams("");
        setFixParams("");
        setCurrentFunc("");
        setCurrentFuncIndex(0);
        setIsThisFieldAmount(-1);

        setGasUsed(undefined);
        setSimulateInputData(undefined);
        setSimulation(undefined);
    };

    const onChangeFromNetwork = async (_fromNetwork: any) => {
        try {
            if (!connected) {
                alert("Please connect to metamask");
                setFromChainId("");
                return;
            }
            setLoading(true);
            setTokenIn("");
            setToChainId("");
            setData("");
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
        if (!smartAccount) {
            alert("You need to biconomy login");
            return;
        }
        setContractIndex(_contractIndex);
    };

    // for e.g usdt -> usdc
    const onChangeTokenIn = async (tokenIn: any) => {
        await onChangeTokenInHook({ fromChainId, tokenIn });
    };

    // for e.g 0 -> 1000
    const handleAmountIn = async (_amountIn) => {
        if (!smartAccount) {
            alert("You need to biconomy login");
            return;
        }
        if (_amountIn) {
            let amountInByDecimals = bg(_amountIn);
            amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(tokenInDecimals));
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
        await onChangeFunctionsHook({ funcIndex, address });
    };

    const onChangeInput = async (funcIndex: any, inputIndex: any, inputValue: any) => {
        await onChangeInputHook({ funcIndex, inputIndex, inputValue });
    };

    const isThisFieldAmount = async (index: any) => {
        if (index >= 0) {
            setIsThisFieldAmount(index);
        } else {
            alert("Somethig gets wrong");
        }
    };

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
        // console.log("biconomySmartAccount-1: ", biconomySmartAccount);
        // console.log("address: ", await biconomySmartAccount.getSmartAccountAddress());
        // console.log("owner: ", biconomySmartAccount.owner);
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

    return (
        <>
            <div className="main-container flex justify-start items-start gap-3">
                {true && (
                    <div className="w-full h-[calc(100vh-108px)] bg-gradient-to-r from-primary-950 via-primary-600 to-primary-950 flex flex-col justify-center items-center gap-5 border-2 border-secondary-800 shadow-sm shadow-primary-950 rounded-lg cursor-pointer p-10">
                        <div className="w-full">
                            <span className="text-white font-semibold text-xs md:text-sm lg:text-base">From</span>
                            <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow-md rounded-md mt-1">
                                <div className="w-48 relative">
                                    <label htmlFor="fromNetwork" className="sr-only">
                                        Network
                                    </label>
                                    <select
                                        className="appearance-none w-full outline-none px-3 py-1 font-medium"
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
                                        className="appearance-none w-full outline-none px-3 py-1 font-medium"
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

                        <div className="text-white -mb-3">
                            <HiOutlineRefresh size="22px" />
                        </div>

                        <div className="w-full">
                            <span className="text-white font-semibold text-xs md:text-sm lg:text-base">To</span>
                            <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow-md rounded-md mt-1">
                                <div className="w-48 relative">
                                    <label htmlFor="toNetwork" className="sr-only">
                                        Network
                                    </label>
                                    <select
                                        className="appearance-none w-full outline-none px-3 py-1 font-medium"
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
                                        <option value="101">Mainnet</option>
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
                                        className="appearance-none w-full outline-none px-3 py-1 font-medium"
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

                        <div className="w-full">
                            <div className="flex justify-between items-center gap-2 text-white font-semibold text-xs md:text-sm pr-2">
                                <span>Total Amount</span>
                                <span>Balance : ...</span>
                            </div>
                            <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow-md rounded-md mt-1">
                                <input
                                    type="number"
                                    placeholder=""
                                    className="w-full bg-white font-medium outline-none shadow-outline border-2  rounded-md py-1 px-3 block appearance-none leading-normal focus:border-primary-950"
                                    value={
                                        amountIn != 0
                                            ? bg(amountIn).dividedBy(bg(10).pow(tokenInDecimals)).toString()
                                            : amountIn
                                    }
                                    onChange={(e: any) => handleAmountIn(e.target.value)}
                                />
                            </div>
                        </div>

                        {isSimulationOpen && allNetworkData && funcArray && (
                            <div className="w-full mt-3">
                                <span className="text-white font-semibold text-xs md:text-sm lg:text-base">
                                    Build DestinationChain Method/Calldata to execute after bridge funds
                                </span>

                                <div className="w-full flex justify-start items-center gap-1 border-2 border-secondary-300 text-secondary-800 bg-white shadow-md rounded-md mt-1">
                                    <div className="w-full relative">
                                        <label htmlFor="funcNames" className="sr-only">
                                            Select Function Name
                                        </label>
                                        <select
                                            className="appearance-none w-full outline-none px-3 py-1 font-medium"
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
                                        <div className="bg-white pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2">
                                            <BiSolidChevronDown size="20px" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isSimulationOpen && !allNetworkData ? (
                            <button
                                type="button"
                                onClick={() => setIsSimulationOpen(false)}
                                className="w-32 mt-8 flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-1 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                            >
                                <ImSpinner9 className="animate-spin h-5 w-5" />
                                Bridge
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
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
                                    setIsSimulationOpen(true);
                                }}
                                className="w-32 flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-1 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                            >
                                Bridge
                            </button>
                        )}
                    </div>
                )}

                <div className="w-full h-[calc(100vh-108px)] bg-gradient-to-r from-primary-950 via-primary-600 to-primary-950 flex flex-col gap-2 border-2 border-secondary-800 shadow-sm shadow-primary-950 rounded-lg cursor-pointer p-10">
                    {currentFunc && (
                        <>
                            <div className="flex justify-start items-baseline gap-3">
                                <div className="text-white font-semibold text-sm md:text-base lg:text-lg">Routes :</div>
                                <div className="text-white font-medium text-xs md:text-sm">Polygon</div>
                            </div>

                            <div className="flex justify-start items-baseline gap-3">
                                <div className="text-white font-semibold text-sm md:text-base lg:text-lg">
                                    Destination :
                                </div>
                                <div className="text-white font-medium text-xs md:text-sm">Aave</div>
                            </div>

                            <div className="flex justify-start items-baseline gap-3">
                                <div className="text-white font-semibold text-sm md:text-base lg:text-lg">Amount :</div>
                                <div className="text-white font-medium text-xs md:text-sm">0.1 USDC</div>
                            </div>

                            <div className="flex justify-start items-baseline gap-3">
                                <div className="text-white font-semibold text-sm md:text-base lg:text-lg">
                                    Recipient :
                                </div>
                                <div className="text-white font-medium text-xs md:text-sm">0x3c1...0fdd</div>
                            </div>

                            <div className="flex justify-start items-baseline gap-3">
                                <div className="text-white font-semibold text-sm md:text-base lg:text-lg">
                                    Gas Cost :
                                </div>
                                <div className="text-white font-medium text-xs md:text-sm">0.23 Matic</div>
                            </div>
                        </>
                    )}

                    {/* {currentFunc &&
                        currentFuncIndex >= 0 &&
                        funcArray.length > 0 &&
                        funcArray[currentFuncIndex].inputs.map((input: any, inputIndex: any) => (
                            <>
                                <div className="flex justify-start items-baseline gap-3 text-white">
                                    {isThisAmount == inputIndex && input.type == "uint256" ? (
                                        <div className="flex justify-start items-baseline gap-3">
                                            <div className="font-semibold text-sm md:text-base lg:text-lg">
                                                {input.name} :
                                            </div>
                                            <button
                                                onClick={(e: any) => isThisFieldAmount(inputIndex)}
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
                                        <div className="flex justify-start items-baseline gap-3 text-white">
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

                    {currentFunc && (
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
                    )}

                    {isSimulationSuccessOpen && (
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
                                <div className="w-full absolute top-[42px] z-50 flex flex-col justify-center items-start gap-1 bg-gray-700 p-3 rounded-lg">
                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                        <div className="w-20 font-medium text-sm">Method :</div>
                                        <div className="w-full font-normal text-xs">sgReceive</div>
                                    </div>

                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                        <div className="w-20 font-medium text-sm">Gas :</div>
                                        <div className="w-full font-normal text-xs">{gasUsed}</div>
                                    </div>

                                    <div className="w-full flex justify-start items-baseline gap-2 text-white">
                                        <div className="w-20 font-medium text-sm">Call Data :</div>
                                        <div className="w-full font-normal text-xs">
                                            {simulateInputData &&
                                                simulateInputData.slice(0, 15) + "..." + simulateInputData.slice(-5)}
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
                                <div className="w-full absolute top-[42px] z-50 flex flex-col justify-center items-start gap-1 bg-gray-700 p-3 rounded-lg">
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
                                    sendTx via SCW
                                </button>
                                <button
                                    type="button"
                                    onClick={(e: any) => sendTx(currentFuncIndex, false)}
                                    className="flex justify-center items-center gap-2 bg-success-600 hover:bg-success-700 py-2 px-5 rounded-lg text-white font-medium border-b-4 border-success-800 hover:border-success-900 transition duration-300"
                                >
                                    {sendTxLoadingForEoa && <ImSpinner className="animate-spin h-5 w-5" />}
                                    sendTx via EOA
                                </button>
                            </div>
                            <div className="flex justify-center items-center gap-3 py-5">
                                {txhash && (
                                    <p>
                                        <a
                                            target="_blank"
                                            href={`https://socketscan.io/tx/${txhash}`}
                                            style={{ color: "white" }}
                                        >
                                            TxHash : {shorten(txhash)}
                                        </a>
                                    </p>
                                )}
                            </div>
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
}
