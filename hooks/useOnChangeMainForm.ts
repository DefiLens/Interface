import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../store/appStore';
import { _functionType, _nonce, methodWithApi, tokensByNetwork } from '../utils/constants';
import { fetchMethodParams } from '../utils/apis';
import { useSimulate } from './useSimulate';

export function useOnChangeTokenIn() {
    const {
        setTokenIn, setTokenInDecimals, setSrcPoolId, setDestPoolId, setAmountIn
    }: any = useAppStore((state) => state);

      // for e.g usdt -> usdc
    const onChangeTokenInHook = async ({fromChainId, tokenIn}) => {
        const token = tokensByNetwork[fromChainId]
        if (tokenIn == "usdc") {
            setTokenIn(token.usdc)
            setTokenInDecimals(6)
            setSrcPoolId(1)
            setDestPoolId(1)
        }
        // else if (tokenIn == "usdt") {
        //     setTokenIn(polygonUSDTAddress)
        //     setTokenInDecimals(6)
        //     setSrcPoolId(2)
        //     setDestPoolId(2)
        // } else if (tokenIn == "dai") {
        //     setTokenIn(polygonDAIAddress)
        //     setTokenInDecimals(18)
        //     setSrcPoolId(3)
        //     setDestPoolId(3)
        // }
        setAmountIn("")
    }
    return useMutation(onChangeTokenInHook);
}

export function useOnChangeFunctions() {
    const {
        setParams,
        setFixParams,
        setCurrentFunc,
        setCurrentFuncIndex,
        setIsThisFieldAmount,
        setGasUsed,
        setSimulateInputData,
        setSimulation,
        setIsSimulationOpen,
        setIsSimulationSuccessOpen,
        setIsSimulationErrorOpen,
        setsimulationErrorMsg,
        smartAccount,
        allNetworkData,
        contractIndex,
        funcArray,
        fromChainId,
        toChainId,
        amountIn,
        params
    }: any = useAppStore((state) => state);
    const { mutateAsync: simulateTx } = useSimulate();

      // for e.g usdt -> usdc
      const onChangeFunctionsHook = async ({funcIndex, address}) => {
        try {
            setParams("")
            setFixParams("")

            const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress
            const apiUrl = methodWithApi[toChainId][contractAddress][funcArray[funcIndex].name]
            const response: any = await fetchMethodParams(fromChainId, toChainId, funcArray, amountIn, smartAccount, address, funcIndex, funcArray[funcIndex].name, apiUrl)
            if (!response.data) throw ("api error")

            let _func = [...params]
            _func[funcIndex] = response.data.params
            setParams(_func)
            setFixParams(response.data.fixParams)
            setCurrentFunc(funcArray[funcIndex].name)
            setCurrentFuncIndex(funcIndex)
            setIsThisFieldAmount(response.data.amountFieldIndex)

            setGasUsed(undefined)
            setSimulateInputData(undefined)
            setSimulation(undefined)

            // setIsSimulationOpen(undefined);
            setIsSimulationSuccessOpen(undefined);
            setIsSimulationErrorOpen(undefined);
            setsimulationErrorMsg("");
            // await simulateTx({ funcIndex, address });

        } catch (error) {
          console.log("onChangeFunctions:error: ", error);
        }
    }

    return useMutation(onChangeFunctionsHook);
}

export function useOnChangeInput() {
    const {
        setParams,
        setCurrentFunc,
        funcArray,
        amountIn,
        params
    }: any = useAppStore((state) => state);

    const onChangeInputHook = async ({
        funcIndex,
        inputIndex,
        inputValue,
    }) => {
        try {
            if (!amountIn) throw ("Enter amountIn field above")
            setCurrentFunc(funcArray[funcIndex].name)
            let _params: any = []

            if (params[funcIndex] != undefined) {
                _params = [...params[funcIndex]]
                _params[inputIndex] = inputValue
            } else {
                _params[inputIndex] = inputValue
            }

            let _func = [...params]
            _func[funcIndex] = _params
            setParams(_func)
        } catch (error) {
            alert('InputError: '+ error)
        }
    }
    return useMutation(onChangeInputHook);
}


