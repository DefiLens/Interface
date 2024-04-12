import { useEffect, useState } from "react";

import { ethers } from "ethers";
import { BigNumber } from "ethers";
import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { Bundler, IBundler } from "@biconomy/bundler";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { BiconomyPaymaster, IPaymaster } from "@biconomy/paymaster";
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import {
    DEFAULT_ECDSA_OWNERSHIP_MODULE,
    DEFAULT_SESSION_KEY_MANAGER_MODULE,
    ECDSAOwnershipValidationModule,
    SessionKeyManagerModule,
} from "@biconomy/modules";

import Trade from "./Trade";
import IERC20 from "../../abis/IERC20.json";
import { setSafeState } from "../../utils/helper";
import { ChainIdDetails } from "../../utils/data/network";
import { protocolNames } from "../../utils/data/protocols";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { useRefinance } from "../../hooks/Batching/useRefinance";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { useCCRefinance } from "../../hooks/Batching/useCCRefinance";
import { useEoaProvider } from "../../hooks/aaProvider/useEoaProvider";
import { useSwitchOnSpecificChain } from "../../hooks/useSwitchOnSpecificChain";
import { useBiconomyProvider } from "../../hooks/aaProvider/useBiconomyProvider";
import {
    iIndividualBatch,
    iRebalance,
    iSelectedNetwork,
    iTrading,
    useRebalanceStore,
    useTradingStore,
} from "../../store/TradingStore";
import { useBiconomyERC20Provider } from "../../hooks/aaProvider/useBiconomyERC20Provider";
import { useBiconomyGasLessProvider } from "../../hooks/aaProvider/useBiconomyGasLessProvider";
import { useBiconomySessionKeyProvider } from "../../hooks/aaProvider/useBiconomySessionKeyProvider";
import { decreasePowerByDecimals, getTokenListByChainId, incresePowerByDecimals } from "../../utils/helper";
import { getContractInstance, getErc20Balanceof, getErc20Decimals, getProvider } from "../../utils/web3Libs/ethers";
import { tRefinance, tRefinanceResponse, tTx } from "../../hooks/types";
import { ETH_ADDRESS } from "../../utils/data/constants";
bg.config({ DECIMAL_PLACES: 10 });

