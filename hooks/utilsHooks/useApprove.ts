import { BigNumber, ethers } from "ethers";

import { useMutation } from "@tanstack/react-query";

import IERC20 from "../../abis/IERC20.json";
import { getContractInstance, getErc20Allownace } from "../../utils/web3Libs/ethers";
import { tApprove } from "../types";

export function useApprove() {
    async function approve({ tokenIn, spender, amountIn, address, web3JsonProvider }: tApprove) {
    console.log("🚀 ~ approve ~ tokenIn, spender, amountIn, address, web3JsonProvider:", typeof tokenIn, typeof spender, typeof amountIn, typeof address, typeof web3JsonProvider)

        try {
            const erc20 = await getContractInstance(tokenIn, IERC20, web3JsonProvider);
            const allowance = await getErc20Allownace(erc20, address, spender);
            if (BigNumber.from(allowance).gte(amountIn)) return;
            const erc20Interface = new ethers.utils.Interface(["function approve(address _spender, uint256 _value)"]);
            let approveEncodedData = erc20Interface.encodeFunctionData("approve", [spender, amountIn]);
            let approveTx = {
                to: tokenIn,
                data: approveEncodedData,
            };
            return approveTx;
        } catch (error) {
            console.log("approve-error", error);
        }
    }

    return useMutation(approve);
}
