import { useEffect } from "react";

import { BigNumber } from "ethers";
import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { Bundler, IBundler } from "@biconomy/bundler";
import { BiconomyPaymaster, IPaymaster } from "@biconomy/paymaster";
import { BiconomySmartAccount, BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { metamaskWallet, useAddress, useChain, useConnect, useSigner, useSwitchChain } from "@thirdweb-dev/react";

import Trade from "./Trade";
import IERC20 from "../../abis/IERC20.json";
import { setSafeState } from "../../utils/helper";
import { useSimulate } from "../../hooks/useSimulate";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { getNetworkAndContractData } from "../../utils/apis";
import { useGenerateAbis } from "../../hooks/useGenerateAbis";
import { useRefinance } from "../../hooks/Batching/useRefinance";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { useCCRefinance } from "../../hooks/Batching/useCCRefinance";
import { useEoaProvider } from "../../hooks/aaProvider/useEoaProvider";
import { useSwitchOnSpecificChain } from "../../hooks/useSwitchOnSpecificChain";
import { iSelectedNetwork, iTrade, useTradeStore } from "../../store/TradeStore";
import { useBiconomyProvider } from "../../hooks/aaProvider/useBiconomyProvider";
import { useOnChangeFunctions, useOnChangeTokenIn } from "../../hooks/useOnChangeMainForm";
import { getContractInstance, getErc20Balanceof, getErc20Decimals, getProvider } from "../../utils/web3Libs/ethers";
import {
    _functionType,
    _nonce,
    bundlerURLs,
    paymasterURLs,
    protocolByNetwork,
    StargateChainIdBychainId,
    tokenAddressByProtocol,
    tokensByNetwork,
} from "../../utils/constants";

bg.config({ DECIMAL_PLACES: 10 });

interface TokenInfo {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    extensions?: Record<string, { tokenAddress: string }>;
}

interface TokenList {
    name: string;
    timestamp: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    tags: Record<string, any>;
    logoURI: string;
    keywords: string[];
    tokens: TokenInfo[];
}

const TradeContainer: React.FC<any> = () => {
    const chain = useChain(); // Detect the connected address
    const address = useAddress(); // Detect the connected address

    const { mutateAsync: sendToBiconomy } = useBiconomyProvider();
    const { mutateAsync: sendTxTrditionally } = useEoaProvider();
    const { mutateAsync: refinance } = useRefinance();
    const { mutateAsync: refinanceForCC } = useCCRefinance();

    const switchChain = useSwitchChain();
    const signer: any = useSigner(); // Detect the connected address
    const connect = useConnect();
    const metamaskConfig = metamaskWallet();
    const { mutateAsync: simulateTx } = useSimulate();
    const { mutateAsync: generateAbisForContract } = useGenerateAbis();
    const { mutateAsync: onChangeTokenInHook } = useOnChangeTokenIn();
    const { mutateAsync: onChangeFunctionsHook } = useOnChangeFunctions();

    const { mutateAsync: switchOnSpecificChain } = useSwitchOnSpecificChain();

    const { scwBalance, smartAccount, setLoading, setSmartAccount, setConnected }: iGlobal = useGlobalStore(
        (state) => state
    );

    const {
        maxBalance,
        setMaxBalance,
        setIsmaxBalanceLoading,
        selectedFromNetwork,
        setSelectedFromNetwork,
        selectedFromProtocol,
        setSelectedFromProtocol,
        selectedFromToken,
        setSelectedFromToken,
        selectedToNetwork,
        setSelectedToNetwork,
        selectedToProtocol,
        setSelectedToProtocol,
        selectedToToken,
        setSelectedToToken,
        showFromSelectionMenu,
        setShowFromSelectionMenu,
        showToSelectionMenu,
        setShowToSelectionMenu,
        showCrossChainSelectionMenu,
        setShowCrossChainSelectionMenu,
        tokensData,
        setTokensData,
        amountIn,
        setAmountIn,
        fromTokenDecimal,
        setFromTokenDecimal,
        fromTokenBalanceForSCW,
        setFromTokenBalanceForSCW,
        fromTokenBalanceForEOA,
        setFromTokenBalanceForEOA,
        filterFromToken,
        setFilterFromToken,
        filterToToken,
        setFilterToToken,
        filterFromAddress,
        setFilterFromAddress,
        filterToAddress,
        setFilterToAddress,
        addToBatchLoading,
        setAddToBatchLoading,
        showBatchList,
        setShowBatchList,
        showIndividualBatchList,
        setShowIndividualBatchList,
        txhash,
        setTxHash,
        sendTxLoading,
        setSendTxLoading,
        sendTxLoadingForEoa,
        setSendTxLoadingForEoa,
        individualBatch,
        setIndividualBatch,

        tokenIn,
        setTokenIn,
        tokenInDecimals,
        setTokenInDecimals,
        isThisAmount,
        setIsThisFieldAmount,

        contractIndex,
        setContractIndex,
        selectedToContractAddress,
        setSelectedToContractAddress,
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

        setShowExecuteBatchModel,
        setHasExecutionError,
    }: iTrade = useTradeStore((state) => state);

    const generateAbis = async () => {
        await generateAbisForContract();
    };

    const fetchMaxbalance = async () => {
        let tokenAddress: string;
        const provider = await getProvider(selectedFromNetwork.chainId);

        if (selectedFromProtocol == "erc20") {
            tokenAddress = tokensData?.filter((token) => token.symbol === selectedFromToken)[0].address;
        } else {
            tokenAddress =
                tokenAddressByProtocol[selectedFromNetwork.chainName][selectedFromProtocol][selectedFromToken];
        }

        const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
        const maxBal: any = await getErc20Balanceof(erc20, smartAccount.address);
        const fromTokendecimal: any = await getErc20Decimals(erc20);
        const MaxBalance = bg(maxBal?.toString()).dividedBy(bg(10).pow(fromTokendecimal));

        return MaxBalance.toString();
    };

    const handleContractAddress = async (_contractIndex: string, _contractDetail: any) => {
        // if (simulateLoading || sendTxLoading || sendTxLoadingForEoa) {
        //     toast.error("wait, tx loading currently ...");
        //     return;
        // }
        if (!smartAccount) {
            toast.error("You need to biconomy login");
            return;
        }
        setContractIndex(_contractIndex);
        setSelectedToContractAddress(_contractDetail.contractName);
    };

    // for e.g usdt -> usdc
    const onChangeTokenIn = async (tokenIn: any) => {
        if (!selectedFromNetwork.chainId) {
            toast.error("From network is not selecetd yet");
            return;
        }
        const provider = await getProvider(selectedFromNetwork.chainId);

        const token = tokensByNetwork[selectedFromNetwork.chainId];
        const erc20 = await getContractInstance(token.usdc, IERC20, provider);
        const scwBalance = await getErc20Balanceof(erc20, smartAccount.address);
        const eoaBalance = await getErc20Balanceof(erc20, address);

        // setSafeState(setScwTokenInbalance, BigNumber.from(scwBalance), BIG_ZERO);
        // setSafeState(setEoaTokenInbalance, BigNumber.from(eoaBalance), BIG_ZERO);

        const { chainId } = selectedFromNetwork;
        await onChangeTokenInHook({ fromChainId: chainId, tokenIn });
    };

    const onChangeFunctions = async (funcIndex: any) => {
        if (funcIndex == "") return toast.error("Please select operation");
        await onChangeFunctionsHook({ funcIndex, address });
    };

    const simulate = async (funcIndex: any) => {
        simulateTx({ funcIndex, address });
    };

    useEffect(() => {
        if (individualBatch.length === 1 && individualBatch[0].txArray.length === 0) {
            setShowBatchList(false);
        }
    }, [individualBatch]);

    useEffect(() => {
        if (selectedToNetwork.chainId) {
            setContractIndex("");
            resetField();
        }
    }, [selectedToNetwork]);

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
    };

    const handleSelectFromNetwork = (_fromNetwork: iSelectedNetwork) => {
        clearSelectedBatchData();
        setLoading(true);
        setCurrentFunc("");
        setData(null);
        if (selectedFromNetwork.chainName !== _fromNetwork.chainName) {
            switchOnSpecificChain(_fromNetwork.chainName);
            setSelectedFromNetwork(_fromNetwork);
        }
        setSelectedFromNetwork(_fromNetwork);
        setLoading(false);
    };

    const handleSelectToNetwork = async (_toNetwork: iSelectedNetwork) => {
        try {
            setData(null);
            setSelectedToNetwork(_toNetwork);
            const response: any = await getNetworkAndContractData(
                StargateChainIdBychainId[selectedFromNetwork.chainId],
                StargateChainIdBychainId[_toNetwork.chainId]
            );
            if (response.data) {
                setData(response.data);
            }
        } catch (error) {
            console.error("API Error:", error);
        }
    };

    const closeFromSelectionMenu = () => {
        setShowFromSelectionMenu(false);
        setFilterFromToken("");
        setFilterFromAddress("");
    };

    const closeToSelectionMenu = () => {
        setShowToSelectionMenu(false);
        setFilterToToken("");
        setFilterToAddress("");
    };

    useEffect(() => {
        async function changeWallet() {
            if (!address) {
                setTokenIn("");
                // setFromChainId("")
                // setToChainId("")
                setAmountIn("");
                setContractIndex("");
                setFunctionArray([]);
                setSmartAccount(null);
                setConnected(false);

                setSelectedFromNetwork({
                    key: "",
                    chainName: "",
                    chainId: "",
                    icon: "",
                });
            }
        }
        changeWallet();
    }, [address]);

    useEffect(() => {
        if (selectedFromNetwork.chainName && selectedFromProtocol && selectedFromToken) {
            closeFromSelectionMenu();
        }
    }, [selectedFromNetwork, selectedFromProtocol, selectedFromToken]);

    useEffect(() => {
        if (selectedToNetwork.chainName && selectedToProtocol && selectedToToken) {
            closeToSelectionMenu();
        }
    }, [selectedToNetwork, selectedToProtocol, selectedToToken]);

    useEffect(() => {
        if (contractIndex && currentFunc) {
            setShowCrossChainSelectionMenu(false);
        }
    }, [contractIndex, currentFunc]);

    function convertIpfsUrl(ipfsUri: string): string {
        // Check if the input URI starts with 'ipfs://'
        if (ipfsUri.startsWith("ipfs://")) {
            // Remove the 'ipfs://' prefix
            const ipfsHash = ipfsUri.replace("ipfs://", "");

            // Create the Cloudflare IPFS URL
            const cloudflareIpfsUrl = `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`;

            return cloudflareIpfsUrl;
        }

        // If the input doesn't start with 'ipfs://', return it as is
        return ipfsUri;
    }

    function getTokenListByChainId(chainId: any, tokenList: any): TokenInfo[] {
        return tokenList.tokens
            .map((token) => {
                console.log("token.chainId", token.chainId, chainId);
                if (token.chainId == chainId) {
                    return {
                        chainId: token.chainId,
                        address: token.address,
                        name: token.name,
                        symbol: token.symbol,
                        decimals: token.decimals,
                        logoURI: token.logoURI.includes("ipfs") ? convertIpfsUrl(token.logoURI) : token.logoURI,
                    };
                } else if (token.extensions && token.extensions.bridgeInfo[chainId.toString()]) {
                    const tokenAddress = token.extensions.bridgeInfo[chainId.toString()].tokenAddress;
                    return {
                        chainId: chainId,
                        address: tokenAddress,
                        name: token.name,
                        symbol: token.symbol,
                        decimals: token.decimals,
                        logoURI: token.logoURI.includes("ipfs") ? convertIpfsUrl(token.logoURI) : token.logoURI,
                    };
                }
                return null;
            })
            .filter(Boolean) as TokenInfo[];
    }

    useEffect(() => {
        async function onChangeselectedFromProtocol() {
            if (selectedFromProtocol) {
                if (selectedFromProtocol !== "erc20") {
                    setAmountIn("");
                    setFromTokenDecimal(0);
                    // setFromTokenBalanceForSCW(BIG_ZERO);
                    // setFromTokenBalanceForEOA(BIG_ZERO);

                    const firstFromToken =
                        protocolByNetwork[selectedFromNetwork.chainName][selectedFromProtocol][0].name;
                    // setSelectedFromToken(firstFromToken);

                    const provider = await getProvider(selectedFromNetwork.chainId);
                    const tokenAddress =
                        tokenAddressByProtocol[selectedFromNetwork.chainName][selectedFromProtocol][firstFromToken];
                    const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
                    // const scwBalance = await getErc20Balanceof(erc20, smartAccount?.address);
                    // const eoaBalance = await getErc20Balanceof(erc20, address);
                    const fromTokendecimal = await getErc20Decimals(erc20);
                    setSafeState(setFromTokenDecimal, fromTokendecimal, 0);
                    // setSafeState(setFromTokenBalanceForSCW, BigNumber.from(scwBalance), BIG_ZERO);
                    // setSafeState(setFromTokenBalanceForEOA, BigNumber.from(eoaBalance), BIG_ZERO);
                } else {
                    const filteredTokens = getTokenListByChainId(selectedFromNetwork.chainId, UNISWAP_TOKENS);
                    console.log("filteredTokens++++++++++:", filteredTokens);

                    // const tokensWithChainId = UNISWAP_TOKENS.tokens?.filter((token) => token.chainId === BigNumber.from(selectedFromNetwork.chainId).toNumber());
                    // const filteredTokens = tokensWithChainId.map((token) => {
                    //     const { extensions, logoURI, ...filteredToken } = token;
                    //     return filteredToken;
                    // });
                    // console.log("filteredTokens++++++++++:", filteredTokens)

                    setTokensData(filteredTokens);
                }
            }
        }
        onChangeselectedFromProtocol();
    }, [selectedFromProtocol]);

    useEffect(() => {
        async function onChangeselectedToProtocol() {
            if (selectedToProtocol) {
                if (selectedToProtocol == "erc20" && tokensData.length < 1) {
                    // const tokensWithChainId = UNISWAP_TOKENS.tokens?.filter((token) => token.chainId === BigNumber.from(selectedToNetwork.chainId).toNumber());
                    // const filteredTokens = tokensWithChainId.map((token) => {
                    //     const { extensions, logoURI, ...filteredToken } = token;
                    //     return filteredToken;
                    // });
                    const filteredTokens = getTokenListByChainId(selectedFromNetwork.chainId, UNISWAP_TOKENS);
                    console.log("filteredTokenList++++++++++:", filteredTokens);
                    setTokensData(filteredTokens);
                }
            }
        }
        onChangeselectedToProtocol();
    }, [selectedToProtocol]);

    const onChangeFromProtocol = async (_fromProtocol: string) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        if (
            !(
                selectedFromNetwork.chainName == "polygon" ||
                selectedFromNetwork.chainName == "base" ||
                selectedFromNetwork.chainName == "avalanche" ||
                selectedFromNetwork.chainName == "arbitrum" ||
                selectedFromNetwork.chainName == "optimism"
            )
        ) {
            toast.error("Batching is only supported on polygon and base as of now");
            return;
        }
        setSelectedFromToken("");
        setFilterFromAddress("");
        setFilterToAddress("");

        if (selectedFromProtocol === _fromProtocol) {
            setSelectedFromProtocol("");
        } else {
            setSelectedFromProtocol(_fromProtocol);
        }
    };

    const onChangeFromToken = async (_fromToken: string) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        if (
            !(
                selectedFromNetwork.chainName == "polygon" ||
                selectedFromNetwork.chainName == "base" ||
                selectedFromNetwork.chainName == "avalanche" ||
                selectedFromNetwork.chainName == "arbitrum" ||
                selectedFromNetwork.chainName == "optimism"
            )
        ) {
            toast.error("Batching is only supported on polygon and base as of now");
            return;
        }
        if (!selectedFromProtocol) {
            toast.error("select from protocol");
            return;
        }

        try {
            setIsmaxBalanceLoading(true);
            setAmountIn("");
            setFromTokenDecimal(0);
            // setFromTokenBalanceForSCW(BIG_ZERO);
            // setFromTokenBalanceForEOA(BIG_ZERO);

            setSelectedFromToken(_fromToken);
            const provider = await getProvider(selectedFromNetwork.chainId);

            const erc20Address: any =
                selectedFromProtocol == "erc20" ? tokensData.filter((token: any) => token.symbol === _fromToken) : "";
            const tokenAddress =
                selectedFromProtocol != "erc20"
                    ? tokenAddressByProtocol[selectedFromNetwork.chainName][selectedFromProtocol][_fromToken]
                    : erc20Address[0].address;
            const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
            // const scwBalance = await getErc20Balanceof(erc20, smartAccount.address);
            // const eoaBalance = await getErc20Balanceof(erc20, address);
            const fromTokendecimal: any = await getErc20Decimals(erc20);
            setSafeState(setFromTokenDecimal, fromTokendecimal, 0);
            // setSafeState(setFromTokenBalanceForSCW, BigNumber.from(scwBalance), BIG_ZERO);
            // setSafeState(setFromTokenBalanceForEOA, BigNumber.from(eoaBalance), BIG_ZERO);

            let scwAddress: any;
            if (!smartAccount?.address) {
                const createAccount = async (chainId: any) => {
                    const bundler: IBundler = new Bundler({
                        bundlerUrl: bundlerURLs[chainId],
                        chainId: chainId,
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
                };
                scwAddress = await createAccount(selectedFromNetwork.chainId);
            }

            const maxBal: any = await getErc20Balanceof(
                erc20,
                smartAccount?.address ? smartAccount?.address : scwAddress.address
            );
            const MaxBalance = bg(maxBal?.toString()).dividedBy(bg(10).pow(fromTokendecimal));
            setMaxBalance(MaxBalance.toString());
            setIsmaxBalanceLoading(false);
        } catch (error: any) {
            setIsmaxBalanceLoading(false);
            console.log("onChangeFromToken ~ error:", error);
        }
    };

    const onChangeToProtocol = async (_toProtocol: string) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        if (
            !(
                selectedFromNetwork.chainName == "polygon" ||
                selectedFromNetwork.chainName == "base" ||
                selectedFromNetwork.chainName == "avalanche" ||
                selectedFromNetwork.chainName == "arbitrum" ||
                selectedFromNetwork.chainName == "optimism"
            )
        ) {
            toast.error("Batching is only supported on polygon and base as of now");
            return;
        }
        if (selectedToProtocol === _toProtocol) {
            setSelectedToProtocol("");
            setSelectedToToken("");
        } else {
            setSelectedToToken("");
            setSelectedToProtocol(_toProtocol);
        }
    };

    const onChangeToToken = async (_toToken: string) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        if (
            !(
                selectedFromNetwork.chainName == "polygon" ||
                selectedFromNetwork.chainName == "base" ||
                selectedFromNetwork.chainName == "avalanche" ||
                selectedFromNetwork.chainName == "arbitrum" ||
                selectedFromNetwork.chainName == "optimism"
            )
        ) {
            toast.error("Batching is only supported on polygon and base as of now");
            return;
        }
        setSelectedToToken(_toToken);
    };

    // for e.g 0 -> 1000
    const onChangeAmountIn = async (_amountIn: string) => {
        if (addToBatchLoading) {
            toast.error("wait, tx loading");
            return;
        }
        if (
            !(
                selectedFromNetwork.chainName == "polygon" ||
                selectedFromNetwork.chainName == "base" ||
                selectedFromNetwork.chainName == "avalanche" ||
                selectedFromNetwork.chainName == "arbitrum" ||
                selectedFromNetwork.chainName == "optimism"
            )
        ) {
            toast.error("Batching is only supported on polygon as of now");
            return;
        }
        if (_amountIn && fromTokenDecimal) {
            let amountInByDecimals = bg(_amountIn.toString());
            amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(fromTokenDecimal));
            setAmountIn(_amountIn);
        } else {
            setAmountIn("");
        }
    };

    const handleSwap = () => {
        let tempNetwork = selectedFromNetwork;
        let tempProtocol = selectedFromToken;
        let tempToken = selectedFromToken;

        setSelectedFromNetwork(selectedToNetwork);
        setSelectedToNetwork(tempNetwork);

        setSelectedFromProtocol(selectedToProtocol);
        setSelectedToProtocol(tempProtocol);

        setSelectedFromToken(selectedToToken);
        setSelectedToToken(tempToken);
    };

    const addBatch = () => {
        setIndividualBatch([
            {
                id: 0,
                txArray: [],
                data: {
                    fromNetwork: "",
                    toNetwork: "",
                    fromProtocol: "",
                    toProtocol: "",
                    fromToken: "",
                    toToken: "",
                    amountIn: "",
                },
                simulation: {
                    isSuccess: false,
                    isError: false,
                },
            },
        ]);
    };

    const removeBatch = (index: number) => {
        const updatedBatch = [...individualBatch];
        updatedBatch.splice(index, 1); // Remove the InputBar at the specified index
        setIndividualBatch(updatedBatch);
    };

    const clearSelectedBatchData = () => {
        setSelectedToNetwork({
            key: "",
            chainName: "",
            chainId: "",
            icon: "",
        });
        setSelectedFromProtocol("");
        setSelectedFromToken("");
        setSelectedToProtocol("");
        setSelectedToToken("");
        setAmountIn("");
        setFromTokenDecimal(0);
    };

    const updateInputValues = (index: number, txArray: string[], batchesFlow: any, data: any, simulation: any) => {
        if (txArray.length < 1) return toast.error("Please complete the last input before adding a new one.");
        if (individualBatch.length == 0) {
            setIndividualBatch([
                ...individualBatch,
                {
                    id: 0,
                    txArray: [],
                    batchesFlow: [],
                    data: {
                        fromNetwork: "",
                        toNetwork: "",
                        fromProtocol: "",
                        toProtocol: "",
                        fromToken: "",
                        toToken: "",
                        amountIn: "",
                    },
                    simulation: {
                        isSuccess: false,
                        isError: false,
                    },
                },
            ]);
        }
        const updatedBatch: any = [...individualBatch];
        updatedBatch[index].txArray = txArray;
        updatedBatch[index].batchesFlow = batchesFlow;
        updatedBatch[index].data = data;
        updatedBatch[index].simulation = simulation;
        setIndividualBatch([
            ...updatedBatch,
            {
                id: updatedBatch.length,
                txArray: [],
                batchesFlow: [],
                data: {
                    fromNetwork: "",
                    toNetwork: "",
                    fromProtocol: "",
                    toProtocol: "",
                    fromToken: "",
                    toToken: "",
                    amountIn: "",
                },
                simulation: {
                    isSuccess: false,
                    isError: false,
                },
            },
        ]);
        clearSelectedBatchData();
    };

    const toggleShowBatchList = (id: number): void => {
        if (showIndividualBatchList === id) {
            setShowIndividualBatchList(null);
        } else {
            setShowIndividualBatchList(id);
        }
    };

    const sendSingleBatchToList = async (isSCW: any) => {
        try {
            if (isSCW) {
                setAddToBatchLoading(true);
            }
            if (selectedFromToken == selectedToToken && selectedFromNetwork.chainName === selectedToNetwork.chainName) {
                toast.error("fromToken and toToken should not same");
                setAddToBatchLoading(false);
                return;
            }
            if (
                !(
                    selectedFromNetwork.chainName == "polygon" ||
                    selectedFromNetwork.chainName == "base" ||
                    selectedFromNetwork.chainName == "avalanche" ||
                    selectedFromNetwork.chainName == "arbitrum" ||
                    selectedFromNetwork.chainName == "optimism"
                )
            ) {
                toast.error("Batching is only supported on polygon as of now");
                setAddToBatchLoading(false);
                return;
            }
            if (amountIn.length > 0 && maxBalance < amountIn) {
                toast.error("You don't have enough funds to complete transaction");
                setAddToBatchLoading(false);
                return;
            }
            if (addToBatchLoading) {
                toast.error("wait, tx loading");
                setAddToBatchLoading(false);
                return;
            }
            if (!selectedFromProtocol) {
                toast.error("select from protocol");
                setAddToBatchLoading(false);
                return;
            }
            if (!selectedFromToken) {
                toast.error("select fromToken");
                setAddToBatchLoading(false);
                return;
            }
            if (!selectedToProtocol) {
                toast.error("select to protocol");
                setAddToBatchLoading(false);
                return;
            }
            if (!selectedToToken) {
                toast.error("select toToken");
                setAddToBatchLoading(false);
                return;
            }
            if (!amountIn && fromTokenDecimal) {
                toast.error("select amountIn");
                setAddToBatchLoading(false);
                return;
            }
            const provider = await getProvider(selectedFromNetwork.chainId);
            const _tempAmount = BigNumber.from(bg(amountIn).multipliedBy(bg(10).pow(fromTokenDecimal)).toString());

            let refinaceData: any;
            let txArray;
            if (selectedFromNetwork.chainName == selectedToNetwork.chainName) {
                refinaceData = await refinance({
                    isSCW: isSCW,
                    fromProtocol: selectedFromProtocol,
                    toProtocol: selectedToProtocol,
                    tokenIn: "",
                    tokenInName: selectedFromToken,
                    tokenOut: "",
                    tokenOutName: selectedToToken,
                    amount: _tempAmount,
                    address: isSCW ? smartAccount.address : address,
                    provider,
                });
            } else {
                refinaceData = await refinanceForCC({
                    isSCW: isSCW,
                    fromProtocol: selectedFromProtocol,
                    toProtocol: selectedToProtocol,
                    tokenIn: "",
                    tokenInName: selectedFromToken,
                    tokenOut: "",
                    tokenOutName: selectedToToken,
                    amount: _tempAmount,
                    address: isSCW ? smartAccount.address : address,
                    provider,
                });
            }

            const simulation = {
                isSuccess: true,
                isError: false,
            };

            updateInputValues(
                individualBatch.length - 1,
                refinaceData.txArray,
                refinaceData.batchFlow,
                {
                    fromNetwork: selectedFromNetwork.chainName,
                    toNetwork: selectedToNetwork.chainName,
                    fromProtocol: selectedFromProtocol,
                    toProtocol: selectedToProtocol,
                    fromToken: selectedFromToken,
                    toToken: selectedToToken,
                    amountIn: amountIn,
                },
                simulation
            );

            setAddToBatchLoading(false);
            setShowBatchList(true);
        } catch (error: any) {
            setAddToBatchLoading(false);
            setShowBatchList(true);
            toast.error(error);
            console.log("sendBatch-error", error);
        }
    };

    const ExecuteAllBatches = async (isSCW: any) => {
        try {
            if (!individualBatch[0].txArray.length) {
                toast.error("No Batch found for Execution");
                return;
            }
            setShowExecuteBatchModel(true);
            setHasExecutionError("");

            if (isSCW) {
                setSendTxLoading(true);
            } else {
                setSendTxLoadingForEoa(true);
            }
            const mergeArray: any = [];
            await individualBatch.map((bar) => bar.txArray.map((hash) => mergeArray.push(hash)));
            let tempTxhash = "";
            if (isSCW) {
                tempTxhash = await sendToBiconomy(mergeArray);
            } else {
                tempTxhash = await sendTxTrditionally(mergeArray);
            }
            if (tempTxhash) {
                setTxHash(tempTxhash);
            }
            setSendTxLoading(false);
            setSendTxLoadingForEoa(false);
            // addBatch();
        } catch (error) {
            setSendTxLoading(false);
            setSendTxLoadingForEoa(false);
        }
    };

    return (
        <Trade
            generateAbis={generateAbis}
            handleContractAddress={handleContractAddress}
            onChangeTokenIn={onChangeTokenIn}
            onChangeFunctions={onChangeFunctions}
            simulate={simulate}
            resetField={resetField}
            handleSelectFromNetwork={handleSelectFromNetwork}
            handleSelectToNetwork={handleSelectToNetwork}
            onChangeFromProtocol={onChangeFromProtocol}
            onChangeFromToken={onChangeFromToken}
            onChangeToProtocol={onChangeToProtocol}
            onChangeToToken={onChangeToToken}
            onChangeAmountIn={onChangeAmountIn}
            handleSwap={handleSwap}
            addBatch={addBatch}
            removeBatch={removeBatch}
            clearSelectedBatchData={clearSelectedBatchData}
            updateInputValues={updateInputValues}
            toggleShowBatchList={toggleShowBatchList}
            sendSingleBatchToList={sendSingleBatchToList}
            ExecuteAllBatches={ExecuteAllBatches}
            closeFromSelectionMenu={closeFromSelectionMenu}
            closeToSelectionMenu={closeToSelectionMenu}
        />
    );
};

export default TradeContainer;
