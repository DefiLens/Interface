import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../store/appStore';
import { fetchContractDetails } from '../utils/helper';
import { V3_SWAP_ROUTER_ADDRESS, _functionType, _nonce } from '../utils/constants';
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router';
import { TradeType, Percent, Token, CurrencyAmount } from '@uniswap/sdk-core';
import { getContractInstance, getErc20Allownace, getErc20Data, getProvider } from '../utils/web3Libs/ethers';
import { parseUnits } from 'ethers/lib/utils';
import { BigNumber, ethers } from 'ethers';
import IERC20 from "../abis/IERC20.json";

export function useApprove() {
    async function approve({tokenIn, spender, amountIn, address, web3JsonProvider}: any) {
        try {
          console.log('tokenIn- -', tokenIn);
            // const web3JsonProvider = await getProvider('109')
            // Check if allowance is already given
            // const erc20Data: any = await getErc20Data(
            //     tokenIn,
            //     address,
            //     spender,
            //     web3JsonProvider
            // );
            const erc20: any = await getContractInstance(tokenIn, IERC20, web3JsonProvider);
            const allowance: any = await getErc20Allownace(erc20, address, spender);

            console.log('tokenIn- ', tokenIn);
            console.log('spender- ', spender);
            console.log('approveCheck1- ', allowance.toString());
            console.log('approveCheck2- ', amountIn.toString());
            if (BigNumber.from(allowance).gte(amountIn)) return;

            const erc20Interface = new ethers.utils.Interface([
              'function approve(address _spender, uint256 _value)',
            ]);
            let approveEncodedData = erc20Interface.encodeFunctionData('approve', [
              spender,
              amountIn,
            ]);
            let approveTx = {
              to: tokenIn,
              data: approveEncodedData,
            };

            return approveTx;
          } catch (error) {
            console.log('approve-error', error);
          }
    }
    return useMutation(approve);
}
