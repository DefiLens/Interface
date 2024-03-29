// import { toast } from "react-hot-toast";
// import { BigNumber, ethers } from "ethers";
// import { BigNumber as bg } from "bignumber.js";

// import { useMutation } from "@tanstack/react-query";

// import IERC20 from "../abis/IERC20.json";
// import ChainPing from "../abis/ChainPing.json";
// import IStarGateRouter from "../abis/IStarGateRouter.json";
// import { useCalculateGasCost } from "./utilsHooks/useCalculateGasCost";
// import { iGlobal, useGlobalStore } from "../store/GlobalStore";
// import { findGasUsedBySimulation, calculateFees, chooseChianId } from "../utils/helper";
// import { _functionType, _nonce } from "../utils/constants";
// import { getContractInstance, getErc20Balanceof, getProvider } from "../utils/web3Libs/ethers";
// import { incresePowerByDecimals } from "../utils/helper";

// bg.config({ DECIMAL_PLACES: 18 });

// export function useSimulate() {
//     const { mutateAsync: calculategasCost } = useCalculateGasCost();

//     const { smartAccount, selectedNetwork }: iGlobal = useGlobalStore((state) => state);

//     const {
//         fromChainId,
//         toChainId,
//         srcPoolId,
//         destPoolId,
//         tokenIn,
//         amountIn,
//         tokenInDecimals,
//         isThisAmount,
//         contractIndex,
//         allNetworkData,
//         currentAbi,
//         currentFunc,
//         params,

//         setSimulationLoading,
//         setGasUsed,
//         setGasCost,
//         setBridgeGasCost,
//         setSimulateInputData,
//         setSimulation,
//         setIsSimulationOpen,
//         setIsSimulationSuccessOpen,
//         setIsSimulationErrorOpen,
//         setsimulationErrorMsg,
//         setSendtxLoading,
//         setSendtxLoadingForEoa,
//         setTxHash,
//     }: iCrossChainDifi = useCrossChainDifiStore((state) => state);

//     async function simulateTx({ funcIndex, address }) {
//         try {
//             setSendtxLoading(false);
//             setSendtxLoadingForEoa(false);
//             setSimulationLoading(true);
//             setGasUsed(0);
//             setGasCost(0);
//             setBridgeGasCost(0);
//             setSimulateInputData("");
//             setSimulation("");
//             setTxHash("");

//             if (!smartAccount) {
//                 toast.error("You need to login");
//                 return;
//             };
//             if (contractIndex == "") {
//                 toast.error("Enter contractIndex field");
//                 return;
//             };
//             if (!amountIn) {
//                 toast.error("Enter amountIn field");
//                 return;
//             };
//             if (!isThisAmount) {
//                 toast.error("Select amount field");
//                 return;
//             };
//             if (!allNetworkData) {
//                 toast.error("a need to fetch");
//                 return;
//             };
//             const _tempAmount = BigNumber.from(await incresePowerByDecimals(amountIn, tokenInDecimals).toString());

//             const provider = await getProvider(selectedNetwork.chainId);
//             const fromStarGateRouter = allNetworkData.starGateRouter;
//             const toUsdc = allNetworkData.tokens.usdc;
//             const toChainPing = allNetworkData.chainPing;

//             const abi = ethers.utils.defaultAbiCoder;
//             const USDT = await getContractInstance(tokenIn, IERC20, provider);
//             if (!USDT) return;
//             const balance = await getErc20Balanceof(USDT, smartAccount.address);
//             // if (BigNumber.from(balance).lt(BigNumber.from(amountIn))) {
//                 // toast.error("You don't have enough balance");
//                 // return ;
//             // };

//             const approveData = await USDT.populateTransaction.approve(fromStarGateRouter, _tempAmount);
//             const approveTx = { to: approveData.to, data: approveData.data };

//             const amountAfterSlippage = await calculateFees(
//                 address,
//                 _tempAmount,
//                 srcPoolId,
//                 destPoolId,
//                 toChainId,
//                 fromStarGateRouter,
//                 provider
//             );
//             params[funcIndex][isThisAmount] = amountAfterSlippage.toString();

