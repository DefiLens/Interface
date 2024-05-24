import { useEffect, useState } from "react";

import web3 from "web3";
import { toast } from "react-hot-toast";
import { BigNumber, Contract, ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";
import { useAddress, useChain, useSigner } from "@thirdweb-dev/react";
// Type, Helper, Component Imports
import Transfer from "./Transfer";
import IERC20 from "../../abis/IERC20.json";
import { ethereum, polygon } from "../../assets/images";
import { BIG_ZERO } from "../../utils/data/constants";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { getScwBalance, decreasePowerByDecimals, incresePowerByDecimals } from "../../utils/helper";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTransfer, useTransferStore } from "../../store/TransferStore";
import { getTokenListByChainId, setSafeState } from "../../utils/helper";
import { useCalculateGasCost } from "../../hooks/utilsHooks/useCalculateGasCost";
import { getErc20Balanceof, getErc20Decimals } from "../../utils/web3Libs/ethers";
import { walletInfo } from "../../utils/constants";
import { saveMigrateTxnHistory } from "../../utils/globalApis/trackingApi";

bg.config({ DECIMAL_PLACES: 5 });

const TransferContainer: React.FC = () => {
    const { mutateAsync: calculategasCost } = useCalculateGasCost();

    const { smartAccount, smartAccountAddress, showTransferFundToggle, selectedNetwork, isSimulate }: iGlobal =
        useGlobalStore((state) => state);

    const {
        tokensData,
        tokenAddress,
        setTokenAddress,
        amountIn,
        setAmountIn,
        setAmountInDecimals,
        isNative,
        setIsnative,
        isSCW,
        setIsSCW,
        setSendtxLoading,
        setTxHash,
        setTokensData,
        setScwTokenInbalance,
        setEoaTokenInbalance,
        setTokenInDecimals,
        setGasCost,
        selectedToken,
        showSuccessModal,
        setSelectedToken,
        setShowSuccessModal,
    }: iTransfer = useTransferStore((state) => state);

    const address = useAddress();
    const signer = useSigner();
    const chain = useChain();

    const usdcOnNetwork = (filteredTokens: any) => {
        const chainId = selectedNetwork.chainId;
        const usdcSymbol = {
            "137": ["USDC", "MATIC"],
            "42161": ["USDC", "Ethereum"],
            "8453": ["USDbC", "Ethereum"],
            "10": ["USDC", "Ethereum"],
        };
    
        // Get the USDC symbols for the current chainId
        const usdcSymbolsForChain = usdcSymbol[chainId];
    
        // Filter tokens with matching symbols for the current chainId
        const filtered = filteredTokens.filter((token) => {
            return usdcSymbolsForChain?.includes(token.symbol);
        });
    
        // Specifically remove the token with the name "Matic" for chainId "137"
        if (chainId === "137") {
            return filtered.filter((token) => token.name !== "Matic");
        }
    
        // Return the filtered tokens
        return filtered;
    };
    

    useEffect(() => {
        async function onChangeFromProtocol() {
            const filteredTokens = getTokenListByChainId(selectedNetwork.chainId, UNISWAP_TOKENS);
            filteredTokens.unshift({
                chainId: parseInt(selectedNetwork.chainId),
                address: "0x0000000000000000000000000000000000000000",
                name: selectedNetwork.chainId === "137" ? "Matic" : "ethereum",
                symbol: selectedNetwork.chainId === "137" ? "MATIC" : "Ethereum",
                decimals: 18,
                logoURI: selectedNetwork.chainId === "137" ? polygon : ethereum,
            });
            setTokensData(usdcOnNetwork(filteredTokens));
        }
        setTokenAddress("");
        onChangeFromProtocol();
    }, [selectedNetwork.chainId]);

    useEffect(() => {
        if (address && smartAccount) {
            setBalance("ethereum", "0x");
        }
    }, [address, smartAccount]);

    const setBalance = async (_tokenName, _tokenAddress) => {
        try {
            if (_tokenName == "ethereum" || _tokenName == "Matic") {
                let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
                if (!provider) {
                    toast.error("no provider");
                    return;
                }
                if (!address) {
                    toast.error(`${walletInfo.error.notConnected}`);
                    return;
                }
                const _eoaBalance = await provider.getBalance(address);
                const _scwBalance = await provider.getBalance(smartAccountAddress);
                // let _scwBalance = await getScwBalance(isSimulate, smartAccount, smartAccountAddress)
                setScwTokenInbalance(BigNumber.from(_scwBalance));
                setEoaTokenInbalance(BigNumber.from(_eoaBalance));
                setTokenInDecimals(18);
                setIsnative(true);
            } else {
                setIsnative(false);
                await handleTokenAddress(_tokenName, _tokenAddress);
            }
        } catch (error) {
            // console.log("setBalance-error: ", error);
            toast.error("Error: " + error);
            return;
        }
    };

    const onOptionChangeForWallet = () => {
        setGasCost(0);
        setAmountIn(0);
        setAmountInDecimals(0);
        setTokenAddress("");
        setIsSCW(!isSCW);
    };

    const handleTokenAddress = async (_tokenName, _tokenAddress) => {
        try {
            setAmountIn(0);
            setTokenAddress(_tokenAddress);
            const contract = await getContract(_tokenAddress);
            const _scwBalance: BigNumber | undefined = await getErc20Balanceof(
                contract as Contract,
                smartAccountAddress
            );
            const _eoaBalance: BigNumber | undefined = await getErc20Balanceof(contract as Contract, address ?? "");
            const decimals: number | undefined = await getErc20Decimals(contract);
            setSafeState(setTokenInDecimals, decimals, 0);
            setSafeState(setScwTokenInbalance, BigNumber.from(_scwBalance), BIG_ZERO);
            setSafeState(setEoaTokenInbalance, BigNumber.from(_eoaBalance), BIG_ZERO);
            if (!contract) {
                toast.error("Not valid Token address");
            }
        } catch (error) {
            // console.log("handleTokenAddress-error", error);
        }
    };

    const handleAmountIn = async (_amountIn) => {
        try {
            setAmountInDecimals(_amountIn);
            if (isNative) {
                let amountInByDecimals = bg(await incresePowerByDecimals(_amountIn, 18));
                if (amountInByDecimals.eq(0)) {
                    setAmountIn(_amountIn);
                } else {
                    setAmountIn(amountInByDecimals.toString());
                }
            } else {
                const contract = await getContract(tokenAddress);
                if (!contract) {
                    toast.error("Not valid token address");
                    return;
                }
                let decimal = await contract.decimals();
                let amountInByDecimals = bg(await incresePowerByDecimals(_amountIn, decimal.toString()));
                if (amountInByDecimals.eq(0)) {
                    setAmountIn(_amountIn);
                } else {
                    setAmountIn(amountInByDecimals.toString());
                }
            }
            const gasCost: number | undefined = await calculategasCost(chain?.chainId);
            setGasCost(gasCost!);
        } catch (error) {
            // console.log("handleAmountIn-error: ", error);
        }
    };

    const getContract = async (_tokenAddress) => {
        try {
            let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
            if (!provider) return;
            const signer = await provider.getSigner();
            if (!signer) return;
            const contract = await new ethers.Contract(_tokenAddress, IERC20, signer);
            return contract;
        } catch (error) {
            // console.log("getContract-error", error);
        }
    };

    const send = async () => {
        if (amountIn == "") {
            toast.error("Please Enter Amount");
            return;
        }
        try {
            const decimalAmount = await decreasePowerByDecimals(amountIn, selectedToken.decimals);
            setSendtxLoading(true);
            setTxHash("");
            if (!BigNumber.from(amountIn).gt(0)) {
                toast.error("Enter valid Amount");
                return;
            }
            let tx;
            const _fromAddress = isSCW ? smartAccountAddress : address;
            const _toAdress = isSCW ? address : smartAccountAddress;

            if (isNative) {
                let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
                if (!provider) {
                    toast.error("no provider");
                    return;
                }

                const balance = await provider.getBalance(_fromAddress);
                // let balance = await getScwBalance(isSimulate, smartAccount, _fromAddress)
                if (!BigNumber.from(balance).gte(amountIn)) {
                    toast.error("Not enough balance");
                    return;
                }
                tx = { to: _toAdress, value: amountIn, data: "0x" };
                // console.log("Native tx", tx, "isSCW", isSCW);
            } else {
                const contract = await getContract(tokenAddress);
                if (!contract) {
                    toast.error("Add valid Token address first");
                    return;
                }
                const balance = await contract.balanceOf(_fromAddress);
                if (!BigNumber.from(balance).gte(amountIn)) {
                    toast.error("Not enough balance");
                    return;
                }
                const data = await contract.populateTransaction.transfer(_toAdress, amountIn);
                tx = { to: tokenAddress, data: data.data };
                // console.log("Not native tx", tx, "isSCW", isSCW);
            }

            if (isSCW) {
                const userOp = await smartAccount.buildUserOp([tx]);
                userOp.paymasterAndData = "0x";
                const userOpResponse = await smartAccount.sendUserOp(userOp);
                const txReciept = await userOpResponse.wait();

                setTxHash(txReciept?.receipt.transactionHash);
                setAmountIn(0);
                setAmountInDecimals(0);
                setSendtxLoading(false);
                toast.success(`Tx Succefully done`);
                setShowSuccessModal(true);
                saveMigrateTxnHistory(
                    smartAccountAddress,
                    address,
                    selectedToken?.symbol,
                    chain?.chain.toLowerCase(),
                    decimalAmount,
                    txReciept?.receipt.transactionHash,
                    isSCW ? "SCW_TO_EOA" : "EOA_TO_SCW",
                    "TRANSFER_FUND"
                );
            } else {
                if (!signer) {
                    toast.error("Please connect wallet or refresh it!");
                    return;
                }
                const txReciept = await signer.sendTransaction(tx);
                await txReciept?.wait();
                setTxHash(txReciept?.hash);
                setAmountIn(0);
                setAmountInDecimals(0);
                setSendtxLoading(false);
                // toast.success(`Tx Succefully done: ${txReciept?.hash.slice(0, 50)}`);
                toast.success(`Tx Succefully done`);
                setShowSuccessModal(true);

                saveMigrateTxnHistory(
                    smartAccountAddress,
                    address,
                    selectedToken?.symbol,
                    chain?.chain.toLowerCase(),
                    decimalAmount,
                    txReciept?.hash,
                    isSCW ? "SCW_TO_EOA" : "EOA_TO_SCW",
                    "TRANSFER_FUND"
                );
            }
        } catch (error) {
            toast.error("Transaction Failed");
            setAmountIn(0);
            setAmountInDecimals(0);
            setSendtxLoading(false);
            return;
        }
    };

    return (
        <Transfer
            onOptionChangeForWallet={onOptionChangeForWallet}
            setBalance={setBalance}
            handleAmountIn={handleAmountIn}
            send={send}
        />
    );
};

export default TransferContainer;
