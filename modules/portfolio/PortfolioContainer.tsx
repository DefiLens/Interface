import { useEffect, useMemo } from "react";
import Portfolio from "./Portfolio";
import { usePortfolio } from "../../hooks/portfolio/usePortfolio";
import { iGlobal, useGlobalStore } from "../../store/GlobalStore";
import { iPortfolio, usePortfolioStore } from "../../store/Portfolio";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import toast from "react-hot-toast";
import { BigNumber, ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";
import web3 from "web3";
import IERC20 from "../../abis/IERC20.json";
import { incresePowerByDecimals } from "../../utils/helper";
import { ChainIdDetails, NETWORK_LIST } from "../../utils/data/network";

const PortfolioContainer: React.FC = () => {
    const { mutateAsync: fetchPortfolio } = usePortfolio();
    const { smartAccount, smartAccountAddress }: iGlobal = useGlobalStore((state) => state);
    const address = useAddress();
    const signer = useSigner();

    const {
        isSCW,
        chainId,
        chainData,
        setChainData,
        selectOneAsset,
        amountIn,
        setAmountIn,
        setAmountInDecimals,
        setSendtxLoading,
        setTxHash,
    }: iPortfolio = usePortfolioStore((state) => state);

    // To fetch portfolio
    const handleFetchPorfolioData = () => {
        const fetch = async (address: string) => {
            await fetchPortfolio(address);
        };

        if (isSCW && smartAccountAddress) {
            setChainData(null);
            // Fetch SCW Portfolio Data
            fetch(smartAccountAddress);
        }
        if (!isSCW && address) {
            setChainData(null);
            // Fetch EOA Portfolio Data
            fetch(address);
        }
    };

    // fetches user's portfolio data when onload, or either isSCW or chainId changes
    useEffect(() => {
        // if (chainData == null) {
        handleFetchPorfolioData();
        // }
    }, [isSCW, chainId]);

    const isNative = useMemo((): boolean => {
        if (selectOneAsset !== null) {
            const oneAssetTokenSymbol = selectOneAsset?.attributes.fungible_info.symbol;
            const chainName = selectOneAsset?.relationships.chain.data.id;
            const chainId = NETWORK_LIST.find((network) => chainName === network.chainName)?.chainId;
            console.log("chainId", chainId);
            return oneAssetTokenSymbol?.toLowerCase() === ChainIdDetails[chainId as string].gasFeesName.toLowerCase();
        }
        return false;
    }, [selectOneAsset]);

    // To migrate assets
    const handleAmountIn = async (_amountIn) => {
        try {
            setAmountInDecimals(_amountIn);
            // if (selectOneAsset?.native_token)
            if (isNative) {
                let amountInByDecimals = bg(await incresePowerByDecimals(_amountIn, 18));
                console.log("amountInByDecimals", amountInByDecimals.toString());
                if (amountInByDecimals.eq(0)) {
                    setAmountIn(_amountIn);
                } else {
                    setAmountIn(amountInByDecimals.toString());
                }
            } else {
                const contractAddress = selectOneAsset?.attributes.fungible_info.implementations.find(
                    (tokenImp) => tokenImp.chain_id === selectOneAsset?.relationships.chain.data.id
                )?.address;
                const contract = await getContract(contractAddress);
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
        if (selectOneAsset == null) {
            toast.error("Select One Token");
            return;
        }
        // console.log(amountIn);
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
                console.log("balance checking____))))))", balance);
                if (!BigNumber.from(balance).gte(amountIn)) {
                    toast.error("Not native enough balance-");
                    return;
                }
                tx = { to: _toAdress, value: amountIn, data: "0x" };
                console.log("Native token tx", tx, "isSCW", isSCW);
            } else {
                // Token Contract Address
                const contractAddress = selectOneAsset?.attributes.fungible_info.implementations.find(
                    (tokenImp) => tokenImp.chain_id === selectOneAsset?.relationships.chain.data.id
                )?.address;
                const contract = await getContract(contractAddress);
                if (!contract) {
                    toast.error("add valid Token address first");
                    return;
                }
                const balance = await contract.balanceOf(_fromAddress);
                // console.log({
                //     balance,
                //     amountIn,
                //     isNative,
                //     contractAddress,
                // });
                if (!BigNumber.from(balance).gte(amountIn)) {
                    toast.error("Not erc20 enough balance");
                    return;
                }
                const data = await contract.populateTransaction.transfer(_toAdress, amountIn);
                tx = { to: contractAddress, data: data.data };
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
        } finally {
            setSendtxLoading(false);
        }
    };

    return (
        <Portfolio
            smartAccountAddress={smartAccountAddress}
            handleFetchPorfolioData={handleFetchPorfolioData}
            send={send}
            handleAmountIn={handleAmountIn}
        />
    );
};
export default PortfolioContainer;
