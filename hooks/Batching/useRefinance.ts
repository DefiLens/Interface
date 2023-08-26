import { useMutation } from "@tanstack/react-query";
import { useAppStore } from "../../store/appStore";
import { fetchContractDetails } from "../../utils/helper";
import { V3_SWAP_ROUTER_ADDRESS, _functionType, _nonce } from "../../utils/constants";
import { AlphaRouter, SwapType } from "@uniswap/smart-order-router";
import { TradeType, Percent, Token, CurrencyAmount } from "@uniswap/sdk-core";
import { getContractInstance, getErc20Data, getProvider } from "../../utils/web3Libs/ethers";
import { parseUnits } from "ethers/lib/utils";
import { ethers } from "ethers";
import { useUniswap } from "../useUniswap";
import { useApprove } from "../useApprove";
import { useBiconomyProvider } from "../aaProvider/useBiconomyProvider";
import { useEoaProvider } from "../aaProvider/useEoaProvider";

const abiFetcherNum = {
    cUSDC: "1",
    aUSDC: "2",
    aUSDT: "2",
    aDAI: "2",
    aWETH: "2",
    aWMATIC: "2",
    aAAVE: "2",
    aWBTC: "2",
    dForceUSDC: "3",
};

const abiFetcher = {
    "1": {
        depositAbi: "function supply(address asset, uint256 amount)",
        withdrawAbi: "function withdraw(address asset,uint256 amount)",
        depositMethodName: "supply",
        withdrawMethodName: "withdraw",
        depositParamDetailsMethod: "compound_supply",
        withdrawParamDetailsMethod: "compound_withdraw",
        contractAddress: "0xF25212E676D1F7F89Cd72fFEe66158f541246445",
    },
    "2": {
        depositAbi: "function deposit(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)",
        withdrawAbi: "function withdraw(address asset, uint256 amount, address to)",
        depositMethodName: "deposit",
        withdrawMethodName: "withdraw",
        paramDetailsMethod: "aave_withdraw",
        depositParamDetailsMethod: "aave_deposit",
        withdrawParamDetailsMethod: "aave_withdraw",
        contractAddress: "0x8dFf5E27EA6b7AC08EbFdf9eB090F32ee9a30fcf",
    },
    "3": {
        depositAbi: "function mint(address _recipient, uint256 _mintAmount)",
        withdrawAbi: "function redeem(address _from, uint256 _redeemiToken)",
        depositMethodName: "mint",
        withdrawMethodName: "redeem",
        paramDetailsMethod: "dForce_withdraw",
        depositParamDetailsMethod: "dForce_deposit",
        withdrawParamDetailsMethod: "dForce_withdraw",
        contractAddress: "0x5268b3c4afb0860D365a093C184985FCFcb65234",
    },
};

const nativeTokenNum = {
    cUSDC: "1",
    aUSDC: "1",
    aUSDT: "2",
    aDAI: "3",
    aWETH: "4",
    aWMATIC: "5",
    aAAVE: "6",
    aWBTC: "7",
    dForceUSDC: "1",
};

