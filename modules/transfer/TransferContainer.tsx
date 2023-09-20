import { useEffect, useContext } from "react";

import web3 from "web3";
import axios from "axios";
import { toast } from "react-hot-toast";
import { ethers, BigNumber } from "ethers";
import { BigNumber as bg } from "bignumber.js";

import { useSigner, useChain, useAddress } from "@thirdweb-dev/react";

import Transfer from "./Transfer";
import IERC20 from "../../abis/IERC20.json";
import { BIG_ZERO } from "../../utils/constants";
import { setSafeState } from "../../utils/helper";
import ChainContext from "../../Context/ChainContext";
import { useGlobalStore, iGlobal } from "../../store/GlobalStore";
import { useCalculateGasCost } from "../../hooks/useCalculateGasCost";
import { useTransferStore, iTransfer } from "../../store/TransferStore";
import { getErc20Decimals, getErc20Balanceof } from "../../utils/web3Libs/ethers";

bg.config({ DECIMAL_PLACES: 5 });


const TransferContainer: React.FC<any> = () => {

    const { selectedChainId } = useContext(ChainContext);

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
                const response: any = await axios.get("https://gateway.ipfs.io/ipns/tokens.uniswap.org");
                const tokensWithChain137 = response.data.tokens?.filter((token) => token.chainId.toString() === selectedChainId.toString());
                const filteredTokens = tokensWithChain137.map((token) => {
                    const { extensions, logoURI, ...filteredToken } = token;
                    return filteredToken;
                });
                setTokensData(filteredTokens);
                console.log("TRANSFER FUND :-  filteredTokens: ", filteredTokens);
            }
        }
        setTokenAddress("");
        onChangeFromProtocol();
    }, [showTransferFundToggle]);

    const onOptionChange = async (e) => {
        try {
            setGasCost(0);
            setAmountIn(0);
            setAmountInDecimals(0);
            setTokenAddress("");
            setIsnative(!isNative);
            if (isNative) {
                let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
                if (!provider) throw "no provider";
                if (!address) throw "no metamask connected";
                const _scwBalance = await provider.getBalance(smartAccount.address);
                const _eoaBalance = await provider.getBalance(address);
                setScwTokenInbalance(BigNumber.from(_scwBalance));
                setEoaTokenInbalance(BigNumber.from(_eoaBalance));
                setTokenInDecimals(18);
            } else {
                setScwTokenInbalance(BIG_ZERO);
                setEoaTokenInbalance(BIG_ZERO);
                setTokenInDecimals(0);
            }
        } catch (error) {
            console.log("send-error: ", error);
            alert("Error: " + error);
            return;
        }
    };

    const onOptionChangeForWallet = (e) => {
        setGasCost(0);
        setAmountIn(0);
        setAmountInDecimals(0);
        setTokenAddress("");
        setIsSCW(!isSCW);
    };

    const handleTokenAddress = async (_tokenAddress) => {
        try {
            console.log('_tokenAddress', _tokenAddress)
            setAmountIn(0);
            setTokenAddress(_tokenAddress);
            const contract = await getContract(_tokenAddress);

            // const provider = await getProvider(fromChainId);
            // const erc20 = await getContractInstance(token.usdc, IERC20, provider);
            const _scwBalance: BigNumber | undefined = await getErc20Balanceof(contract, smartAccount.address);
            const _eoaBalance: BigNumber | undefined = await getErc20Balanceof(contract, address);
            const decimals: number | undefined = await getErc20Decimals(contract);

            console.log("address====" + address, decimals?.toString(), decimals);
            // setTokenInDecimals(BigNumber.from(decimals)?.toNumber());
            // setScwTokenInbalance(BigNumber.from(_scwBalance));
            // setEoaTokenInbalance(BigNumber.from(_eoaBalance));

            setSafeState(setTokenInDecimals, decimals, 0);
            setSafeState(setScwTokenInbalance, BigNumber.from(_scwBalance), BIG_ZERO);
            setSafeState(setEoaTokenInbalance, BigNumber.from(_eoaBalance), BIG_ZERO);

            if (!contract) {
                alert("Not valid Token address");
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
                console.log("amountInByDecimals-native", amountInByDecimals.toString());
            } else {
                const contract = await getContract(tokenAddress);
                if (!contract) {
                    alert("Not valid token address");
                    return;
                }
                let decimal = await contract.decimals();
                let amountInByDecimals = bg(_amountIn);
                amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(decimal.toString()));
                console.log("amountInByDecimals", amountInByDecimals.toString(), _amountIn.toString());
                if (amountInByDecimals.eq(0)) {
                    setAmountIn(_amountIn);
                } else {
                    setAmountIn(amountInByDecimals.toString());
                }
                console.log("amountInByDecimals-erc20", amountInByDecimals.toString());
            }
            const gasCost: number | undefined = await calculategasCost(chain?.chainId);
            console.log("gasCost: ", gasCost?.toString());
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
        try {
            setSendtxLoading(true);
            setTxHash("");
            if (!BigNumber.from(amountIn).gt(0)) {
                alert("Enter valid Amount");
                throw "Enter valid Amount";
            }
            let tx;
            const _fromAddress = isSCW ? smartAccount.address : address;
            const _toAdress = isSCW ? address : smartAccount.address;
            if (isNative) {
                let provider = await new ethers.providers.Web3Provider(web3.givenProvider);
                if (!provider) throw "no provider";

                const balance = await provider.getBalance(_fromAddress);
                console.log("balance", balance.toString());
                if (!BigNumber.from(balance).gte(amountIn)) {
                    alert("Not native enough balance-");
                    throw "Not native enough balance";
                }
                tx = { to: _toAdress, value: amountIn, data: "0x" };
                console.log("tx", tx);
            } else {
                const contract = await getContract(tokenAddress);
                if (!contract) {
                    alert("add valid Token address first");
                    throw "add valid Token address first";
                }
                const balance = await contract.balanceOf(_fromAddress);
                if (!BigNumber.from(balance).gte(amountIn)) {
                    alert("Not erc20 enough balance");
                    throw "Not erc20 enough balance";
                }
                console.log("erc20", address, amountIn.toString());
                const data = await contract.populateTransaction.transfer(_toAdress, amountIn);
                tx = { to: tokenAddress, data: data.data };
                console.log("tx", tx);
            }

            if (isSCW) {
                console.log("biconomySmartAccount-----------2: ", smartAccount, tx);
                const userOp = await smartAccount.buildUserOp([tx]);
                userOp.paymasterAndData = "0x";
                console.log("userOp: ", userOp);

                const userOpResponse = await smartAccount.sendUserOp(userOp);
                console.log("userOp hash: ", userOpResponse);

                const txReciept = await userOpResponse.wait();
                console.log("Tx hash: ", txReciept?.receipt.transactionHash);

                // const txResponseOfBiconomyAA = await smartAccount?.sendTransactionBatch({
                //   transactions: [tx],
                // });
                // const txReciept = await txResponseOfBiconomyAA?.wait();
                // console.log("userOp hash", txResponseOfBiconomyAA?.hash);
                // console.log("Tx hash", txReciept?.transactionHash);
                setTxHash(txReciept?.receipt.transactionHash);
                setSendtxLoading(false);
                toast.success(`Tx Succefully done: ${txReciept?.receipt.transactionHash}`);
            } else {
                if (!signer) {
                    alert("Please connect wallet or refresh it!");
                }
                const txReciept = await signer.sendTransaction(tx);
                await txReciept?.wait();
                setTxHash(txReciept?.hash);
                setSendtxLoading(false);
                toast.success(`Tx Succefully done: ${txReciept?.hash}`);
            }
        } catch (error) {
            console.log("send-error: ", error);
            alert("Transaction Failed");
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
