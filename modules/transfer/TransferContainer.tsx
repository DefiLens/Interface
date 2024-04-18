import { useEffect } from "react";

import web3 from "web3";
import { toast } from "react-hot-toast";
import { BigNumber, Contract, ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";

import { useAddress, useChain, useSigner } from "@thirdweb-dev/react";

import Transfer from "./Transfer";
import IERC20 from "../../abis/IERC20.json";
import { ethereum, polygon } from "../../assets/images";
import { BIG_ZERO } from "../../utils/data/constants";
import UNISWAP_TOKENS from "../../abis/tokens/Uniswap.json";
import { incresePowerByDecimals } from "../../utils/helper";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iTransfer, useTransferStore } from "../../store/TransferStore";
import { getTokenListByChainId, setSafeState } from "../../utils/helper";
import { useCalculateGasCost } from "../../hooks/utilsHooks/useCalculateGasCost";
import { getErc20Balanceof, getErc20Decimals } from "../../utils/web3Libs/ethers";

bg.config({ DECIMAL_PLACES: 5 });

const TransferContainer: React.FC = () => {
    const { mutateAsync: calculategasCost } = useCalculateGasCost();

    const { smartAccount, smartAccountAddress, showTransferFundToggle, selectedNetwork }: iGlobal = useGlobalStore((state) => state);

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
    const signer = useSigner(); // Detect the connected address
    const chain = useChain();

    useEffect(() => {
        async function onChangeFromProtocol() {
            // if (true) {
            const filteredTokens = getTokenListByChainId(selectedNetwork.chainId, UNISWAP_TOKENS);
            if (selectedNetwork.chainId === '137') {
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
            setTokensData(filteredTokens);
        }
        // }
        setTokenAddress("");
        onChangeFromProtocol();
        // }, [showTransferFundToggle, selectedNetwork.chainId]);
    }, [selectedNetwork.chainId]);

    useEffect(() => {
        if (address && smartAccount) {
            setBalance("ethereum", "0x");
        }
    }, [address, smartAccount]);

    const onOptionChange = async (e) => {
        try {
            setGasCost(0);
            setAmountIn(0);
            setAmountInDecimals(0);
            setTokenAddress("");
            const tempChcekNative = isNative ? false : true; // because isNative can not access after just updated
            setIsnative(tempChcekNative);
            await setBalance("ethereum", "0x");
        } catch (error) {
            console.log("send-error: ", error);
            return;
        }
    };

    const setBalance = async (_tokenName, _tokenAddress) => {
        console.log("------------>>.", _tokenName, _tokenAddress)
        try {
            if (_tokenName == "ethereum") {
                let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
                if (!provider) {
                    toast.error("no provider");
                    return;
                }
                if (!address) {
                    toast.error("no metamask connected");
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
            const _scwBalance: BigNumber | undefined = await getErc20Balanceof(contract as Contract, smartAccountAddress);
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
            const _fromAddress = isSCW ? smartAccountAddress : address;
            const _toAdress = isSCW ? address : smartAccountAddress;
            if (isNative) {
                let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
                if (!provider) {
                    toast.error("no provider");
                    return;
                }

                const balance = await provider.getBalance(_fromAddress);
                if (!BigNumber.from(balance).gte(amountIn)) {
                    toast.error("Not native enough balance-");
                    return;
                }
                tx = { to: _toAdress, value: amountIn, data: "0x" };
                console.log("Native tx", tx, "isSCW", isSCW)
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
                console.log("Not native tx", tx, "isSCW", isSCW)
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
            // onOptionChange={onOptionChange}
            setBalance={setBalance}
            handleAmountIn={handleAmountIn}
            send={send}
        />
    );
};

export default TransferContainer;