const nativeTokenFetcher = {
    "1": {
        nativeToken: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    },
    "2": {
        nativeToken: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    },
    "3": {
        nativeToken: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    },
    "4": {
        nativeToken: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    },
    "5": {
        nativeToken: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
    "6": {
        nativeToken: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    },
    "7": {
        nativeToken: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    },
};

async function buildParams({ tokenIn, tokenOut, nativeTokenIn, nativeTokenOut, amount, address, paramDetailsMethod }) {
    if (paramDetailsMethod == "aave_deposit") {
        return [nativeTokenIn, amount, address, 0];
    } else if (paramDetailsMethod == "aave_withdraw") {
        return [nativeTokenIn, amount, address];
    } else if (paramDetailsMethod == "compound_supply") {
        return [nativeTokenIn, amount];
    } else if (paramDetailsMethod == "compound_withdraw") {
        return [nativeTokenIn, amount];
    } else if (paramDetailsMethod == "dForce_deposit") {
        return [address, amount];
    } else if (paramDetailsMethod == "dForce_withdraw") {
        return [address, amount];
    }
}

export function useRefinance() {
    const { mutateAsync: swap } = useUniswap();
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: sendToBiconomy } = useBiconomyProvider();
    const { mutateAsync: sendTxTrditionally } = useEoaProvider();
    const { setTxHash, setSendtxLoading, setSendtxLoadingForEoa }: any = useAppStore((state) => state);

    async function refinance({ isSCW, tokenIn, tokenInName, tokenOut, tokenOutName, amount, address, provider }: any) {
        try {
            setTxHash("");
            if (isSCW) {
                setSendtxLoading(true);
            } else {
                setSendtxLoadingForEoa(true);
            }
            const tempTxs: any = [];
            let abiNum = abiFetcherNum[tokenInName];
            let abi = abiFetcher[abiNum]["withdrawAbi"];
            let methodName = abiFetcher[abiNum]["withdrawMethodName"];
            let paramDetailsMethod = abiFetcher[abiNum]["withdrawParamDetailsMethod"];
            let tokenInContractAddress = abiFetcher[abiNum]["contractAddress"];

            console.log("tokenInName", tokenInName, tokenInContractAddress);

            const tokenInNum = nativeTokenNum[tokenInName];
            console.log("tokenInNum", tokenInNum);
            const nativeTokenIn = nativeTokenFetcher[tokenInNum].nativeToken;
            console.log("nativeTokenIn", nativeTokenIn);

            const tokenOutNum = nativeTokenNum[tokenOutName];
            const nativeTokenOut = nativeTokenFetcher[tokenOutNum].nativeToken;
            console.log("nativeTokenOut", nativeTokenOut);

            const isSwap = nativeTokenIn != nativeTokenOut ? true : false;

            let abiInterface = new ethers.utils.Interface([abi]);
            let params = await buildParams({
                tokenIn,
                tokenOut,
                nativeTokenIn,
                nativeTokenOut,
                amount,
                address,
                paramDetailsMethod,
            });
            let txData = abiInterface.encodeFunctionData(methodName, params);
            const tx1 = { to: tokenInContractAddress, data: txData };
            console.log("tx1", tx1);
            tempTxs.push(tx1);

            let swapData;
            if (isSwap) {
                console.log("isSwap", isSwap);
                const approveData = await approve({
                    tokenIn: nativeTokenIn,
                    spender: V3_SWAP_ROUTER_ADDRESS,
                    amountIn: amount,
                    address,
                    web3JsonProvider: provider,
                });
                if (approveData) tempTxs.push(approveData);
                swapData = await swap({
                    tokenIn: nativeTokenIn, //: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                    tokenOut: nativeTokenOut, // nativeTokenOut, //: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                    amountIn: amount, //: BigNumber.from('1000000'),
                    address,
                    type: "exactIn",
                });
                tempTxs.push(swapData.swapTx);
            }

            const newTokenIn = isSwap ? nativeTokenOut : nativeTokenIn;
            const newAmount = isSwap ? swapData.amountOutprice : amount;

            abiNum = abiFetcherNum[tokenOutName];
            abi = abiFetcher[abiNum]["depositAbi"];
            methodName = abiFetcher[abiNum]["depositMethodName"];
            paramDetailsMethod = abiFetcher[abiNum]["depositParamDetailsMethod"];
            const tokenOutContractAddress = abiFetcher[abiNum]["contractAddress"];
            console.log(
                "tokenOutContractAddress",
                tokenOutContractAddress,
                paramDetailsMethod,
                methodName,
                abi,
                provider
            );

            const approveData = await approve({
                tokenIn: newTokenIn,
                spender: tokenOutContractAddress,
                amountIn: newAmount,
                address,
                web3JsonProvider: provider,
            });
            if (approveData) tempTxs.push(approveData);

            abiInterface = new ethers.utils.Interface([abi]);
            params = await buildParams({
                tokenIn,
                tokenOut,
                nativeTokenIn: newTokenIn,
                nativeTokenOut: "",
                amount: newAmount,
                address,
                paramDetailsMethod,
            });
            txData = abiInterface.encodeFunctionData(methodName, params);
            const tx2 = { to: tokenOutContractAddress, data: txData };
            tempTxs.push(tx2);
            console.log("tempTxs", tempTxs);

            if (isSCW) {
                await sendToBiconomy(tempTxs);
            } else {
                await sendTxTrditionally(tempTxs);
            }
            return tempTxs;
        } catch (error) {
            setSendtxLoading(false);
            setSendtxLoadingForEoa(false);
            console.log("refinance-error", error);
        }
    }
    return useMutation(refinance);
}

// tokenIn -> aUSDC -> withdraw
