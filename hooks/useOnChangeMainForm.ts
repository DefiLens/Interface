import { useMutation } from "@tanstack/react-query";

import { useSimulate } from "./useSimulate";
import { setSafeState } from "../utils/helper";
import { fetchMethodParams } from "../utils/apis";
import { useGlobalStore, iGlobal } from "../store/GlobalStore";
import { useCrossChainDifiStore, iCrossChainDifi } from "../store/CrossChainDifiStore";
import { tokensByNetwork, methodWithApi, _nonce, _functionType } from "../utils/constants";
import { BigNumber } from "ethers";
import { BigNumber as bg } from "bignumber.js";
bg.config({ DECIMAL_PLACES: 18 });

export function useOnChangeTokenIn() {
    const { setTokenIn, setTokenInDecimals, setSrcPoolId, setDestPoolId, setAmountIn }: iCrossChainDifi =
        useCrossChainDifiStore((state) => state);

    // for e.g usdt -> usdc
    const onChangeTokenInHook = async ({ fromChainId, tokenIn }) => {
        const token = tokensByNetwork[fromChainId];
        if (tokenIn == "usdc") {
            setTokenIn(token.usdc);
            setTokenInDecimals(6);
            setSrcPoolId(1);
            setDestPoolId(1);
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
        setAmountIn("");
    };
    return useMutation(onChangeTokenInHook);
}

export function useOnChangeFunctions() {
    const { smartAccount }: iGlobal = useGlobalStore((state) => state);

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
        allNetworkData,
        contractIndex,
        funcArray,
        fromChainId,
        toChainId,
        amountIn,
        tokenInDecimals,
        params,
    }: iCrossChainDifi = useCrossChainDifiStore((state) => state);

    const { mutateAsync: simulateTx } = useSimulate();

    // for e.g usdt -> usdc
    const onChangeFunctionsHook = async ({ funcIndex, address }) => {
        try {
            setParams([]);
            setFixParams([]);
            const _tempAmount = BigNumber.from(bg(amountIn).multipliedBy(bg(10).pow(tokenInDecimals)).toString());

            const contractAddress = allNetworkData?.contracts[contractIndex].contractAddress;
            const apiUrl = methodWithApi[toChainId][contractAddress][funcArray?.[funcIndex].name];
            const response: any = await fetchMethodParams(
                fromChainId,
                toChainId,
                funcArray,
                _tempAmount,
                smartAccount,
                address,
                funcIndex,
                funcArray?.[funcIndex].name,
                apiUrl
            );
            if (!response.data) throw "api error";

            let _func = [...params];
            _func[funcIndex] = response.data.params;
            setParams(_func);
            setFixParams(response.data.fixParams);
            setSafeState(setCurrentFunc, funcArray?.[funcIndex].name, "");
            setCurrentFuncIndex(funcIndex);
            setIsThisFieldAmount(response.data.amountFieldIndex);

            setGasUsed(0);
            setSimulateInputData("");
            setSimulation("");

            // setIsSimulationOpen(false);
            setIsSimulationSuccessOpen(false);
            setIsSimulationErrorOpen(false);
            setsimulationErrorMsg("");
            // await simulateTx({ funcIndex, address });
        } catch (error) {
            console.log("onChangeFunctions:error: ", error);
        }
    };

    return useMutation(onChangeFunctionsHook);
}

export function useOnChangeInput() {
    const { setParams, setCurrentFunc, funcArray, amountIn, params }: iCrossChainDifi = useCrossChainDifiStore(
        (state) => state
    );

    const onChangeInputHook = async ({ funcIndex, inputIndex, inputValue }) => {
        try {
            if (!amountIn) throw "Enter amountIn field above";
            setSafeState(setCurrentFunc, funcArray?.[funcIndex].name, "");

            let _params: any = [];

            if (params[funcIndex] != undefined) {
                _params = [...params[funcIndex]];
                _params[inputIndex] = inputValue;
            } else {
                _params[inputIndex] = inputValue;
            }

            let _func = [...params];
            _func[funcIndex] = _params;
            setParams(_func);
        } catch (error) {
            alert("InputError: " + error);
        }
    };
    return useMutation(onChangeInputHook);
}
