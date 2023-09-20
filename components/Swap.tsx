import * as React from "react";

import { ethers, BigNumber } from "ethers";
import { BigNumber as bg } from "bignumber.js";

import { useAddress } from "@thirdweb-dev/react";

import IERC20 from "../abis/IERC20.json";
import { setSafeState } from "../utils/helper";
import { useUniswap } from "../hooks/useUniswap";
import { useApprove } from "../hooks/useApprove";
import { useSwapStore, iSwap } from "../store/SwapStore";
import { useGlobalStore, iGlobal } from "../store/GlobalStore";
import { useEoaProvider } from "../hooks/aaProvider/useEoaProvider";
import { getProvider, getErc20Decimals } from "../utils/web3Libs/ethers";
import { useBiconomyProvider } from "../hooks/aaProvider/useBiconomyProvider";
import { V3_SWAP_ROUTER_ADDRESS, BIG_ZERO, _nonce, _functionType } from "../utils/constants";
import ChainContext from "../Context/ChainContext";

const Swap: React.FC<{}> = () => {

    const address = useAddress(); // Detect the connected address
    const { mutateAsync: swap } = useUniswap();
    const { mutateAsync: approve } = useApprove();
    const { mutateAsync: sendTxTrditionally } = useEoaProvider();
    const { mutateAsync: sendToBiconomy } = useBiconomyProvider();
    const { selectedChainId } = React.useContext(ChainContext);

    const { smartAccount }: iGlobal = useGlobalStore((state) => state);

    const {
        tokenInDecimals,
        setTokenInDecimals,
        tokenOutDecimals,
        setTokenOutDecimals,
        amountOutAfterSlippage,
        setAmountOutAfterSlippage,
        tokenIn,
        setTokenIn,
        tokenOut,
        setTokenOut,
        amountIn,
        setAmountIn,
        amountOut,
        setAmountOut,
        slippage,
        setSlippage,
    }: iSwap = useSwapStore((state) => state);

    const handleTokenIn = async (_tokenIn: any) => {
        setTokenIn(_tokenIn);
        const web3JsonProvider = await getProvider(selectedChainId);
        const erc20 = await new ethers.Contract(_tokenIn, IERC20, web3JsonProvider);
        const decimals = await getErc20Decimals(erc20);
        setSafeState(setTokenInDecimals, decimals, 0);

    };
    const handleTokenOut = async (_tokenOut: any) => {
        setTokenOut(_tokenOut);
        const web3JsonProvider = await getProvider(selectedChainId);
        const erc20 = await new ethers.Contract(_tokenOut, IERC20, web3JsonProvider);
        const decimals = await getErc20Decimals(erc20);
        setSafeState(setTokenOutDecimals, decimals, 0);
    };
    const handleAmountIn = async (_amountIn) => {
        if (!smartAccount) {
            alert("You need to biconomy login");
            return;
        }
        if (_amountIn) {
            let amountInByDecimals = bg(_amountIn);
            amountInByDecimals = amountInByDecimals.multipliedBy(bg(10).pow(tokenInDecimals));
            if (amountInByDecimals.eq(0)) {
                setAmountIn(_amountIn);
            } else {
                setAmountIn(amountInByDecimals.toString());
            }
        } else {
            console.log("5");
            setAmountIn("");
        }
        console.log("6");
    };

    const handleAmountOut = async (_amountOut: any) => {
        setAmountOut(_amountOut);
    };
    const handleSlippage = async (_slippage: any) => {
        console.log("_slippage", _slippage);
        setSlippage(_slippage);
        console.log("amountOut", amountOut.toString());
        const amountAfterSlippage = bg(amountOut).minus(bg(amountOut).multipliedBy(_slippage).div(100));
        console.log("amountAfterSlippage", amountAfterSlippage.toString());
        setSafeState(setAmountOutAfterSlippage, BigNumber.from(amountAfterSlippage), BIG_ZERO);
    };

    const sendTx = async (isScw: boolean) => {
        try {
            if (!smartAccount) throw "please login by scw";
            if (!address) throw "please login by metamask";
            const web3JsonProvider = await getProvider(selectedChainId);
            let _address = isScw ? smartAccount.address : address;
            let _provider = isScw ? smartAccount.provider : web3JsonProvider;
            alert("_address: " + _address);
            const approveData = await approve({
                tokenIn,
                spender: V3_SWAP_ROUTER_ADDRESS,
                amountIn,
                address: _address,
                web3JsonProvider: _provider,
            });
            console.log("approveData--", approveData, amountIn.toString());
            const swapData = await swap({
                tokenIn, //: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                tokenOut, //: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                amountIn, //: BigNumber.from('1000000'),
                address: _address,
                type: "exactIn",
            });
            console.log("swapData--", swapData);

            if (swapData?.amountOutprice) {
                let amountOutByDecimals = bg(swapData?.amountOutprice);
                amountOutByDecimals = amountOutByDecimals.multipliedBy(bg(10).pow(tokenOutDecimals));
                if (amountOutByDecimals.eq(0)) {
                    setAmountOut(swapData?.amountOutprice);
                    if (BigNumber.from(slippage).gt(0)) {
                        const amountAfterSlippage = bg(swapData?.amountOutprice).minus(
                            bg(swapData?.amountOutprice).multipliedBy(slippage).div(100)
                        );
                        console.log("amountAfterSlippage-1", amountAfterSlippage.toString());
                        setSafeState(setAmountOutAfterSlippage, BigNumber.from(amountAfterSlippage), BIG_ZERO);
                    }
                } else {
                    setAmountOut(amountOutByDecimals.toString());
                    if (BigNumber.from(slippage).gt(0)) {
                        const amountAfterSlippage = bg(amountOutByDecimals).minus(
                            bg(amountOutByDecimals).multipliedBy(slippage).div(100)
                        );
                        console.log("amountAfterSlippage-2", amountAfterSlippage.toString());
                        setSafeState(setAmountOutAfterSlippage, BigNumber.from(amountAfterSlippage), BIG_ZERO);
                    }
                }
            } else {
                setAmountOut("");
            }

            if (isScw) {
                if (approveData) {
                    await sendToBiconomy([approveData, swapData?.swapTx]);
                } else {
                    await sendToBiconomy([swapData?.swapTx]);
                }
            } else {
                if (approveData) {
                    await sendTxTrditionally([approveData, swapData?.swapTx]);
                } else {
                    await sendTxTrditionally([swapData?.swapTx]);
                }
            }
        } catch (error) {
            console.log("checkStackUp-error", error);
        }
    };

    return (
        <>
            <button
                type="button"
                className="text-secondary-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-secondary-600 hover:text-white"
                onClick={() => sendTx(true)}
            >
                Check
            </button>
            {!smartAccount && (
                <div className="flex justify-center items-center border-2 border-secondary-800 shadow-sm shadow-primary-950 rounded-lg cursor-pointer">
                    <h3 className="font-semibold text-lg md:text-2xl text-primary-950 py-4 bg-transparent ">
                        Login First!
                    </h3>
                </div>
            )}

            {smartAccount && (
                <div>
                    <div style={{ margin: "5px" }}>
                        <h1>token0</h1>
                        <input
                            placeholder="token0"
                            type="text"
                            value={tokenIn}
                            onChange={(e: any) => handleTokenIn(e.target.value)}
                        />
                    </div>

                    <div style={{ margin: "5px" }}>
                        <h1>token1</h1>
                        <input
                            placeholder="token1"
                            type="text"
                            value={tokenOut}
                            onChange={(e: any) => handleTokenOut(e.target.value)}
                        />
                    </div>

                    <div style={{ margin: "5px" }}>
                        <h1>amountIn</h1>
                        <input
                            type="number"
                            placeholder="amountIn"
                            min="0"
                            value={
                                amountIn != 0
                                    ? bg(amountIn).dividedBy(bg(10).pow(tokenInDecimals)).toString()
                                    : amountIn
                            }
                            onChange={(e: any) => handleAmountIn(e.target.value)}
                        />
                    </div>

                    <div style={{ margin: "5px" }}>
                        <h1>amountOut</h1>
                        <input
                            type="number"
                            placeholder="amountOut"
                            min="0"
                            value={
                                !amountOutAfterSlippage.isZero()
                                    ? bg(amountOutAfterSlippage.toString()).dividedBy(bg(10).pow(tokenOutDecimals)).toString()
                                    : amountOutAfterSlippage.toString()
                            }
                            onChange={(e: any) => handleAmountOut(e.target.value)}
                        />
                    </div>

                    {/* <div style={{margin: "5px"}}>
                        <h1>slippage</h1>
                        <input
                        type="number"
                        placeholder="slippage"
                        min="0"
                        value={slippage}
                        onChange={(e: any) => handleSlippage(e.target.value)}
                        />
                    </div> */}

                    <div style={{ margin: "5px" }}>
                        <button onClick={() => sendTx(true)}>SendTx By SmartAccount</button>
                    </div>

                    <div style={{ margin: "5px" }}>
                        <button onClick={() => sendTx(false)}>SendTx BT EOA</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Swap;