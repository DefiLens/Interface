import { ethers, BigNumber } from "ethers";

import { useMutation } from "@tanstack/react-query";

import IERC20 from "../abis/IERC20.json";
import { getErc20Allownace, getContractInstance } from "../utils/web3Libs/ethers";

export function useApprove() {
    async function approve({ tokenIn, spender, amountIn, address, web3JsonProvider }: any) {
        try {
            const erc20: any = await getContractInstance(tokenIn, IERC20, web3JsonProvider);
            const allowance: any = await getErc20Allownace(erc20, address, spender);
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
