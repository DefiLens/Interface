import { BigNumber, ethers } from "ethers";
import toast from "react-hot-toast";
import web3 from "web3";
import IERC20 from "../../abis/IERC20.json";
import { useSigner } from "@thirdweb-dev/react";
import { incresePowerByDecimals } from "../../utils/helper";
import { useCalculateGasCost } from "../../hooks/utilsHooks/useCalculateGasCost";

const isSCW = false;

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

const send = async (
    amountIn: string,
    address: string,
    isNative: boolean,
    tokenAddress: string,
    signer: any, // Update with the correct type
    smartAccount: any, // Update with the correct type
    smartAccountAddress: string,
    setAmountIn: (amount: string) => void,
    setAmountInDecimals: (decimals: number) => void,
    setSendtxLoading: (loading: boolean) => void,
    setTxHash: (hash: string) => void
) => {
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

            // const txResponseOfBiconomyAA = await smartAccount?.sendTransactionBatch({
            //   transactions: [tx],
            // });
            // const txReciept = await txResponseOfBiconomyAA?.wait();
            setTxHash(txReciept?.receipt.transactionHash);
            setAmountIn("0");
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
            setAmountIn("0");
            setAmountInDecimals(0);
            setSendtxLoading(false);
            toast.success(`Tx Succefully done: ${txReciept?.hash}`);
        }
    } catch (error) {
        console.log("send-error: ", error);
        toast.error("Transaction Failed");
        setAmountIn("0");
        setAmountInDecimals(0);
        setSendtxLoading(false);
        return;
    }
};

const handleAmountIn = async (
    _amountIn,
    setAmountIn,
    setAmountInDecimals,
    isNative,
    chain,
    tokenAddress,
    setGasCost,
    bg
) => {
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
        const gasCost: number | undefined = await useCalculateGasCost();
        setGasCost(gasCost!);
    } catch (error) {
        console.log("handleAmountIn-error: ", error);
    }
};

const setBalance = async (
    _tokenName,
    _tokenAddress,
    address,
    smartAccount,
    smartAccountAddress,
    setScwTokenInbalance,
    setEoaTokenInbalance,
    setTokenInDecimals,
    setIsnative,
    handleTokenAddress
) => {
    console.log("------------>>.", _tokenName, _tokenAddress);
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

export { send, handleAmountIn, setBalance };