const TradeContainer: React.FC<any> = () => {
    const [tokenBalances, setTokenBalances] = useState<{ [key: string]: number }>({});
    const address = useAddress(); // Detect the connected address
    const signer: any = useSigner(); // Detect the connected address

    const { mutateAsync: sendToBiconomy } = useBiconomyProvider();
    const { mutateAsync: sendToGasLessBiconomy } = useBiconomyGasLessProvider();
    const { mutateAsync: sendToERC20Biconomy } = useBiconomyERC20Provider();
    const { mutateAsync: sendToSessionKeyBiconomy } = useBiconomySessionKeyProvider();

    const { mutateAsync: sendTxTrditionally } = useEoaProvider();
    const { mutateAsync: refinance } = useRefinance();
    const { mutateAsync: refinanceForCC } = useCCRefinance();
    const { mutateAsync: switchOnSpecificChain } = useSwitchOnSpecificChain();

    const {
        smartAccount,
        smartAccountAddress,
        setLoading,
        setSmartAccount,
        setSmartAccountAddress,
        setConnected,
    }: iGlobal = useGlobalStore((state) => state);

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
        setShowFromSelectionMenu,
        setShowToSelectionMenu,

        fromTokensData,
        toTokensData,
        setFromTokensData,
        setToTokensData,

        amountIn,
        setAmountIn,
        fromTokenDecimal,
        setFromTokenDecimal,
        setFilterFromToken,
        setFilterToToken,
        setFilterFromAddress,
        setFilterToAddress,
        addToBatchLoading,
        setAddToBatchLoading,
        setShowBatchList,
        showIndividualBatchList,
        setShowIndividualBatchList,
        setTxHash,
        setSendTxLoading,
        individualBatch,
        // setIndividualBatch,
        removeBatchItem,
        addBatchItem,
        setShowExecuteBatchModel,
        setHasExecutionError,
        totalfees,
        setTotalFees,
        setShowExecuteMethodModel,
    }: iTrading = useTradingStore((state) => state);

    const { isModalOpen, isRebalance, rebalanceData, removeAllData, addNewEmptyData, removeDataAtIndex }: iRebalance = useRebalanceStore(
        (state) => state
    );

    // console.log("individial", individualBatch);

    useEffect(() => {
        if (individualBatch.length === 1 && individualBatch[0].txArray.length === 0) {
            setShowBatchList(false);
        }
    }, [individualBatch]);

    const handleSelectFromNetwork = async (_fromNetwork: iSelectedNetwork) => {
        clearSelectedBatchData();
        setLoading(true);
        if (selectedFromNetwork.chainName !== _fromNetwork.chainName) {
            await switchOnSpecificChain(_fromNetwork.chainName);
            return;
            setSelectedFromNetwork(_fromNetwork);
        } else {
            setSelectedFromNetwork(_fromNetwork);
            setLoading(false);
        }
    };

    const handleSelectToNetwork = async (_toNetwork: iSelectedNetwork) => {
        try {
            setSelectedToNetwork(_toNetwork);
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
                setAmountIn("");
                setSmartAccount(null);
                setSmartAccountAddress("");
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
        async function onChangeselectedFromProtocol() {
            if (selectedFromProtocol) {
                if (selectedFromProtocol !== "erc20") {
                    setAmountIn("");
                    setFromTokenDecimal(0);

                    const firstFromToken = protocolNames[selectedFromNetwork.chainId].key.find(
                        (entry) => entry.name == selectedFromProtocol
                    )?.tokenList[0].name;

                    const provider = await getProvider(selectedFromNetwork.chainId);
                    const tokenAddress = protocolNames[selectedFromNetwork.chainId].key.find(
                        (entry) => entry.name == selectedFromProtocol
                    )?.tokenAddresses[firstFromToken];
                    const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
                    const fromTokendecimal = await getErc20Decimals(erc20);
                    setSafeState(setFromTokenDecimal, fromTokendecimal, 0);
                } else {
                    const filteredTokens = getTokenListByChainId(selectedFromNetwork.chainId, UNISWAP_TOKENS);
                    console.log('filteredTokens: ', filteredTokens)
                    const newToken: iTokenData = {
                        "chainId": Number(selectedFromNetwork.chainId),
                        "address": ETH_ADDRESS,
                        "name": selectedFromNetwork.chainId === "137" ? "MATIC" : "ETH",
                        "symbol": selectedFromNetwork.chainId === "137" ? "MATIC" : "ETH",
                        "decimals": 18,
                        "logoURI":  selectedFromNetwork.chainId === "137" ? "https://token-icons.s3.amazonaws.com/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png" : "https://token-icons.s3.amazonaws.com/eth.png"
                    };
                    const updatedTokens: iTokenData[] | undefined = [newToken, ...filteredTokens]; // Add the new token at index 0
                    setFromTokensData(updatedTokens);
                }
            }
        }
        onChangeselectedFromProtocol();
    }, [selectedFromProtocol]);

    async function onChangeselectedToProtocol(protocol: string, network: iSelectedNetwork, setTokensData: any) {
        if (protocol && protocol === "erc20") {
            const filteredTokens = getTokenListByChainId(network.chainId, UNISWAP_TOKENS);
            setTokensData(filteredTokens);
        }
    }
    useEffect(() => {
        onChangeselectedToProtocol(selectedToProtocol, selectedToNetwork, setToTokensData);
    }, [selectedToProtocol, rebalanceData, isModalOpen, isRebalance]);

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

            if (selectedFromToken === _fromToken) {
                closeFromSelectionMenu();
            } else {
                setSelectedFromToken(_fromToken);
            }

            const provider: ethers.providers.JsonRpcProvider | undefined = await getProvider(
                selectedFromNetwork.chainId
            );
            const erc20Address: any =
                selectedFromProtocol == "erc20"
                    ? fromTokensData.filter((token: any) => token.symbol === _fromToken)
                    : "";

            const tokenAddress =
                selectedFromProtocol != "erc20"
                    ? protocolNames[selectedFromNetwork.chainId].key.find((entry) => entry.name == selectedFromProtocol)
                          .tokenAddresses[_fromToken]
                    : erc20Address[0].address;

            console.log(_fromToken, tokenAddress);

            const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
            const fromTokendecimal: any = await getErc20Decimals(erc20);
            setSafeState(setFromTokenDecimal, fromTokendecimal, 0);

            let scwAddress: any;
            let biconomySmartAccount
            if (!smartAccountAddress) {
                const createAccount = async (chainId: any) => {
                    const bundler: IBundler = new Bundler({
                        bundlerUrl: ChainIdDetails[chainId].bundlerURL,
                        chainId: chainId,
                        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
                    });
                    const paymaster: IPaymaster = new BiconomyPaymaster({
                        paymasterUrl: ChainIdDetails[chainId].paymasterUrl,
                    });

                    // const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
                    //     signer: signer,
                    //     chainId: chainId,
                    //     bundler: bundler,
                    //     paymaster: paymaster,
                    // };
                    // let biconomySmartAccount = new BiconomySmartAccount(biconomySmartAccountConfig);
                    // biconomySmartAccount = await biconomySmartAccount.init();

                    const ownerShipModule: any = await ECDSAOwnershipValidationModule.create({
                        signer: signer,
                        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
                    });
                    //   setProvider(provider)
                    biconomySmartAccount = await BiconomySmartAccountV2.create({
                        chainId: chainId,
                        bundler: bundler,
                        paymaster: paymaster,
                        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
                        defaultValidationModule: ownerShipModule,
                        activeValidationModule: ownerShipModule,
                    });
                    console.log("biconomySmartAccount-1", biconomySmartAccount);
                    return biconomySmartAccount;
                };
                scwAddress = await createAccount(selectedFromNetwork.chainId);
            }

            const maxBal: BigNumber | undefined = await getErc20Balanceof(
                erc20,
                smartAccountAddress ? smartAccountAddress : scwAddress.address
            );
            if (!maxBal) return;
            const MaxBalance = await decreasePowerByDecimals(maxBal?.toString(), fromTokendecimal);
            setMaxBalance(MaxBalance);
            setIsmaxBalanceLoading(false);
        } catch (error: any) {
            setIsmaxBalanceLoading(false);
            console.log("onChangeFromToken ~ error:", error);
        }
    };

    const hasTokenBalance = (token: string) => {
        return tokenBalances[token] !== undefined && tokenBalances[token] > 0;
    };

    const setMaxTokenBalance = (token: string, amount: number, isRemove: boolean, maxbal?: number) => {
        if (isRemove) {
            setTokenBalances(prevBalances => ({
                ...prevBalances,
                [token]: (Number(maxbal) || 0) + amount,
            }));
        } else {
            setTokenBalances(prevBalances => ({
                ...prevBalances,
                [token]: (Number(maxBalance) || 0) - amount,
            }));
        }
    };

    const getTokenBalance = (token: string) => {
        return tokenBalances[token] || 0;
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
        if (selectedToToken === _toToken) {
            closeToSelectionMenu();
        } else {
            setSelectedToToken(_toToken);
        }
    };

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
        if (_amountIn) {
            setAmountIn(_amountIn);
        } else {
            setAmountIn("");
        }
    };

    const handleSwap = async () => {
        let tempFromNetwork = selectedFromNetwork;
        let tempFromProtocol = selectedFromProtocol;
        let tempFromToken = selectedFromToken;

        let tempToNetwork = selectedToNetwork;
        let tempToProtocol = selectedToProtocol;
        let tempToToken = selectedToToken;

        try {
            await handleSelectFromNetwork(tempToNetwork);
        } catch (err) {
            console.log("Swap: handleSelectFromNetwork: Error:", err);
        }
        try {
            await handleSelectToNetwork(tempFromNetwork);
        } catch (err) {
            console.log("Swap: handleSelectToNetwork: Error:", err);
        }

        try {
            await onChangeFromProtocol(tempToProtocol);
        } catch (err) {
            console.log("Swap: onChangeFromProtocol: Error:", err);
        }
        try {
            await onChangeToProtocol(tempFromProtocol);
        } catch (err) {
            console.log("Swap: onChangeToProtocol: Error:", err);
        }

        try {
            await onChangeFromToken(tempToToken);
        } catch (err) {
            console.log("Swap: onChangeFromToken: Error:", err);
        }
        try {
            await onChangeToToken(tempFromToken);
        } catch (err) {
            console.log("Swap: onChangeToToken: Error:", err);
        }
    };

    const addBatch = () => {
        addBatchItem({
            id: 0,
            txArray: [],
            data: {
                fromNetwork: "",
                toNetwork: "",
                fromChainId: "",
                toChainId: "",
                fromProtocol: "",
                toProtocol: "",
                fromToken: "",
                toToken: "",
                amountIn: "",
                fees: "",
                extraValue: "",
            },
            simulation: {
                isSuccess: false,
                isError: false,
            },
        });
    };

    const removeBatch = (index: number) => {
        removeBatchItem(index);
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

    const updateInputValues = (index: number, txArray: Array<tTx>, batchesFlow: any, data: any, simulation: any) => {
        if (txArray.length < 1) return toast.error("Please complete the last input before adding a new one.");
        const newItem: any = {
            id: index,
            txArray,
            batchesFlow,
            data: data,
            simulation,
        };

        addBatchItem(newItem);
        {
            !isRebalance && clearSelectedBatchData();
        }
        removeDataAtIndex(index)
    };

    const toggleShowBatchList = (id: number): void => {
        if (showIndividualBatchList === id) {
            setShowIndividualBatchList(null);
        } else {
            setShowIndividualBatchList(id);
        }
    };

    const sendSingleBatchToList = async (isSCW: boolean) => {
        try {
            if (isSCW) {
                setAddToBatchLoading(true);
            }
            if (selectedFromToken == selectedToToken && selectedFromNetwork.chainName === selectedToNetwork.chainName) {
                toast.error("Transaction to same protocol is not allowed");
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
            if (bg(maxBalance).isLessThan(amountIn)) {
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
            const provider: ethers.providers.JsonRpcProvider | undefined = await getProvider(
                selectedFromNetwork.chainId
            );
            const _tempAmount = BigNumber.from(await incresePowerByDecimals(amountIn, fromTokenDecimal).toString());
            let refinaceData: tRefinanceResponse | undefined;
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
                    address: isSCW ? smartAccountAddress : address,
                    provider,
                    selectedToNetwork: selectedToNetwork,
                    selectedToProtocol: selectedToProtocol,
                    selectedToToken: selectedToToken,
                    amountIn: amountIn,
                } as tRefinance);
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
                    address: isSCW ? smartAccountAddress : address,
                    provider,
                    selectedToNetwork: selectedToNetwork,
                    selectedToProtocol: selectedToProtocol,
                    selectedToToken: selectedToToken,
                    amountIn: amountIn,
                } as tRefinance);
            }

            const _amt = await decreasePowerByDecimals(_tempAmount?.toString(), fromTokenDecimal);
            if (hasTokenBalance(selectedFromToken)) {
                setMaxTokenBalance(selectedFromToken, Number(_amt), false);
            } else {
                setMaxTokenBalance(selectedFromToken, Number(_amt), false);
            }

            if (!refinaceData) {
                setAddToBatchLoading(false);
                setShowBatchList(true);
                return;
            }

            const simulation = {
                isSuccess: true,
                isError: false,
            };

            const userOp = await smartAccount.buildUserOp(refinaceData.txArray);

            const fees = bg(userOp.callGasLimit.toString())
                .plus(bg(userOp.verificationGasLimit.toString()))
                .multipliedBy(bg(userOp.maxFeePerGas.toString()))
                .dividedBy(1e18);
            let _totalfees = totalfees;

            if (refinaceData.value) {
                _totalfees = bg(_totalfees.toString())
                    .plus(fees.toString())
                    .plus(bg(refinaceData.value.toString()).dividedBy(1e18));
            } else {
                _totalfees = bg(_totalfees).plus(fees);
            }
            setTotalFees(bg(_totalfees));

            updateInputValues(
                individualBatch.length - 1,
                refinaceData.txArray.length > 0 ? refinaceData.txArray : [],
                refinaceData.batchFlow,
                {
                    fromNetwork: selectedFromNetwork.chainName,
                    toNetwork: selectedToNetwork.chainName,
                    fromChainId: selectedFromNetwork.chainId,
                    toChainId: selectedToNetwork.chainId,
                    fromProtocol: selectedFromProtocol,
                    toProtocol: selectedToProtocol,
                    fromToken: selectedFromToken,
                    toToken: selectedToToken,
                    amountIn: amountIn,
                    fees: fees.toString(),
                    extraValue: refinaceData.value ? bg(refinaceData.value.toString()).dividedBy(1e18).toString() : "0",
                },
                simulation
            );
            setAddToBatchLoading(false);
            setShowBatchList(true);
        } catch (error: any) {
            setAddToBatchLoading(false);
            setShowBatchList(true);

            if (error.message) {
                console.log("sendBatch: Error", error.message);
            } else {
                console.log("sendBatch: Eerror", error);
            }
            return;
        }
    };

    const handleExecuteMethod = async () => {
        if (!individualBatch[0].txArray.length) {
            toast.error("No Batch found for Execution");
            return;
        }
        setShowExecuteMethodModel(true);
    };

    const ExecuteAllBatches = async (isSCW: any, whichProvider: string) => {
        try {
            if (!individualBatch[0].txArray.length) {
                toast.error("No Batch found for Execution");
                return;
            }
            setShowExecuteMethodModel(false);
            setShowExecuteBatchModel(true);
            setHasExecutionError("");

            if (isSCW) {
                setSendTxLoading(true);
            } else {
                // setSendTxLoadingForEoa(true);
            }
            const mergeArray: any = [];
            await individualBatch.map((bar) => bar.txArray.map((hash) => mergeArray.push(hash)));
            let tempTxhash = "";
            if (isSCW) {
                if (whichProvider == "isAA") {
                    tempTxhash = await sendToBiconomy(mergeArray);
                } else if (whichProvider == "isERC20") {
                    tempTxhash = await sendToERC20Biconomy(mergeArray);
                }
                // tempTxhash = await sendToGasLessBiconomy(mergeArray);
                // tempTxhash = await sendToSessionKeyBiconomy(mergeArray);
            } else {
                tempTxhash = await sendTxTrditionally(mergeArray);
            }
            if (tempTxhash) {
                setTxHash(tempTxhash);
            }
            setSendTxLoading(false);
            setTotalFees(bg(0));
        } catch (error) {
            setSendTxLoading(false);
        }
    };

    const addRebalancedBatches = async (
        isSCW: boolean,
        selectedToNetwork: iSelectedNetwork,
        selectedToProtocol: string,
        selectedToToken: string,
        rePercentage: number,
        amount: number,
        index: number
    ) => {
        try {
            if (isSCW) {
                setAddToBatchLoading(true);
            }
            if (selectedFromToken == selectedToToken && selectedFromNetwork.chainName === selectedToNetwork.chainName) {
                toast.error("Transaction to same protocol is not allowed");
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
            if (bg(maxBalance).isLessThan(amount)) {
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
                toast.error("Select to protocol");
                setAddToBatchLoading(false);
                return;
            }
            if (!selectedToToken) {
                toast.error("select toToken");
                setAddToBatchLoading(false);
                return;
            }
            if (!amountIn && fromTokenDecimal) {
                toast.error("Select Token amount");
                console.log(amount, fromTokenDecimal);
                setAddToBatchLoading(false);
                return;
            }
            if (!amount && fromTokenDecimal) {
                toast.error("select amount");
                console.log(amount, fromTokenDecimal);
                setAddToBatchLoading(false);
                return;
            }
            const provider: ethers.providers.JsonRpcProvider | undefined = await getProvider(
                selectedFromNetwork.chainId
            );
            const _tempAmount = BigNumber.from(await incresePowerByDecimals(amount, fromTokenDecimal).toString());
            let refinaceData: tRefinanceResponse | undefined;
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
                    address: isSCW ? smartAccountAddress : address,
                    provider,
                    selectedToNetwork: selectedToNetwork,
                    selectedToProtocol: selectedToProtocol,
                    selectedToToken: selectedToToken,
                    amountIn: amount,
                } as tRefinance);
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
                    address: isSCW ? smartAccountAddress : address,
                    provider,
                    selectedToNetwork: selectedToNetwork,
                    selectedToProtocol: selectedToProtocol,
                    selectedToToken: selectedToToken,
                    amountIn: amount,
                } as tRefinance);
            }

            if (!refinaceData) {
                setAddToBatchLoading(false);
                setShowBatchList(true);
                return;
            }

            const simulation = {
                isSuccess: true,
                isError: false,
            };

            const userOp = await smartAccount.buildUserOp(refinaceData.txArray);

            const fees = bg(userOp.callGasLimit.toString())
                .plus(bg(userOp.verificationGasLimit.toString()))
                .multipliedBy(bg(userOp.maxFeePerGas.toString()))
                .dividedBy(1e18);
            let _totalfees = totalfees;

            if (refinaceData.value) {
                _totalfees = bg(_totalfees.toString())
                    .plus(fees.toString())
                    .plus(bg(refinaceData.value.toString()).dividedBy(1e18));
            } else {
                _totalfees = bg(_totalfees).plus(fees);
            }
            setTotalFees(bg(_totalfees));

            updateInputValues(
                individualBatch.length + index - 1,
                refinaceData.txArray.length > 0 ? refinaceData.txArray : [],
                refinaceData.batchFlow,
                {
                    fromNetwork: selectedFromNetwork.chainName,
                    toNetwork: selectedToNetwork.chainName,
                    fromChainId: selectedFromNetwork.chainId,
                    toChainId: selectedToNetwork.chainId,
                    fromProtocol: selectedFromProtocol,
                    toProtocol: selectedToProtocol,
                    fromToken: selectedFromToken,
                    toToken: selectedToToken,
                    amountIn: amount,
                    fees: fees.toString(),
                    extraValue: refinaceData.value ? bg(refinaceData.value.toString()).dividedBy(1e18).toString() : "0",
                },
                simulation
            );

            setAddToBatchLoading(false);
            setShowBatchList(true);
        } catch (error: any) {
            setAddToBatchLoading(false);
            setShowBatchList(true);

            if (error.message) {
                console.log("sendBatch: Error", error.message);
            } else {
                console.log("sendBatch: Eerror", error);
            }
            return;
        }
    };

    async function processRebalancing() {
        // Delay for 100ms to allow the first item to be processed first
        await delay(100);

        for (let i = 0; i < rebalanceData.length; i++) {
            const { network, protocol, token, percentage, amount } = rebalanceData[i];
            await addRebalancedBatches(true, network, protocol, token, percentage, amount, i);
        }

        // Clear the rebalance data
        // if(!addToBatchLoading){
        //     removeAllData();
        //     addNewEmptyData();
        //     clearSelectedBatchData();
        // }
    }

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    console.log(rebalanceData)
    return (
        <Trade
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
            handleExecuteMethod={handleExecuteMethod}
            ExecuteAllBatches={ExecuteAllBatches}
            closeFromSelectionMenu={closeFromSelectionMenu}
            closeToSelectionMenu={closeToSelectionMenu}
            totalfees={totalfees}
            processRebalancing={processRebalancing}
        />
    );
};

export default TradeContainer;
