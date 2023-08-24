import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "../store/appStore";
import { getContractInstance, getErc20Allownace, getErc20Balanceof } from "../utils/web3Libs/ethers";
import { BigNumber, ethers } from "ethers";
import { BigNumber as bg } from "bignumber.js";
import { batch, calculateFees, chooseChianId } from "../utils/helper";
import { _functionType, _nonce, gasFeesNames } from "../utils/constants";
import { parseEther } from "ethers/lib/utils";
import IERC20 from "../abis/IERC20.json";
import IStarGateRouter from "../abis/IStarGateRouter.json";
import ChainPing from "../abis/ChainPing.json";
import { toast } from "react-hot-toast";
import { useBiconomyProvider } from "./aaProvider/useBiconomyProvider";
import { useEoaProvider } from "./aaProvider/useEoaProvider";
import ChainContext from "../Context/ChainContext";
import { useContext } from "react";

export function useSendTx() {
    const {
        smartAccount,
        fromChainId,
        toChainId,
        srcPoolId,
        destPoolId,
        tokenIn,
        amountIn,
        isThisAmount,
        contractIndex,
        allNetworkData,
        currentAbi,
        currentFunc,
        params,
        simulation,
        setSendtxLoading,
        setSendtxLoadingForEoa,
        setTxHash,
        currentProvider,
    }: any = useAppStore((state) => state);

    const { selectedChain } = useContext(ChainContext);

    const { mutateAsync: sendToBiconomy } = useBiconomyProvider();
    const { mutateAsync: sendTxTrditionally } = useEoaProvider();

    async function sendTxToChain({ funcIndex, address, isSCW }) {
        try {
            console.log("sendTxToChain++++++");
            if (isSCW) {
                setSendtxLoading(true);
            } else {
                setSendtxLoadingForEoa(true);
            }
            if (!address) throw "Connect a wallet or refresh it";
            if (!smartAccount) throw "You need to login";
            if (!simulation) throw "First simulate then send Tx";
            if (contractIndex == "") throw "Enter contractIndex field";
            if (amountIn == "") throw "Enter amountIn field";
            if (isThisAmount < 0) throw "Select amount field";
            if (!allNetworkData) throw "a need to fetch";

            let _currentAddress;
            let _currentProvider;
            if (isSCW) {
                _currentAddress = smartAccount.address;
                _currentProvider = smartAccount.provider;
            } else {
                _currentAddress = address;
                _currentProvider = smartAccount.provider;
            }

            const fromStarGateRouter: any = allNetworkData.starGateRouter;
            const toUsdc = allNetworkData.tokens.usdc;
            const toChainPing = allNetworkData.chainPing;

            setTxHash("");
            const abi = ethers.utils.defaultAbiCoder;

            const USDT = await getContractInstance(tokenIn, IERC20, _currentProvider);
            if (!USDT) return;
            const balance = await getErc20Balanceof(USDT, _currentAddress);

            if (isSCW) {
                if (BigNumber.from(balance).lt(BigNumber.from(amountIn))) throw "You don't have enough balance in SCW";
            } else {
                if (BigNumber.from(balance).lt(BigNumber.from(amountIn))) throw "You don't have enough balance in EOA";
            }

            let approveTx;
            const allowance = await getErc20Allownace(USDT, _currentAddress, fromStarGateRouter);
            if (!BigNumber.from(allowance).gte(BigNumber.from(amountIn))) {
                const approveData = await USDT.populateTransaction.approve(fromStarGateRouter, amountIn);
                approveTx = { to: approveData.to, data: approveData.data };
            }
            console.log("approveTx", approveTx);

            console.log("params1", params[funcIndex]);
            const amountAfterSlippage = await calculateFees(
                address,
                amountIn,
                srcPoolId,
                destPoolId,
                toChainId,
                fromStarGateRouter,
                _currentProvider
            );
            params[funcIndex][isThisAmount] = amountAfterSlippage.toString();
            console.log("params2", params[funcIndex], currentFunc);

            let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi);
            // const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
            const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(
                currentFunc,
                params[funcIndex]
            );

            const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress;
            const extraOrShareToken = allNetworkData?.contracts[contractIndex].extraOrShareToken;
            const destChainExecTx = { to: contractAddress, data: destChainExecData };
            let data;
            if (toChainId == "106" || toChainId == "111" || toChainId == "184" || toChainId == "109") {
                data = abi.encode(
                    ["uint256", "uint256", "address", "address", "address", "bytes"],
                    [
                        BigNumber.from("0"),
                        amountAfterSlippage,
                        contractAddress,
                        address,
                        extraOrShareToken,
                        destChainExecTx.data,
                    ]
                );
            } else {
                data = abi.encode(
                    ["uint256", "uint256", "address", "address", "bytes"],
                    [BigNumber.from("0"), amountAfterSlippage, contractAddress, address, destChainExecTx.data]
                );
            }

            const srcAddress = ethers.utils.solidityPack(["address"], [_currentAddress]);
            let abiInterfaceForChainPing = new ethers.utils.Interface(ChainPing);
            const stargateParams = [fromChainId, srcAddress, _nonce, toUsdc, amountAfterSlippage, data];
            const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData("sgReceive", stargateParams);
            const erc20Interface = new ethers.utils.Interface(["function transfer(address _account, uint256 _value)"]);
            const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [
                toChainPing,
                amountAfterSlippage,
            ]);
            const gasUsed = await batch(
                toUsdc,
                toChainPing,
                dummmyTranferToCheckData,
                encodedDataForChainPing,
                false,
                chooseChianId(toChainId)
            );
            console.log("gasUsed: ", gasUsed);

            const stargateRouter = await getContractInstance(fromStarGateRouter, IStarGateRouter, _currentProvider);
            if (!stargateRouter) return;
            const lzParams = {
                dstGasForCall: BigNumber.from(gasUsed).add(BigNumber.from("30000")),
                dstNativeAmount: 0,
                dstNativeAddr: "0x",
            };
            const packedToAddress = ethers.utils.solidityPack(["address"], [toChainPing]);
            let quoteData = await stargateRouter.quoteLayerZeroFee(
                toChainId,
                _functionType,
                packedToAddress,
                data,
                lzParams
            );
            console.log("quoteData", quoteData.toString(), amountIn);
            console.log("srcPoolId-destPoolId", srcPoolId, destPoolId);

            let stargateTx = await stargateRouter.populateTransaction.swap(
                toChainId,
                srcPoolId,
                destPoolId,
                _currentAddress,
                amountIn,
                0,
                lzParams,
                packedToAddress,
                data,
                { value: quoteData[0] }
            );

            const scwOrEoaNativeBalance = await _currentProvider.getBalance(_currentAddress);
            console.log("scwOrEoaNativeBalance", scwOrEoaNativeBalance.toString(), quoteData[0].toString());
            const currentBalance = BigNumber.from(scwOrEoaNativeBalance);
            // const minimumBalanceRequired = bg(currentBalance.toString()).plus(parseEther('1').toString()).dividedBy(bg(10).pow(18)).toString()
            // console.log("minimumBalanceRequired", minimumBalanceRequired.toString())

            const minimumBalanceRequired = bg(quoteData[0].toString()).dividedBy(bg(10).pow(18)).toString();

            // Extra 1e18 should more as of now
            if (!currentBalance.gt(quoteData[0].add(parseEther("0")))) {
                throw `Not Enough Balance, You should have at least ${minimumBalanceRequired.toString()} ${
                    gasFeesNames[selectedChain]
                } in your SCW wallet`;
            }

            console.log("stargateTx", stargateTx);
            const sendTx = { to: stargateTx.to, data: stargateTx.data, value: stargateTx.value };

            if (approveTx) {
                if (isSCW) {
                    await sendToBiconomy([approveTx, sendTx]);
                } else {
                    await sendTxTrditionally([approveTx, sendTx]);
                }
            } else {
                if (isSCW) {
                    await sendToBiconomy([sendTx]);
                } else {
                    await sendTxTrditionally([sendTx]);
                }
            }
        } catch (error: any) {
            setSendtxLoading(false);
            setSendtxLoadingForEoa(false);
            console.log("sendTx-error: ", error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error(error);
            }
            return;
        }
    }
    return useMutation(sendTxToChain);
}
