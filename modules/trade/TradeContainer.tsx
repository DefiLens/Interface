import { useEffect, useState } from "react";

import { ethers } from "ethers";
import { BigNumber } from "ethers";
import { toast } from "react-hot-toast";
import { BigNumber as bg } from "bignumber.js";

import { defaultAbiCoder } from "ethers/lib/utils";
import { Bundler, IBundler } from "@biconomy/bundler";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { BiconomyPaymaster, IPaymaster } from "@biconomy/paymaster";
import { BiconomySmartAccountConfig, BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
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
import { iSelectedNetwork, iTrading, useTradingStore } from "../../store/TradingStore";
import { useBiconomyERC20Provider } from "../../hooks/aaProvider/useBiconomyERC20Provider";
import { useBiconomyGasLessProvider } from "../../hooks/aaProvider/useBiconomyGasLessProvider";
import { useBiconomySessionKeyProvider } from "../../hooks/aaProvider/useBiconomySessionKeyProvider";
import { decreasePowerByDecimals, getTokenListByChainId, incresePowerByDecimals } from "../../utils/helper";
import { getContractInstance, getErc20Balanceof, getErc20Decimals, getProvider } from "../../utils/web3Libs/ethers";

bg.config({ DECIMAL_PLACES: 10 });

const TradeContainer: React.FC<any> = () => {
    const address = useAddress(); // Detect the connected address
    const signer: any = useSigner(); // Detect the connected address

    const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
    const [totalfees, setTotalFees] = useState<bg>(bg(0));

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
        tokensData,
        setTokensData,
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
        setIndividualBatch,
        setShowExecuteBatchModel,
        setHasExecutionError,
        setShowExecuteMethodModel,
    }: iTrading = useTradingStore((state) => state);

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
            setSelectedFromNetwork(_fromNetwork);
        }
        setSelectedFromNetwork(_fromNetwork);
        setLoading(false);
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
                    ).tokenList[0].name;

                    const provider = await getProvider(selectedFromNetwork.chainId);
                    const tokenAddress = protocolNames[selectedFromNetwork.chainId].key.find(
                        (entry) => entry.name == selectedFromProtocol
                    ).tokenAddresses[firstFromToken];
                    const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
                    const fromTokendecimal = await getErc20Decimals(erc20);
                    setSafeState(setFromTokenDecimal, fromTokendecimal, 0);
                } else {
                    const filteredTokens = getTokenListByChainId(selectedFromNetwork.chainId, UNISWAP_TOKENS);
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
                    const filteredTokens = getTokenListByChainId(selectedToNetwork.chainId, UNISWAP_TOKENS);
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

            if (selectedFromToken === _fromToken) {
                closeFromSelectionMenu();
            } else {
                setSelectedFromToken(_fromToken);
            }

            const provider = await getProvider(selectedFromNetwork.chainId);

            const erc20Address: any =
                selectedFromProtocol == "erc20" ? tokensData.filter((token: any) => token.symbol === _fromToken) : "";
            const tokenAddress =
                selectedFromProtocol != "erc20"
                    ? protocolNames[selectedFromNetwork.chainId].key.find((entry) => entry.name == selectedFromProtocol)
                          .tokenAddresses[_fromToken]
                    : erc20Address[0].address;
            const erc20 = await getContractInstance(tokenAddress, IERC20, provider);
            const fromTokendecimal: any = await getErc20Decimals(erc20);
            setSafeState(setFromTokenDecimal, fromTokendecimal, 0);

            let scwAddress: any;
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
                    let biconomySmartAccount = await BiconomySmartAccountV2.create({
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

            const maxBal: any = await getErc20Balanceof(
                erc20,
                smartAccountAddress ? smartAccountAddress : scwAddress.address
            );
            const MaxBalance = await decreasePowerByDecimals(maxBal?.toString(), fromTokendecimal);
            setMaxBalance(MaxBalance);
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
        if (selectedToToken === _toToken) {
            closeToSelectionMenu();
        } else {
            setSelectedToToken(_toToken);
        }
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
        setIndividualBatch([
            {
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
            setTotalFees(bg(0));
            setIndividualBatch([
                ...individualBatch,
                {
                    id: 0,
                    txArray: [],
                    batchesFlow: [],
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
            const provider = await getProvider(selectedFromNetwork.chainId);
            const _tempAmount = BigNumber.from(await incresePowerByDecimals(amountIn, fromTokenDecimal).toString());
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
                    address: isSCW ? smartAccountAddress : address,
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
                    address: isSCW ? smartAccountAddress : address,
                    provider,
                });
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
            const bundler: IBundler = new Bundler({
                bundlerUrl: ChainIdDetails[selectedFromNetwork.chainId].bundlerURL,
                chainId: BigNumber.from(selectedFromNetwork.chainId).toNumber(),
                entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
            });
            const data = await bundler.estimateUserOpGas(userOp);
            console.log("data: ", data, refinaceData);
            const fees = bg(data.callGasLimit)
                .plus(bg(data.verificationGasLimit))
                .multipliedBy(bg(data.maxFeePerGas))
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
                refinaceData.txArray.length > 0 && refinaceData.txArray,
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
                    extraValue: bg(refinaceData.value.toString()).dividedBy(1e18).toString(),
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
        />
    );
};

export default TradeContainer;
