import { useContext, useEffect } from "react";

import web3 from "web3";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BigNumber, ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";

import { useAddress, useChain, useSigner } from "@thirdweb-dev/react";

import Transfer from "./Transfer";
import IERC20 from "../../abis/IERC20.json";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { BIG_ZERO } from "../../utils/constants";
import { getTokenListByChainId, setSafeState } from "../../utils/helper";
import ChainContext from "../../Context/ChainContext";
import { iTrade, useTradeStore } from "../../store/TradeStore";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { useCalculateGasCost } from "../../hooks/useCalculateGasCost";
import { iTransfer, useTransferStore } from "../../store/TransferStore";
import { getErc20Balanceof, getErc20Decimals } from "../../utils/web3Libs/ethers";
import { ethereum } from "../../assets/images";

bg.config({ DECIMAL_PLACES: 5 });


const TransferContainer: React.FC<any> = () => {

    // const { selectedChainId } = useContext(ChainContext);

    const { selectedFromNetwork }: iTrade = useTradeStore((state) => state);

    const { mutateAsync: calculategasCost } = useCalculateGasCost();

    const {
        smartAccount,
        showTransferFundToggle
    }: iGlobal = useGlobalStore((state) => state);

    const {
        tokenAddress,
        setTokenAddress,
        amountIn,
        setAmountIn,
        amountInDecimals,
        setAmountInDecimals,
        isNative,
        setIsnative,
        isSCW,
        setIsSCW,
        sendTxLoading,
        setSendtxLoading,
        txhash,
        setTxHash,
        tokensData,
        setTokensData,
        scwBalance,
        setScwTokenInbalance,
        eoaBalance,
        setEoaTokenInbalance,
        tokenInDecimals,
        setTokenInDecimals,
        gasCost,
        setGasCost,
    }: iTransfer = useTransferStore((state) => state);

    const address = useAddress(); // Detect the connected address
    const signer: any = useSigner(); // Detect the connected address
    const chain = useChain();

    useEffect(() => {
        async function onChangeFromProtocol() {
            if (showTransferFundToggle) {
                const filteredTokens = getTokenListByChainId(selectedFromNetwork.chainId, UNISWAP_TOKENS);
                filteredTokens.unshift({
                    "chainId": 1,
                    "address": "",
                    "name": "ethereum",
                    "symbol": "Ethereum",
                    "decimals": 18,
                    "logoURI": ethereum,
                })
                setTokensData(filteredTokens);
            }
        }
        setTokenAddress("");
        onChangeFromProtocol();
    }, [showTransferFundToggle]);

    useEffect(() => {
        if (address && smartAccount) {
            setBalance(true)
        }
    }, [address, smartAccount])

    const onOptionChange = async (e) => {
        try {
            setGasCost(0);
            setAmountIn(0);
            setAmountInDecimals(0);
            setTokenAddress("");
            const tempChcekNative = isNative ? false : true; // because isNative can not access after just updated
            setIsnative(tempChcekNative);
            await setBalance(tempChcekNative)
        } catch (error) {
            console.log("send-error: ", error);
            return;
        }
    };

    const setBalance = async (_isNative) => {
        try {
            if (_isNative) {
                let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
                if (!provider) {
                    toast.error("no provider");
                    return;
                };
                if (!address) {
                    toast.error("no metamask connected");
                    return;
                };
                const _scwBalance = await provider.getBalance(smartAccount.address);
                const _eoaBalance = await provider.getBalance(address);
                setScwTokenInbalance(BigNumber.from(_scwBalance));
                setEoaTokenInbalance(BigNumber.from(_eoaBalance));
                setTokenInDecimals(18);
            } else {
                // setScwTokenInbalance(BIG_ZERO);
                // setEoaTokenInbalance(BIG_ZERO);
                // setTokenInDecimals(0);
                // await handleTokenAddress(_tokenAddress)
            }
        } catch (error) {
            console.log("setBalance-error: ", error);
            toast.error("Error: " + error);
            return;
        }
    }

    const onOptionChangeForWallet = () => {
        setGasCost(0);
        setAmountIn(0);
        setAmountInDecimals(0);
        setTokenAddress("");
        setIsSCW(!isSCW);
    };

    const handleTokenAddress = async (_tokenAddress) => {
        try {
            setAmountIn(0);
            setTokenAddress(_tokenAddress);
            const contract = await getContract(_tokenAddress);

            // const provider = await getProvider(fromChainId);
            // const erc20 = await getContractInstance(token.usdc, IERC20, provider);
            const _scwBalance: BigNumber | undefined = await getErc20Balanceof(contract, smartAccount.address);
            const _eoaBalance: BigNumber | undefined = await getErc20Balanceof(contract, address);
            const decimals: number | undefined = await getErc20Decimals(contract);

            // setTokenInDecimals(BigNumber.from(decimals)?.toNumber());
            // setScwTokenInbalance(BigNumber.from(_scwBalance));
            // setEoaTokenInbalance(BigNumber.from(_eoaBalance));

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
                let amountInByDecimals = bg(_amountIn);
                amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(18));
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
                let amountInByDecimals = bg(_amountIn);
                amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(decimal.toString()));
                if (amountInByDecimals.eq(0)) {
                    setAmountIn(_amountIn);
                } else {
                    setAmountIn(amountInByDecimals.toString());
                }
            }
            const gasCost: number | undefined = await calculategasCost(chain?.chainId);
            setGasCost(gasCost!);
        } catch (error) {
            console.log("handleAmountIn-error: ", error)
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
        };
        try {
            setSendtxLoading(true);
            setTxHash("");
            if (!BigNumber.from(amountIn).gt(0)) {
                toast.error("Enter valid Amount");
                return;
            };
            let tx;
            const _fromAddress = isSCW ? smartAccount.address : address;
            const _toAdress = isSCW ? address : smartAccount.address;
            if (isNative) {
                let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
                if (!provider) {
                    toast.error("no provider");
                    return;
                };

                const balance = await provider.getBalance(_fromAddress);
                if (!BigNumber.from(balance).gte(amountIn)) {
                    toast.error("Not native enough balance-");
                    return;
                }
                tx = { to: _toAdress, value: amountIn, data: "0x" };
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
            }

            if (isSCW) {
                const userOp = await smartAccount.buildUserOp([tx]);
                userOp.paymasterAndData = "0x";

                const userOpResponse = await smartAccount.sendUserOp(userOp);

                const txReciept = await userOpResponse.wait();

                // const txResponseOfBiconomyAA = await smartAccount?.sendTransactionBatch({
                //   transactions: [tx],
                // });
                // const txReciept = await txResponseOfBiconomyAA?.wait();
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
    const copyToClipboard = (id: any) => {
        navigator.clipboard.writeText(id);
        // Alert the copied text
        toast.success("Transaction Hash Copied");
    };

    return (
        <Transfer
            onOptionChangeForWallet={onOptionChangeForWallet}
            onOptionChange={onOptionChange}
            handleTokenAddress={handleTokenAddress}
            handleAmountIn={handleAmountIn}
            send={send}
        />
    );
};

export default TransferContainer;
