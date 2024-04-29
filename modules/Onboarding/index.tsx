// Library Imports
import { useEffect } from "react";
import { useAddress, useChain, useSigner } from "@thirdweb-dev/react";
import web3 from "web3";
import toast from "react-hot-toast";
import { BigNumber, Contract, ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";
// Type, Helper, Component Imports
import Onboarding from "./Onboarding";
import { useCalculateGasCost } from "../../hooks/utilsHooks/useCalculateGasCost";
import IERC20 from "../../abis/IERC20.json";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTransfer, useTransferStore } from "../../store/TransferStore";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { ethereum, polygon } from "../../assets/images";
import { iTokenInfo } from "../trade/types";
import { getTokenListByChainId, incresePowerByDecimals, setSafeState } from "../../utils/helper";
import { getErc20Balanceof, getErc20Decimals } from "../../utils/web3Libs/ethers";
import { BIG_ZERO } from "../../utils/data/constants";
import { walletInfo } from "../../utils/constants";

bg.config({ DECIMAL_PLACES: 5 });

const OnboardingPage = () => {
    const { smartAccount, smartAccountAddress, selectedNetwork }: iGlobal = useGlobalStore((state) => state);
    const signer = useSigner(); // Detect the connected address
    const address = useAddress(); // Detect the connected address
    const chain = useChain();

    // Filter out USDC Token of supported Networks
    const {
        tokenAddress,
        setTokenAddress,
        amountIn,
        setAmountIn,
        setAmountInDecimals,
        isNative,
        setIsnative,
        isSCW,
        setSendtxLoading,
        setTxHash,
        setTokensData,
        setScwTokenInbalance,
        setEoaTokenInbalance,
        setTokenInDecimals,
        setGasCost,
    }: iTransfer = useTransferStore((state) => state);

    const usdcOnNetwork = (filteredTokens: iTokenInfo[]) => {
        const chainId = selectedNetwork.chainId;
        const usdcSymbol = {
            "137": "USDC",
            "42161": "USDC",
            "8453": "USDbC",
            "10": "USDC",
        };
        const filtered = filteredTokens.filter((token) => {
            if (token.symbol === usdcSymbol[chainId]) {
                return token;
            }
        });
        console.log("filtered", filtered);
        return filtered;
    };

    const { mutateAsync: calculategasCost } = useCalculateGasCost();

    const setBalance = async (_tokenName, _tokenAddress) => {
        console.log("------------>>.", _tokenName, _tokenAddress);
        try {
            if (_tokenName == "ethereum") {
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
                const _scwBalance = await smartAccount.provider.getBalance(smartAccountAddress);
                setScwTokenInbalance(BigNumber.from(_scwBalance));
                setEoaTokenInbalance(BigNumber.from(_eoaBalance));
                setTokenInDecimals(18);
                setIsnative(true);
            } else {
                setIsnative(false);
                await handleTokenAddress(_tokenName, _tokenAddress);
            }
        } catch (error) {
            console.log("setBalance-error: ", error);
            toast.error("Error: " + error);
            return;
        }
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
            console.log("handleTokenAddress-error", error);
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
            console.log("handleAmountIn-error: ", error);
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
            console.log("getContract-error", error);
        }
    };

    const send = async () => {
        if (amountIn == "") {
            toast.error("Please Enter Amount");
            return;
        }
        try {
            setSendtxLoading(true);
            setTxHash("");
            if (!BigNumber.from(amountIn).gt(0)) {
                toast.error("Enter valid Amount");
                return;
            }
            let tx;
            const _fromAddress = address;
            const _toAdress = smartAccountAddress;
            if (isNative) {
                let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
                if (!provider) {
                    toast.error("no provider");
                    return;
                }

                const balance = await provider.getBalance(_fromAddress ?? "");
                if (!BigNumber.from(balance).gte(amountIn)) {
                    toast.error("Not native enough balance-");
                    return;
                }
                tx = { to: _toAdress, value: amountIn, data: "0x" };
                console.log("Native tx", tx, "isSCW", isSCW);
            } else {
                const contract = await getContract(tokenAddress);
                if (!contract) {
                    toast.error("add valid Token address first");
                    return;
                }
                const balance = await contract.balanceOf(_fromAddress);
                if (!BigNumber.from(balance).gte(amountIn)) {
                    toast.error("Not erc20 enough balance");
                    return;
                }
                const data = await contract.populateTransaction.transfer(_toAdress, amountIn);
                tx = { to: tokenAddress, data: data.data };
                console.log("Not native tx", tx, "isSCW", isSCW);
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
                toast.success(`Tx Succefully done: ${txReciept?.receipt.transactionHash}`);
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
                toast.success(`Tx Succefully done: ${txReciept?.hash}`);
            }
        } catch (error) {
            console.log("send-error: ", error);
            toast.error("Transaction Failed");
            setAmountIn(0);
            setAmountInDecimals(0);
            setSendtxLoading(false);
            return;
        }
    };

    useEffect(() => {
        async function onChangeFromProtocol() {
            // if (true) {
            const filteredTokens = getTokenListByChainId(selectedNetwork.chainId, UNISWAP_TOKENS);
            if (selectedNetwork.chainId === "137") {
                filteredTokens.unshift({
                    chainId: 137,
                    address: "0x0000000000000000000000000000000000001010",
                    name: "Matic",
                    symbol: "MATIC",
                    decimals: 18,
                    logoURI: polygon,
                });
            } else {
                filteredTokens.unshift({
                    chainId: 1,
                    address: "",
                    name: "ethereum",
                    symbol: "Ethereum",
                    decimals: 18,
                    logoURI: ethereum,
                });
            }
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

    return (
        <Onboarding
            setBalance={setBalance}
            handleAmountIn={handleAmountIn}
            send={send}
        />
    );
};

export default OnboardingPage;
