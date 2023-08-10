import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../store/appStore';
import { toast } from "react-hot-toast";
import { getContractInstance, getErc20Balanceof } from '../utils/web3Libs/ethers';
import { BigNumber, ethers } from 'ethers';
import { batch, calculateFees, chooseChianId } from '../utils/helper';
import { _functionType, _nonce } from '../utils/constants';
import IERC20 from "../abis/IERC20.json";
import ChainPing from "../abis/ChainPing.json";

export function useSimulate() {
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

        setSimulationLoading,
        setGasUsed,
        setSimulateInputData,
        setSimulation,
        setIsSimulationOpen,
        setIsSimulationSuccessOpen,
        setIsSimulationErrorOpen,
        setsimulationErrorMsg,
        setSendtxLoading,
        setSendtxLoadingForEoa,
        setTxHash
    }: any = useAppStore((state) => state);

    async function simulateTx({funcIndex, address}) {
        try {
            setSendtxLoading(false)
            setSendtxLoadingForEoa(false)
            setSimulationLoading(true)
            setGasUsed(undefined)
            setSimulateInputData(undefined)
            setSimulation(undefined)
            setTxHash("")

            if (!smartAccount) throw "You need to login"
            if (contractIndex == "") throw "Enter contractIndex field"
            if (amountIn == "") throw "Enter amountIn field"
            if (isThisAmount < 0) throw "Select amount field"
            if(!allNetworkData) throw "a need to fetch"

            const fromStarGateRouter = allNetworkData.starGateRouter
            const toUsdc = allNetworkData.tokens.usdc
            const toChainPing = allNetworkData.chainPing

            const abi = ethers.utils.defaultAbiCoder
            const USDT = await getContractInstance(tokenIn, IERC20, smartAccount.provider)
            if (!USDT) return
            const balance = await getErc20Balanceof(USDT, smartAccount.address)
            if (BigNumber.from(balance).lt(BigNumber.from(amountIn))) throw "You don't have enough balance"

            const approveData = await USDT.populateTransaction.approve(fromStarGateRouter, amountIn)
            const approveTx = {to: approveData.to, data: approveData.data}
            console.log("approveTx", approveTx)

            console.log("params1", params[funcIndex])
            const amountAfterSlippage = await calculateFees(
                address,
                amountIn,
                srcPoolId,
                destPoolId,
                toChainId,
                fromStarGateRouter,
                smartAccount.provider
            )
            params[funcIndex][isThisAmount] = amountAfterSlippage.toString()
            console.log("params2", params[funcIndex], currentFunc)
            console.log('params3: ', [toUsdc, params[funcIndex][1], address, 0])

            let abiInterfaceForDestDefiProtocol = new ethers.utils.Interface(currentAbi)
            console.log("abiInterfaceForDestDefiProtocol", abiInterfaceForDestDefiProtocol, currentFunc)

            // const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(currentFunc, params[funcIndex])
            const destChainExecData = abiInterfaceForDestDefiProtocol.encodeFunctionData(
                currentFunc,
                params[funcIndex]
            )
            console.log("destChainExecData", destChainExecData)

            const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress
            const extraOrShareToken = allNetworkData?.contracts[contractIndex].extraOrShareToken

            const destChainExecTx = {to: contractAddress, data: destChainExecData,}
            let data
            if (toChainId == '106' || toChainId == '111' || toChainId == "184") {
              data = abi.encode(
                ["uint256", "uint256", "address", "address", "address", "bytes"],
                [BigNumber.from("0"), amountAfterSlippage, contractAddress, address, extraOrShareToken, destChainExecTx.data,]
              )
            } else {
                data = abi.encode(
                    ["uint256", "uint256", "address", "address", "bytes"],
                    [BigNumber.from("0"), amountAfterSlippage, contractAddress, address, destChainExecTx.data,]
                )
            }

            const srcAddress = ethers.utils.solidityPack(["address"], [smartAccount.address])
            let abiInterfaceForChainPing = new ethers.utils.Interface(ChainPing)
            const stargateParams = [
                fromChainId,
                srcAddress,
                _nonce,
                toUsdc,
                amountAfterSlippage,
                data,
            ]
            const encodedDataForChainPing = abiInterfaceForChainPing.encodeFunctionData("sgReceive", stargateParams)
            const erc20Interface = new ethers.utils.Interface([
                "function transfer(address _account, uint256 _value)",
            ])
            const dummmyTranferToCheckData = erc20Interface.encodeFunctionData("transfer", [toChainPing, amountAfterSlippage])
            const simulation = await batch(
                toUsdc,
                toChainPing,
                dummmyTranferToCheckData,
                encodedDataForChainPing,
                true,
                chooseChianId(toChainId)
            )

            setGasUsed(simulation.simulation.gas_used);
            setSimulateInputData(simulation.simulation.input);
            setSimulation(simulation.simulation.status);
            setSimulationLoading(false);

            setIsSimulationOpen(false);
            if (simulation.simulation.status) {
              setIsSimulationSuccessOpen(true);
            } else {
              setIsSimulationErrorOpen(true);
              setsimulationErrorMsg(simulation.simulation.error);
            }

            console.log("simulation-error: ", simulation.simulation.error);
            console.log("simulation-status: ", simulation.simulation.status);
            console.log("simulation-input: ", simulation.simulation.input);
            console.log("simulation-method: ", simulation.simulation.method);
            console.log("simulation-gasused: ", simulation.simulation.gas_used);

        } catch (error: any) {
            setSimulationLoading(false);
            setIsSimulationOpen(false);
            setIsSimulationErrorOpen(true);
            setsimulationErrorMsg("Simulation Failed");
            console.log("Simulation Failed: " + error);
            toast.error(error);
            return;
        }
    }
    return useMutation(simulateTx);
}