//             let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi);

//             // const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
//             const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(
//                 currentFunc,
//                 params[funcIndex]
//             );

//             const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress;
//             const extraOrShareToken = allNetworkData?.contracts[contractIndex].extraOrShareToken;

//             const destChainExecTx = { to: contractAddress, data: destChainExecData };
//             let data;

//             if (toChainId == "106" || toChainId == "111" || toChainId == "184" || toChainId == "109") {
//                 data = abi.encode(
//                     ["uint256", "uint256", "address", "address", "address", "bytes"],
//                     [
//                         BigNumber.from("0"),
//                         amountAfterSlippage,
//                         contractAddress,
//                         address,
//                         extraOrShareToken,
//                         destChainExecTx.data,
//                     ]
//                 );
//             } else {
//                 data = abi.encode(
//                     ["uint256", "uint256", "address", "address", "bytes"],
//                     [BigNumber.from("0"), amountAfterSlippage, contractAddress, address, destChainExecTx.data]
//                 );
//             }

//             // toast.error("toUsdc"+toUsdc)

//             const srcAddress = ethers.utils.solidityPack(["address"], [smartAccount.address]);
//             let abiInterfaceForChainPing = new ethers.utils.Interface(ChainPing);
//             const stargateParams = [fromChainId, srcAddress, _nonce, toUsdc, amountAfterSlippage, data];

//             const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData("sgReceive", stargateParams);
//             const erc20Interface = new ethers.utils.Interface(["function transfer(address _account, uint256 _value)"]);
//             const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [
//                 toChainPing,
//                 amountAfterSlippage,
//             ]);
//             const simulation = await findGasUsedBySimulation(
//                 toUsdc,
//                 toChainPing,
//                 dummmyTranferToCheckData,
//                 encodedDataForChainPing,
//                 true,
//                 chooseChianId(toChainId)
//             );

//             const stargateRouter = await getContractInstance(fromStarGateRouter, IStarGateRouter, provider);
//             if (!stargateRouter) return;
//             const lzParams = {
//                 dstGasForCall: BigNumber.from(simulation.transaction.gas_used).add(BigNumber.from("30000")),
//                 dstNativeAmount: 0,
//                 dstNativeAddr: "0x",
//             };
//             const packedToAddress = ethers.utils.solidityPack(["address"], [toChainPing]);
//             let quoteData = await stargateRouter.quoteLayerZeroFee(
//                 toChainId,
//                 _functionType,
//                 packedToAddress,
//                 data,
//                 lzParams
//             );

//             let stargateTx = await stargateRouter.populateTransaction.swap(
//                 toChainId,
//                 srcPoolId,
//                 destPoolId,
//                 smartAccount.address,
//                 _tempAmount,
//                 0,
//                 lzParams,
//                 packedToAddress,
//                 data,
//                 { value: quoteData[0] }
//             );

//             const gasCost: number | undefined = await calculategasCost(chooseChianId(fromChainId))

//             setGasCost(gasCost!);
//             const _bridgeGasCost = bg(quoteData[0].toString()).dividedBy(1e18);
//             setBridgeGasCost(bg(_bridgeGasCost).toNumber());

//             setGasUsed(simulation.simulation.gas_used);
//             setSimulateInputData(simulation.simulation.input);
//             setSimulation(simulation.simulation.status);
//             setSimulationLoading(false);

//             setIsSimulationOpen(false);
//             if (simulation.simulation.status) {
//                 setIsSimulationSuccessOpen(true);
//             } else {
//                 setIsSimulationErrorOpen(true);
//                 setsimulationErrorMsg(simulation.simulation.error);
//             }

//             console.log("simulation-error: ", simulation.simulation.error);
//         } catch (error: any) {
//             setSimulationLoading(false);
//             setIsSimulationOpen(false);
//             setIsSimulationErrorOpen(true);
//             setsimulationErrorMsg("Simulation Failed");
//             console.log("Simulation Failed: " + error);
//             toast.error(error);
//             return;
//         }
//     }
//     return useMutation(simulateTx);
// }
